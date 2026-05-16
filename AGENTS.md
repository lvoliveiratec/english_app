# AGENTS.md

This file guides AI coding agents working in this repository.

## Project Shape

FluentPath English is an English learning platform with real AI-powered placement, lesson analysis, and student notifications.

Current stack:
- **Frontend:** Plain HTML/CSS/JS, SPA via hash routing
- **Backend:** Node.js `http` (no framework), modular routes under `src/server/routes/`
- **Database:** PostgreSQL (`pg`), in-memory fallback for local dev and tests
- **Claude API:** Haiku (`claude-haiku-4-5-20251001`) for placement + lesson analysis
- **AssemblyAI:** `speech_models: ["universal-2"]`, speaker_labels for class recording transcription
- **ElevenLabs:** Two voices (Rachel + Adam) for listening dialogue TTS via `/api/tts`
- **Tests:** Playwright E2E (7 smoke tests)
- **Node:** >= 24

## Important Commands

```bash
npm start                                   # reads .env via --env-file
npm test                                    # syntax check + E2E
npm run check                               # syntax check only
npm run test:e2e                            # Playwright only
node --env-file=.env scripts/migrate.js     # run DB migrations
node --env-file=.env scripts/seed.js        # seed demo data
```

## Environment (.env)

```
ANTHROPIC_API_KEY=sk-ant-...
ASSEMBLYAI_API_KEY=...
ELEVENLABS_API_KEY=sk_...
DATABASE_URL=postgres://...        # optional — in-memory if not set
HOST=0.0.0.0                       # use 0.0.0.0 for Cloudflare Tunnel
PORT=5173
```

## Development Rules

- Keep product copy in English.
- Keep student media, transcripts, and profile data treated as sensitive.
- Do not store plaintext passwords (scrypt via `src/security.js`).
- Do not process real audio/video until consent workflows are hardened.
- Keep tests updated when changing login, signup, dashboard, admin, storage, or routing.
- Prefer small modules. Backend routes live under `src/server/routes/`. AI agent logic lives under `src/agents/`.
- Both `PostgresStorage` and `MemoryStorage` must implement the same interface. Add every new method to both.
- Use prompt caching (`cache_control: { type: "ephemeral" }`) on large static system prompts in Claude API calls.
- Strip markdown code fences before `JSON.parse`: `text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()`
- Admin sub-pages use hash routes: `#admin`, `#admin-students`, `#admin-teachers`, `#admin-assignments`, `#admin-plans`, `#admin-courses`. All are in `adminOnlyRoutes`.

## Current Architecture

```
server.js               — HTTP server entry point
app.js                  — all frontend JS (~3000 lines, SPA)
index.html              — single HTML file, hash-routed pages
styles.css              — all styles

src/agents/
  placement.js          — generatePlacementQuestions() + runPlacementAgent()
                          loads 4 assessment KB files as cached system prompt
                          8 questions: grammar×2, vocab×2, reading×2, listening×1, speaking×1
                          score: 0-100% computed by Claude from correct/incorrect answers
  lesson-analysis.js    — transcribeAudio() via AssemblyAI + analyzeLessonTranscript() via Claude

src/server/routes/
  index.js              — dispatcher (health + features flag)
  auth.js               — signup, login, logout, me, invites
  account.js            — GET/PUT account, PUT password, GET/POST notifications
  placement.js          — GET/GET questions/POST placement, GET/GET my-tests/:id
  pronunciation.js      — POST pronunciation-attempts
  recordings.js         — POST upload, GET status (async: AssemblyAI → Claude)
  tts.js                — POST /api/tts → ElevenLabs MP3 audio (voiceIndex 0 or 1)
  teacher.js            — GET summary, GET/GET student tests, POST level-suggestion review
  admin.js              — CRUD + POST notify + GET student tests + POST level-suggestion review

src/storage/
  index.js              — createStorage() factory
  postgres.js           — PostgresStorage (~43 async methods)
  memory.js             — MemoryStorage (in-memory dev fallback)

src/security.js         — scrypt hashing, timing-safe verify, createToken

db/schema.sql           — full PostgreSQL schema (idempotent, CREATE IF NOT EXISTS + ALTER ADD COLUMN IF NOT EXISTS)
scripts/migrate.js      — runs schema.sql against DATABASE_URL
scripts/seed.js         — inserts demo users + data

kb/english/             — knowledge base loaded into Claude system prompts
  cefr-level-guide.md
  assessment-grammar.md        ← A1–C1 grammar structures and gap-fill items
  assessment-vocabulary.md
  assessment-reading.md
  assessment-listening.md
  correction-policy.md / grammar-syllabus.md / lesson-patterns.md
  pronunciation-guide.md / speaking-assessment-rubric.md
  vocabulary-themes.md / writing-spelling-guide.md

agents/                 — product AI agent specs (contracts)
  placement-agent.md   ← implemented
  lesson-analysis.js   ← partially implemented
  ai-coach.md / ai-teacher.md / pronunciation-agent.md / teacher-summary-agent.md ← pending
```

