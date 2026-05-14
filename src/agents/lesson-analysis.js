const Anthropic = require("@anthropic-ai/sdk");
const OpenAI = require("openai");
const fs = require("node:fs");
const path = require("node:path");

const anthropic = new Anthropic();

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Add it to your .env file to enable lesson transcription.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const correctionPolicy = fs.readFileSync(
  path.join(__dirname, "../../kb/english/correction-policy.md"),
  "utf8",
);
const cefrGuide = fs.readFileSync(
  path.join(__dirname, "../../kb/english/cefr-level-guide.md"),
  "utf8",
);

const systemPrompt = `You are the FluentPath English Teacher Summary Agent. You analyze transcripts of English lessons between a teacher and a student.

Your job is to extract learning signals, identify mistakes, note improvements, and generate practice recommendations.

${cefrGuide}

---

${correctionPolicy}

When analyzing a lesson:
- Identify every grammar or vocabulary mistake the student made
- Note corrections the teacher gave
- Identify new vocabulary the student encountered or used
- Observe fluency signals (hesitation, self-correction, sentence complexity)
- Compare to the student's current level and goal
- Generate 3 specific practice recommendations for the student's next study session

You MUST respond with valid JSON only, no markdown:
{
  "summary": "3–4 sentences describing the lesson overall",
  "mainTopics": ["topic 1", "topic 2"],
  "studentMistakes": [
    {"type": "grammar", "example": "exact quote from transcript", "correction": "correct version", "note": "brief explanation"}
  ],
  "newVocabulary": ["word1", "word2"],
  "teacherFocus": ["what the teacher emphasized"],
  "practiceRecommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"],
  "progressNote": "observation about fluency or confidence relative to the student's level"
}`;

async function transcribeAudio(filePath, mimeType) {
  const openai = getOpenAI();
  const audioStream = fs.createReadStream(filePath);
  const ext = path.extname(filePath).slice(1) || "webm";

  const transcription = await openai.audio.transcriptions.create({
    file: audioStream,
    model: "whisper-1",
    language: "en",
    response_format: "text",
    filename: `recording.${ext}`,
  });

  return transcription;
}

async function analyzeLessonTranscript({ transcript, studentProfile, teacherProfile }) {
  const level = studentProfile?.level || "unknown";
  const goal = studentProfile?.goal || "general English";
  const nativeLang = studentProfile?.nativeLanguage || "not specified";
  const teacherName = teacherProfile?.fullName || "the teacher";
  const specialty = teacherProfile?.specialty || "General English";

  const userMessage = `Analyze this English lesson transcript.

Student profile:
- Level: ${level}
- Goal: ${goal}
- Native language: ${nativeLang}

Teacher: ${teacherName} (specialty: ${specialty})

Transcript:
${transcript}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = response.content[0].text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(raw);
  } catch {
    console.error("[lesson-analysis] raw response:", response.content[0].text);
    throw new Error("Lesson analysis agent returned an invalid response.");
  }
}

module.exports = { transcribeAudio, analyzeLessonTranscript };
