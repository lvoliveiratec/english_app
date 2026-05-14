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
- Accept answers that convey the correct meaning, even with minor spelling errors
- Count clearly wrong, irrelevant, or non-English answers as incorrect
- "I don't know", blank answers, or answers in the student's native language count as wrong
- Estimate a score: count how many of the 8 questions the student answered correctly
- If the student scores fewer than 4 out of 8 correct, place them at least one full level BELOW the self-reported level
- If the student scores 2 or fewer correct, place them two levels below self-reported
- Do not give benefit of the doubt for wrong answers — only for synonyms or minor spelling variations
- If grammar and vocabulary answers are mostly wrong but reading shows comprehension, note the discrepancy
- Trust the test results over the self-reported level

You MUST respond with valid JSON only — no markdown, no extra text, nothing before or after the JSON object:
{"feedback":"2-3 encouraging sentences describing the result","level":"Beginner","score":6,"priorities":["priority 1","priority 2","priority 3"]}

The level field must be exactly one of: Beginner, Elementary, Intermediate, Upper Intermediate, Advanced
The score field must be an integer from 0 to 100 representing the percentage of questions answered correctly (e.g. 5 correct out of 8 = 63). Round to the nearest whole number.`;

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

Generate exactly 8 questions in this order:
1. grammar gap_fill — test a structure AT the self-reported level (use the exact level's structures from the KB)
2. grammar gap_fill — test a structure ONE level below (to confirm foundation)
3. vocabulary gap_fill — appropriate for the self-reported level
4. vocabulary multiple_choice — 3 options, one clearly correct, difficulty matching self-reported level
5. reading comprehension — include a 60–80 word passage on an abstract or professional topic (for B2+) or everyday topic (for A1-B1), ask a specific detail question
6. reading comprehension — same passage as #5, ask an inference question
7. listening gap_fill — short natural spoken dialogue with exactly 2 blanks marked as ___ in the passage text; each speaker turn must be on its own line separated by \n (e.g. "Tourist: Hello!\nAgent: Hi there, we ___ you.")
8. speaking — provide 1-2 sentences for the student to read aloud; the passage field must contain ONLY the text to read (no instructions); the prompt must be "Read the text above aloud."

IMPORTANT — difficulty rules:
- For Advanced (C1): use inversion, cleft sentences, nominalization, complex conditionals, register
- For Upper Intermediate (B2): use mixed conditionals, wish structures, passive, relative clauses
- For Intermediate (B1): use past perfect, reported speech, modals, first/second conditional
- For Elementary (A2): use simple past, present perfect, comparatives, must/should
- For Beginner (A1): use present simple, to be, basic questions, can

For question 8 (speaking), examples by level:
- Beginner: "My name is Maria. I work at a hospital."
- Elementary: "Last weekend, I went to the market and bought some fresh vegetables."
- Intermediate: "Although the weather was unpredictable, we decided to go ahead with our plans."
- Upper Intermediate: "It is widely believed that regular exercise improves both physical and mental health."
- Advanced: "Not only did the discovery challenge existing theories, but it also opened new avenues for research."

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
        let context = "";
        if (q.skill === "speaking" && q.passage) {
          context = `\n[Target text to read: "${q.passage}"]`;
        } else if (q.passage) {
          context = `\n[Passage shown: yes]`;
        }
        return `[${q.skill.toUpperCase()}] ${q.prompt}${context}\nStudent answer: ${studentAnswer}`;
      })
      .join("\n\n");

    userMessage = `Evaluate this placement test.

Student profile:
- Native language: ${profile.nativeLanguage || "not specified"}
- Self-reported level: ${level}
- Goal: ${goal}

Test answers:
${qa}`;
  } else {
    userMessage = [
      "Student profile:",
      `- Native language: ${profile.nativeLanguage || "not specified"}`,
      `- Self-reported level: ${level}`,
      `- Main goal: ${goal}`,
      writing ? `\nWriting sample:\n"${writing}"` : "\nNo writing sample provided.",
    ].join("\n");
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: [{ type: "text", text: evaluationSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = stripJsonFences(response.content[0].text);
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error("[placement] evaluation raw response:", response.content[0].text);
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
