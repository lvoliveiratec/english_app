const Anthropic = require("@anthropic-ai/sdk");
const fs = require("node:fs");
const path = require("node:path");

const client = new Anthropic();
const PLACEMENT_QUESTION_COUNT = 15;
const placementQuestionBlueprint = `Generate exactly ${PLACEMENT_QUESTION_COUNT} questions. Do not stop at 8 questions.
Use these exact IDs and this exact order:
q1. grammar gap_fill — test a structure AT the self-reported level (use the exact level's structures from the KB)
q2. grammar gap_fill — test a structure ONE level below (to confirm foundation)
q3. grammar multiple_choice — 3 options, one clearly correct, difficulty matching self-reported level
q4. grammar gap_fill — test one slightly harder structure to probe the next level
q5. vocabulary gap_fill — appropriate for the self-reported level
q6. vocabulary multiple_choice — 3 options, one clearly correct, difficulty matching self-reported level
q7. vocabulary gap_fill — collocation, phrasal verb, or word form suitable for the level
q8. reading comprehension — include a unique 80–110 word passage on an abstract or professional topic (for B2+) or everyday topic (for A1-B1), ask a specific detail question
q9. reading comprehension — include a second unique 80–110 word passage, ask an inference question
q10. reading comprehension — include a third unique 80–110 word passage, ask about vocabulary in context or main idea
q11. listening comprehension — unique short natural dialogue with no blanks, ask one specific detail question
q12. listening comprehension — a DIFFERENT short natural dialogue with no blanks, ask one main idea or detail question
q13. listening comprehension — a THIRD short natural dialogue with no blanks, ask one inference or purpose question
q14. speaking — provide 1-2 sentences for the student to read aloud; the passage field must contain ONLY the text to read (no instructions); the prompt must be "Read the text above aloud."
q15. speaking — provide a short personal-response prompt suitable for the level; passage must be null; the prompt should ask for a 1-3 sentence spoken answer`;

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
- Return exactly 15 questions; never return only the first section of the test
- Reading questions q8, q9, and q10 must use three different passages, topics, prompts, and answers
- Reading passages must be 80–110 words, on a familiar everyday topic
- Listening dialogues must sound natural and conversational
- Listening passages must use speaker labels on separate lines, for example "Speaker A: ..." and "Speaker B: ..."
- Listening questions q11, q12, and q13 must use three different situations, scripts, speakers, and answers
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
- Estimate a score by counting how many submitted questions the student answered correctly
- If the student answers fewer than 50% correctly, place them at least one full level BELOW the self-reported level
- If the student answers fewer than 30% correctly, place them two levels below self-reported
- Do not give benefit of the doubt for wrong answers — only for synonyms or minor spelling variations
- If grammar and vocabulary answers are mostly wrong but reading shows comprehension, note the discrepancy
- Trust the test results over the self-reported level

You MUST respond with valid JSON only — no markdown, no extra text, nothing before or after the JSON object:
{"feedback":"2-3 encouraging sentences describing the result","level":"Beginner","score":73,"priorities":["priority 1","priority 2","priority 3"]}

