const Anthropic = require("@anthropic-ai/sdk");
const { AssemblyAI } = require("assemblyai");
const fs = require("node:fs");
const path = require("node:path");

const anthropic = new Anthropic();

function getAssemblyAI() {
  if (!process.env.ASSEMBLYAI_API_KEY) {
    throw new Error(
      "ASSEMBLYAI_API_KEY is not set. Add it to your .env file to enable lesson transcription.",
    );
  }
  return new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
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
- If the transcript includes speaker labels (Speaker A, Speaker B), try to identify which is the teacher and which is the student based on who is correcting and who is being corrected

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

async function transcribeAudio(filePath) {
  const client = getAssemblyAI();

  const transcript = await client.transcripts.transcribe({
    audio: filePath,
    speaker_labels: true,
    speech_models: ["universal-2"],
  });

  if (transcript.status === "error") {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  // Format with speaker labels when available — helps Claude identify teacher vs student
  if (transcript.utterances && transcript.utterances.length > 0) {
    return transcript.utterances
      .map((u) => `Speaker ${u.speaker}: ${u.text}`)
      .join("\n");
  }

  return transcript.text || "";
}

const MAX_TRANSCRIPT_CHARS = 6000;

async function analyzeLessonTranscript({ transcript, studentProfile, teacherProfile }) {
  // Truncate very long transcripts to avoid hitting token limits
  const truncated = transcript.length > MAX_TRANSCRIPT_CHARS
    ? transcript.slice(0, MAX_TRANSCRIPT_CHARS) + "\n\n[Transcript truncated — showing first portion of the lesson]"
    : transcript;
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
${truncated}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
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