## Key Data Flow — Placement Test

```
Student clicks "Take placement test"
  → GET /api/placement/questions
    → Claude generates 8 questions (grammar×2, vocab×2, reading×2, listening×1, speaking×1)
    → ElevenLabs generates audio for listening dialogue passages

Student fills form and submits
  → POST /api/placement { questions, answers }
    → Claude evaluates → { feedback, level, score (0-100%), metrics, priorities }
    → storage.savePlacement(studentId, { ...result, questions, answers })  ← saves source_data JSON
    → if result.level ≠ profile.level → storage.createLevelSuggestion(...)
    → returns result to frontend

Teacher / Admin reviews suggestion
  → POST /api/teacher/level-suggestions/:studentId/approve
    → student_profiles.level = suggested_level

Admin sends recommendation to student
  → POST /api/admin/students/:id/notify { message }
    → student_notifications table insert
  → Student logs in → GET /api/notifications
    → yellow panel on dashboard → "Got it ✓" → POST /api/notifications/:id/read
```

## Key Data Flow — Class Recording

```
Student records or uploads audio (consent gated)
  → POST /api/recordings (raw binary body)
    → saved to uploads/ directory
    → responds 202 immediately with recordingId
    → background: AssemblyAI transcribes (speaker_labels: true)
                  Claude analyzes transcript → mistakes, vocabulary, recommendations
                  stored in ai_feedback (source_type: 'lesson_recording')
```

## Key DB Tables

| Table | Purpose |
|---|---|
| `users` | Auth — email, password_hash, role |
| `sessions` | Token-based sessions |
| `student_profiles` | Level, goal, interests, assignment_status, suggested_level, level_review_status |
| `teacher_profiles` | Specialty, status |
| `teacher_student_assignments` | Many-to-many, source, notes |
| `teacher_invites` | Invite codes for auto-assignment |
| `ai_feedback` | Placement results, level suggestions, lesson recording analyses (source_type) |
| `lesson_recordings` | Audio uploads — path, mime, processing_status, transcript |
| `student_notifications` | Admin-to-student messages, read_at |
| `lesson_progress` | Per-skill completion, difficulty, recommendation |
| `pronunciation_attempts` | Phrase, duration, processing_status |
| `courses` / `lessons` / `lesson_progress` | Curriculum (data exists, player not built) |
| `plans` / `payments` | Billing (schema only) |
| `consent_records` / `media_records` | Future audio/video pipeline (not enforced) |

## Admin Sub-pages

All listed in `adminOnlyRoutes` array. Each has search/filter + pagination (10/page + Load more):

| Route | Content |
|---|---|
| `#admin` | Overview — clickable metric cards, quick links, level suggestions, activity |
| `#admin-students` | Student CRUD + progress table + filters (name/email, level, goal, teacher) |
| `#admin-teachers` | Teacher CRUD + filters (name/email, specialty, status) |
| `#admin-assignments` | Assignment form + paginated list + filters (student/teacher name, source) |
| `#admin-plans` | Plan CRUD + filters (name, status) |
| `#admin-courses` | Course CRUD + filters (title, status) |

## Agent Implementation Pattern

```javascript
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("node:fs");
const path = require("node:path");
const client = new Anthropic();

const systemPrompt = `...` + loadKb("relevant-file.md");

async function runXxxAgent({ ...inputs }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: buildUserMessage(inputs) }],
  });
  const raw = response.content[0].text
    .replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(raw);
}
module.exports = { runXxxAgent };
```

Rules:
- Use `cache_control: { type: "ephemeral" }` when system prompt contains KB content
- Always return structured JSON — define schema in system prompt
- Strip markdown fences before parsing
- Keep DB access in `storage/`, not in agents
- For AssemblyAI: use `speech_models: ["universal-2"]` (not deprecated `speech_model`)
- For ElevenLabs: use `model_id: "eleven_turbo_v2_5"` (free tier compatible)