The level field must be exactly one of: Beginner, Elementary, Intermediate, Upper Intermediate, Advanced
The score field must be an integer from 0 to 100 representing the percentage of submitted questions answered correctly. Round to the nearest whole number.`;

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

function parseQuestionResponse(response, errorMessage) {
  const raw = stripJsonFences(response.content[0].text);
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(errorMessage);
  }
}

function normalizeQuestions(questions) {
  return questions.slice(0, PLACEMENT_QUESTION_COUNT).map((question, index) => ({
    ...question,
    id: `q${index + 1}`,
  }));
}

function normalizeComparableText(value) {
  return (value || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hasDuplicateText(items, fieldName) {
  const seen = new Set();

  for (const item of items) {
    const value = normalizeComparableText(item[fieldName]);
    if (!value) continue;
    if (seen.has(value)) return true;
    seen.add(value);
  }

  return false;
}

function getQuestionRepairReason(questions) {
  if (questions.length !== PLACEMENT_QUESTION_COUNT) {
    return `The test has ${questions.length} questions instead of ${PLACEMENT_QUESTION_COUNT}.`;
  }

  const readingQuestions = questions.filter((question) => question.skill === "reading");
  if (readingQuestions.length !== 3) {
    return `The test has ${readingQuestions.length} reading questions instead of 3.`;
  }

  if (hasDuplicateText(readingQuestions, "passage")) {
    return "The reading questions reuse the same passage. q8, q9, and q10 must each have a different reading text.";
  }

  if (hasDuplicateText(readingQuestions, "prompt")) {
    return "The reading questions reuse the same prompt. q8, q9, and q10 must each ask a different question.";
  }

  return "";
}

function repairReadingDuplicatesLocally(questions, selfReportedLevel) {
  const level = ["Upper Intermediate", "Advanced"].includes(selfReportedLevel) ? "higher" : "general";
  const fallbackReadings = {
    general: [
      {
        passage: "Maya started a small garden behind her apartment building last spring. At first, only two neighbors helped her water the plants. By July, more families joined, and the garden had tomatoes, herbs, and flowers. On Saturdays, the group shared simple recipes and talked about ways to keep the area clean. Children painted small signs for each row, and older residents offered advice about the best time to plant seeds. Maya was surprised that the garden changed more than the empty space. It also helped people in the building learn each other's names.",
        prompt: "What changed after more families joined the garden project?",
      },
      {
        passage: "Jonas usually took the bus to work, but one Monday the route was delayed by road repairs. He decided to walk through a nearby park instead. The walk took fifteen minutes longer, yet he arrived calmer than usual. During the week, he noticed small details he had never seen from the bus, including a coffee stand, a free book exchange, and a quiet path beside a pond. By Friday, Jonas was thinking about walking twice a week because the slower journey made his mornings feel less rushed.",
        prompt: "Why might Jonas choose to walk to work again?",
      },
      {
        passage: "A community center opened a weekend technology class for adults who wanted to feel more confident online. The first lesson focused on sending emails, creating strong passwords, and recognizing suspicious messages. Some students were nervous because they had avoided computers for years. The teacher moved slowly and asked learners to practice each step with a partner. Nobody had to finish quickly, and mistakes were treated as part of learning. By the end of the morning, several students had sent their first photo attachments.",
        prompt: "What is the main idea of the passage?",
      },
    ],
    higher: [
      {
        passage: "When a regional hospital introduced digital appointment reminders, missed visits dropped within three months. Administrators first assumed the improvement came from convenience alone, but patient interviews suggested another reason. The reminders gave people time to arrange transport, childcare, or time away from work. Nurses also noticed that patients arrived with better questions because they had reviewed instructions before leaving home. The project showed that a simple technical change can reveal practical barriers that were previously invisible to staff and improve communication before appointments.",
        prompt: "What practical problem did the reminders help patients solve?",
      },
      {
        passage: "Remote work has allowed some companies to recruit from a wider range of cities, but it has also changed how new employees build trust. Informal conversations no longer happen automatically before meetings or during lunch breaks. As a result, several managers now schedule short peer sessions during the first month. These meetings are not designed for training or performance review. Their purpose is to make collaboration feel less anonymous and to give new staff a clearer sense of team culture.",
        prompt: "Why do some managers schedule short peer sessions for new employees?",
      },
      {
        passage: "A local museum redesigned its climate exhibition after visitors said the original version felt overwhelming. Instead of presenting only global statistics, the new exhibit begins with familiar choices such as home energy use, transport, and food waste. Curators did not remove the scientific data, but they placed it beside practical examples and short stories from nearby families. The change helped visitors connect large environmental trends with decisions they could understand, making the topic feel serious without being impossible to approach.",
        prompt: "In this passage, what does 'overwhelming' suggest about the original exhibition?",
      },
    ],
  };

  const replacements = fallbackReadings[level];
  let readingIndex = 0;
  const repaired = questions.map((question) => {
    if (question.skill !== "reading") return question;
    const replacement = replacements[readingIndex++] || replacements[replacements.length - 1];
    return {
      ...question,
      type: "comprehension",
      passage: replacement.passage,
      prompt: replacement.prompt,
      options: null,
    };
  });

  return repaired;
}

async function repairPlacementQuestions({ profile, selfReportedLevel, questions, reason }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    system: [{ type: "text", text: questionSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `The previous placement test needs repair.

