# AGENTS.md

This file guides AI coding agents working in this repository.

## Project Shape

FluentPath English is an English learning platform with real AI-powered placement, running in production.

Current stack:

- Plain HTML/CSS/JavaScript frontend (SPA via hash routing).
- Node.js HTTP server (no framework), modular routes under `src/server/routes/`.
- PostgreSQL via `DATABASE_URL`. In-memory fallback for local dev and tests.
- Anthropic Claude API (`claude-haiku-4-5-20251001`) for placement test generation and evaluation.
- ElevenLabs API for natural placement listening audio.
- AssemblyAI for class recording transcription before Claude lesson analysis.
- Playwright end-to-end smoke tests.

## Important Commands

```bash
npm install
npm test                                    # syntax check + E2E
npm run check                               # syntax check only
npm run test:e2e                            # Playwright only
npm run test:e2e:ui                         # Playwright with UI
node --env-file=.env scripts/migrate.js     # run DB migrations
node --env-file=.env scripts/seed.js        # seed demo data
```

Run the app:

```bash
npm start     # reads .env automatically via --env-file
```

## Environment

Copy `.env.example` to `.env` and fill in:

```
ANTHROPIC_API_KEY=sk-ant-...        # required for placement AI features
ASSEMBLYAI_API_KEY=...              # required for class recording transcription
ELEVENLABS_API_KEY=sk_...           # required for natural listening audio
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_VOICE_AGENT_ID=...
ELEVENLABS_VOICE_STUDENT_ID=...
ELEVENLABS_VOICE_NARRATOR_ID=...
DATABASE_URL=postgres://...         # optional — in-memory fallback if not set
HOST=0.0.0.0                        # use 0.0.0.0 for Cloudflare Tunnel / Cloud Run
PORT=5173
```

## Development Rules

- Keep product copy in English.
- Keep student media, transcripts, and profile data treated as sensitive.
- Do not store plaintext passwords (scrypt via `src/security.js`).
- Do not process real audio/video until consent, retention, and deletion workflows exist.
- Keep tests updated when changing login, signup, dashboard, admin, storage, or routing.
- Prefer small modules over growing `server.js`, `app.js`, or `index.html`.
- Backend routes live under `src/server/routes/`.
- AI agent logic lives under `src/agents/`.
- Storage implementations live under `src/storage/`.
- Database schema lives in `db/schema.sql` (idempotent — uses `create if not exists` and `alter ... add column if not exists`).
- Both `PostgresStorage` and `MemoryStorage` must implement the same interface. Add every new storage method to both.
- Use prompt caching (`cache_control: { type: "ephemeral" }`) on large static system prompts in Claude API calls.
- Strip markdown code fences from Claude responses before JSON.parse (`response.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()`).

## Current Architecture

```
server.js               entry point — HTTP server + storage factory
app.js                  frontend SPA (all client-side JS)
index.html              single HTML file, hash-routed pages
styles.css              all styles

src/agents/
  placement.js          generatePlacementQuestions() + runPlacementAgent()
                        — loads CEFR guide + 4 assessment KB files as cached system prompt
                        — returns structured JSON: { feedback, level, score, metrics, priorities }
  lesson-analysis.js    transcribeAudio() + analyzeLessonTranscript()
                        — AssemblyAI transcription + Claude transcript analysis

src/server/routes/
  index.js              routes dispatcher
  auth.js               signup, login, logout, me, invites
  account.js            GET/PUT account, PUT password
  placement.js          GET /api/placement, GET /api/placement/questions, POST /api/placement
  pronunciation.js      POST /api/pronunciation-attempts
  recordings.js         POST /api/recordings, GET /api/recordings/:id
  tts.js                GET/POST /api/tts
  teacher.js            GET /api/teacher/summary, POST level-suggestion approve/dismiss
  admin.js              admin CRUD + POST level-suggestion approve/dismiss

src/storage/
  index.js              createStorage() — postgres if DATABASE_URL, else memory
  postgres.js           PostgresStorage class
  memory.js             MemoryStorage class (in-memory demo data)

src/server/
  auth.js               getSession / getAdminSession / getTeacherSession
  cookies.js            parse / create / clear session cookie
  http.js               readRequestBody / sendJson
  static.js             static file serving
  validators.js         normalizeXxx input sanitizers

src/security.js         scrypt hashing, timing-safe verify, createToken

db/schema.sql           PostgreSQL schema (all tables, idempotent)
scripts/migrate.js      runs schema.sql against DATABASE_URL
scripts/seed.js         inserts demo users + demo data

kb/english/             knowledge base loaded into Claude API system prompts
  cefr-level-guide.md
  assessment-grammar.md
  assessment-vocabulary.md
  assessment-reading.md
  assessment-listening.md
  correction-policy.md
  grammar-syllabus.md
  lesson-patterns.md
  pronunciation-guide.md
  speaking-assessment-rubric.md
  vocabulary-themes.md
  writing-spelling-guide.md

agents/                 product AI agent specs (contracts, not yet all wired)
  ai-coach.md
  ai-teacher.md
  placement-agent.md    ← implemented in src/agents/placement.js
  pronunciation-agent.md
  teacher-summary-agent.md

tests/smoke.spec.js     Playwright E2E (7 tests, runs against live server)
```

## Key Data Flow — Placement Test

```
Student clicks "Take placement test"
  → GET /api/placement/questions
    → generatePlacementQuestions({ profile, selfReportedLevel })
    → Claude generates 15 questions (grammar ×4, vocabulary ×3, reading ×3, listening ×3, speaking ×2)
    → listening questions use hidden dialogue scripts and ElevenLabs audio
    → returns { questions: [...] }

Student fills form and submits
  → POST /api/placement { questions, answers }
    → runPlacementAgent({ profile, level, goal, questions, answers })
    → Claude evaluates → { feedback, level, score, metrics, priorities }
    → storage.savePlacement(studentId, result)
    → if result.level !== profile.level → storage.createLevelSuggestion(...)
    → returns result to frontend

Teacher / Admin sees pending suggestion in dashboard
  → POST /api/teacher/level-suggestions/:studentId/approve
    → storage.reviewLevelSuggestion(studentId, "approve")
    → student_profiles.level = suggested_level
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
| `ai_feedback` | Placement results and level suggestions (source_type: 'placement', 'level_suggestion') |
| `lesson_progress` | Per-skill completion, difficulty, recommendation |
| `pronunciation_attempts` | Phrase, duration, processing_status |
| `lesson_recordings` | Uploaded class audio/video, transcript, processing_status, analysis_json |
| `consent_records` / `media_records` | Future audio/video pipeline |
| `courses` / `lessons` | Curriculum (data exists, player not built yet) |
| `plans` / `payments` | Billing (schema only) |

## Product Agents

Agent specs in `agents/` define behavior and contracts.

- `placement-agent.md` → **implemented** in `src/agents/placement.js`
- `ai-coach.md` → UI placeholder only
- `ai-teacher.md` → not yet wired to Claude API
- `pronunciation-agent.md` → not yet wired
- `teacher-summary-agent.md` → not yet wired

When implementing new agents: follow the existing pattern in `src/agents/placement.js`, use `cache_control: { type: "ephemeral" }` on the system prompt, load relevant KB files, strip markdown fences from JSON responses.
