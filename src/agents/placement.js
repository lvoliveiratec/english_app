const Anthropic = require("@anthropic-ai/sdk");
const fs = require("node:fs");
const path = require("node:path");

const client = new Anthropic();

function loadKb(...filenames) {
  return filenames
    .map((f) => fs.readFileSync(path.join(__dirname, "../../kb/english", f), "utf8"))
    .join("\n\n---\n\n");
}

const cefrGuide = loadKb("cefr-level-guide.md");
const assessmentKb = loadKb(
  "assessment-grammar.md",
  "assessment-vocabulary.md",
  "assessment-reading.md",
  "assessment-listening.md",
);

const basePrompt = `You are a placement agent for FluentPath English, an English learning platform.
Your job is to assess student English level using CEFR standards (A1 to C1).
Be encouraging and honest. Never fabricate student history.`;

const questionSystemPrompt = `${basePrompt}

Use the assessment guides below to generate placement test questions.

${assessmentKb}

Rules for question generation:
- Create NEW questions inspired by the guides — do not copy examples verbatim
- Match difficulty to the student's self-reported level and one level below
- Reading passages must be 60–80 words, on a familiar everyday topic
- Listening dialogues must sound natural and conversational
- Return valid JSON only, no markdown fences`;

const evaluationSystemPrompt = `${basePrompt}

Use the CEFR guide and assessment rubrics below to evaluate student answers.

${cefrGuide}

---

${assessmentKb}

Rules for evaluation:
- Accept any answer that conveys the correct meaning
- Forgive minor spelling errors
- Look for patterns across all answers, not just individual mistakes
- If grammar is strong but vocabulary is weak, note both
- Return valid JSON only, no markdown fences`;

const levelMetrics = {
  Beginner: { fluency: 12, listening: 18, pronunciation: 10 },
  Elementary: { fluency: 28, listening: 34, pronunciation: 25 },
  Intermediate: { fluency: 52, listening: 58, pronunciation: 48 },
  "Upper Intermediate": { fluency: 70, listening: 76, pronunciation: 66 },
  Advanced: { fluency: 84, listening: 88, pronunciation: 82 },
};

function stripJsonFences(text) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

async function generatePlacementQuestions({ profile, selfReportedLevel }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: [{ type: "text", text: questionSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Generate a placement test for this student:
- Native language: ${profile.nativeLanguage || "not specified"}
- Self-reported level: ${selfReportedLevel}
- Learning goal: ${profile.goal || "general English"}

Generate exactly 7 questions in this order:
1. grammar gap_fill — test a structure from the self-reported level
2. grammar gap_fill — test a structure one level below
3. vocabulary gap_fill — use a word from the level's topic list
4. vocabulary multiple_choice — 3 options, one clearly correct
5. reading comprehension — include a 60–80 word passage, ask about a specific detail
6. reading comprehension — same passage as #5, ask an inference question
7. listening gap_fill — short natural dialogue, mark exactly 2 blanks as ___ in the passage

Return this JSON structure:
{
  "questions": [
    {
      "id": "q1",
      "skill": "grammar",
      "type": "gap_fill",
      "passage": null,
      "prompt": "sentence with ___ for the blank (include verb hint in parentheses if needed)",
      "options": null
    },
    {
      "id": "q4",
      "skill": "vocabulary",
      "type": "multiple_choice",
      "passage": null,
      "prompt": "full sentence or question",
      "options": ["option1", "option2", "option3"]
    },
    {
      "id": "q5",
      "skill": "reading",
      "type": "comprehension",
      "passage": "the shared reading text here",
      "prompt": "the comprehension question",
      "options": null
    }
  ]
}`,
      },
    ],
  });

  const raw = stripJsonFences(response.content[0].text);
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error("Failed to generate placement questions.");
  }

  if (!Array.isArray(result.questions) || result.questions.length === 0) {
    throw new Error("Placement question generation returned empty results.");
  }

  return result.questions;
}

async function runPlacementAgent({ profile, level, goal, questions, answers, writing }) {
  let userMessage;

  if (questions && answers) {
    const qa = questions
      .map((q) => {
        const studentAnswer = answers[q.id] || "(no answer)";
        const passageNote = q.passage ? `\n[Passage shown: yes]` : "";
        return `[${q.skill.toUpperCase()}] ${q.prompt}${passageNote}\nStudent answer: ${studentAnswer}`;
      })
      .join("\n\n");

    userMessage = `Evaluate this placement test.

Student profile:
- Native language: ${profile.nativeLanguage || "not specified"}
- Self-reported level: ${level}
- Goal: ${goal}

Test answers:
${qa}

Return JSON:
{"feedback":"2–3 encouraging sentences about their result","level":"Beginner|Elementary|Intermediate|Upper Intermediate|Advanced","priorities":["specific priority 1","specific priority 2","specific priority 3"]}`;
  } else {
    userMessage = [
      "Student profile:",
      `- Native language: ${profile.nativeLanguage || "not specified"}`,
      `- Self-reported level: ${level}`,
      `- Main goal: ${goal}`,
      writing ? `\nWriting sample:\n"${writing}"` : "\nNo writing sample provided.",
      '\nReturn JSON: {"feedback":"...","level":"...","priorities":["..."]}',
    ].join("\n");
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: [{ type: "text", text: evaluationSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = stripJsonFences(response.content[0].text);
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error("Placement agent returned an invalid response.");
  }

  const confirmedLevel = levelMetrics[result.level] ? result.level : level;

  return {
    feedback: result.feedback || "Your placement baseline has been created.",
    level: confirmedLevel,
    metrics: levelMetrics[confirmedLevel] || levelMetrics.Beginner,
    priorities: Array.isArray(result.priorities) ? result.priorities : [],
  };
}

module.exports = { generatePlacementQuestions, runPlacementAgent };