Problem:
${reason || `The previous placement test had ${questions.length} questions, but FluentPath requires exactly ${PLACEMENT_QUESTION_COUNT}.`}

Student profile:
- Native language: ${profile.nativeLanguage || "not specified"}
- Self-reported level: ${selfReportedLevel}
- Learning goal: ${profile.goal || "general English"}

Existing questions:
${JSON.stringify(questions, null, 2)}

Return a COMPLETE corrected JSON object with exactly ${PLACEMENT_QUESTION_COUNT} questions.
Keep any usable existing questions, add or replace broken ones, renumber IDs q1 through q15, and follow this blueprint:

${placementQuestionBlueprint}

Additional repair requirements:
- q8, q9, and q10 must each have a different passage and prompt
- q11, q12, and q13 must each have a different dialogue
- Listening passages must use separate speaker-labeled lines

Return valid JSON only:
{"questions":[{"id":"q1","skill":"grammar","type":"gap_fill","passage":null,"prompt":"...","options":null}]}`,
      },
    ],
  });

  const result = parseQuestionResponse(response, "Failed to repair placement questions.");
  return Array.isArray(result.questions) ? normalizeQuestions(result.questions) : [];
}

async function generatePlacementQuestions({ profile, selfReportedLevel }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    system: [{ type: "text", text: questionSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Generate a placement test for this student:
- Native language: ${profile.nativeLanguage || "not specified"}
- Self-reported level: ${selfReportedLevel}
- Learning goal: ${profile.goal || "general English"}

${placementQuestionBlueprint}

IMPORTANT — difficulty rules:
- For Advanced (C1): use inversion, cleft sentences, nominalization, complex conditionals, register
- For Upper Intermediate (B2): use mixed conditionals, wish structures, passive, relative clauses
- For Intermediate (B1): use past perfect, reported speech, modals, first/second conditional
- For Elementary (A2): use simple past, present perfect, comparatives, must/should
- For Beginner (A1): use present simple, to be, basic questions, can

IMPORTANT — listening rules:
- q11, q12, and q13 must NOT reuse the same dialogue, topic, or answer
- q11, q12, and q13 passages must not include blanks
- Write each turn on its own line with a speaker label, like "Speaker A:" and "Speaker B:"
- Do not make q12 or q13 a rewritten version of q11

IMPORTANT — reading rules:
- q8, q9, and q10 must NOT reuse the same passage
- q8, q9, and q10 must NOT reuse the same prompt
- Use a different topic and correct answer for each reading question

For question 14 (speaking), examples by level:
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
      "id": "q8",
      "skill": "reading",
      "type": "comprehension",
      "passage": "a unique reading text here",
      "prompt": "the comprehension question",
      "options": null
    }
  ]
}`,
      },
    ],
  });

  const result = parseQuestionResponse(response, "Failed to generate placement questions.");

  if (!Array.isArray(result.questions) || result.questions.length === 0) {
    throw new Error("Placement question generation returned empty results.");
  }

  let questions = normalizeQuestions(result.questions);

  const repairReason = getQuestionRepairReason(questions);
  if (repairReason) {
    questions = await repairPlacementQuestions({ profile, selfReportedLevel, questions, reason: repairReason });
  }

  let finalRepairReason = getQuestionRepairReason(questions);
  if (finalRepairReason.includes("reuse")) {
    questions = repairReadingDuplicatesLocally(questions, selfReportedLevel);
    finalRepairReason = getQuestionRepairReason(questions);
  }

  if (finalRepairReason) {
    throw new Error(`Placement question generation returned invalid questions: ${finalRepairReason}`);
  }

  return questions;
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
  const score = Number.isInteger(result.score)
    ? Math.min(Math.max(result.score, 0), 100)
    : null;

  return {
    feedback: result.feedback || "Your placement baseline has been created.",
    level: confirmedLevel,
    score,
    metrics: levelMetrics[confirmedLevel] || levelMetrics.Beginner,
    priorities: Array.isArray(result.priorities) ? result.priorities : [],
  };
}

module.exports = { generatePlacementQuestions, runPlacementAgent };
