# Agent Architecture

FluentPath English uses agent roles as architectural boundaries for AI features.
Agents are modules within the backend that make Claude API calls and return structured results.

## Implementation Status

| Agent | Spec | Status |
|---|---|---|
| Placement Agent | `agents/placement-agent.md` | ✅ `src/agents/placement.js` |
| Lesson Analysis | `agents/teacher-summary-agent.md` | ✅ `src/agents/lesson-analysis.js` (class recording only) |
| AI Coach | `agents/ai-coach.md` | ⏳ UI placeholder only |
| AI Teacher | `agents/ai-teacher.md` | ⏳ not yet wired |
| Pronunciation Agent | `agents/pronunciation-agent.md` | ⏳ not yet wired |

---

## Placement Agent (implemented)

**File:** `src/agents/placement.js`

### `generatePlacementQuestions({ profile, selfReportedLevel })`

Loads 4 assessment KB files as a cached system prompt. Generates 8 questions:
- Grammar ×2 (gap-fill at self-reported level and one below)
- Vocabulary ×2 (gap-fill + multiple-choice with 3 options)
- Reading ×2 (shared 60-80 word passage, detail + inference)
- Listening ×1 (dialogue cloze, 2 blanks, natural spoken style with `\n` between speakers)
- Speaking ×1 (1-2 sentences to read aloud at appropriate level)

Returns `{ questions: [...] }` where each question has `{ id, skill, type, passage, prompt, options }`.

### `runPlacementAgent({ profile, level, goal, questions, answers, writing })`

Two modes:
- **Full test**: questions + answers → evaluates all 8 questions together
- **Writing sample**: writing → used for auto-placement after signup

Loads CEFR guide + 4 assessment KB files as cached system prompt.

Returns `{ feedback, level, score (0-100%), metrics, priorities }`.

### Level suggestion flow

If `result.level ≠ profile.level`:
- `storage.createLevelSuggestion(studentId, { currentLevel, suggestedLevel, reason })`
- Sets `student_profiles.suggested_level` + `level_review_status = 'pending'`
- Teacher/admin sees it in AI Level Review panel → approve → `student_profiles.level` updates

### TTS for listening

Listening passages are converted to audio by `/api/tts` using ElevenLabs:
- Voice 0 (Rachel, female): first speaker (Agent/professional role)
- Voice 1 (Adam, male): second speaker (Tourist/student role)
- iOS uses Web Audio API with synchronous context unlock to avoid autoplay block

---

## Lesson Analysis Agent (implemented)

**File:** `src/agents/lesson-analysis.js`

### `transcribeAudio(filePath)`

Calls AssemblyAI SDK:
```javascript
await client.transcripts.transcribe({
  audio: filePath,
  speaker_labels: true,
  speech_models: ["universal-2"],
});
```
Returns formatted transcript with `Speaker A: ... \nSpeaker B: ...` when speaker diarization is available.

### `analyzeLessonTranscript({ transcript, studentProfile, teacherProfile })`

Loads correction policy + CEFR guide as cached system prompt.
Sends truncated transcript (max 6000 chars) to Claude Haiku.

Returns:
```json
{
  "summary": "3-4 sentences",
  "mainTopics": ["topic 1"],
  "studentMistakes": [{"type": "grammar", "example": "...", "correction": "..."}],
  "newVocabulary": ["word1"],
  "teacherFocus": ["what teacher emphasized"],
  "practiceRecommendations": ["specific recommendation 1"],
  "progressNote": "fluency observation"
}
```

Result stored in `ai_feedback` with `source_type = 'lesson_recording'` and `source_id = recording.id`.

---

## AI Coach Agent (planned)

**Current state:** Dashboard greeting is static copy personalized from the student profile object.

**Planned inputs:** student profile, placement result, lesson progress, streak, time since last session.
**Planned outputs:** personalized greeting, progress summary, today's focus, encouragement.

---

## AI Teacher Agent (planned)

**Current state:** Not wired. Spec in `agents/ai-teacher.md`.

**Planned inputs:** student profile, current lesson, student answer/transcript, placement level, recurring mistakes, KB chunks.
**Planned outputs:** lesson explanation, corrections, practice prompts, feedback summary, next recommendation.

---

## Pronunciation Agent (planned)

**Current state:** Attempt metadata stored in `pronunciation_attempts`. Scoring not wired.

**Planned inputs:** phrase, audio transcript, student history of mispronounced sounds.
**Planned outputs:** score, specific sound errors, remediation suggestions.

---

## Agent Implementation Pattern

```javascript
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("node:fs");
const path = require("node:path");
const client = new Anthropic();

function loadKb(...filenames) {
  return filenames
    .map((f) => fs.readFileSync(path.join(__dirname, "../../kb/english", f), "utf8"))
    .join("\n\n---\n\n");
}

const systemPrompt = `Role description.\n\n${loadKb("relevant-file.md")}`;

function stripJsonFences(text) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

async function runXxxAgent({ ...inputs }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: buildUserMessage(inputs) }],
  });
  return JSON.parse(stripJsonFences(response.content[0].text));
}
module.exports = { runXxxAgent };
```

**Rules:**
- `cache_control: { type: "ephemeral" }` on system prompts with KB content
- Always return structured JSON — define schema in system prompt
- Strip markdown fences before `JSON.parse` (Haiku sometimes wraps in ` ```json `)
- Keep DB access in `storage/`, not in agents
- For AssemblyAI: use `speech_models: ["universal-2"]` (not deprecated `speech_model`)
- For ElevenLabs: use `model_id: "eleven_turbo_v2_5"` (free tier compatible)
