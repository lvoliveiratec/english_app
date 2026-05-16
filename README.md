# FluentPath English

AI-powered English learning platform with a personalized AI Teacher for every student.

## What is working today

**Student experience:**
- Signup with full learning profile (level, goal, interests, address, motivation)
- AI placement test — 8 questions (grammar ×2, vocabulary ×2, reading ×2, listening ×1, speaking ×1), generated per student profile by Claude Haiku, scored 0-100%
- Listening questions use ElevenLabs TTS — two natural voices (Rachel + Adam) for dialogue, played via Web Audio API (iOS-compatible)
- Placement baseline auto-runs after signup; students retake at any time from dashboard
- AI level suggestions — when Claude's assessed level differs from self-reported, queued for teacher/admin review
- My Tests page — compact list with date, level, score; tap to view detail with questions, answers, AI feedback and priorities
- Student notification panel — admin can send AI recommendations directly to the student's dashboard
- In-person class recording — record or upload audio/video (iOS .m4a supported), AssemblyAI transcribes, Claude analyzes lesson
- Account management (profile, address, password)
- Pronunciation attempt recording (metadata stored; full scoring pipeline pending)

**Teacher experience:**
- Assigned student list with progress, difficulty, and next actions
- AI Level Review panel — approve or dismiss level suggestions (updates student's level in DB)
- Test history per student — teacher sees all placement tests with scores, questions and answers
- Invite links — shareable URL that auto-assigns new signups to this teacher

**Admin experience:**
- Overview with clickable metric cards → dedicated sub-pages
- Sub-pages: Students, Teachers, Assignments, Plans, Courses — each with search/filter bar and pagination (10/page + Load more)
- Student filters: name/email, level, goal, teacher (including "Unassigned")
- Teacher filters: name/email, specialty, status
- Assignment filters: student/teacher name, source (invite/manual)
- Plans/Courses filters: name, status
- AI Level Review panel for all students (including unassigned)
- "Send to student" button in Progress table — sends AI recommendation as a notification to the student's dashboard

## Stack

| Layer | Technology |
|---|---|
| Frontend | Plain HTML + CSS + JavaScript, hash-based SPA |
| Backend | Node.js `http` (no framework), modular routes under `src/server/routes/` |
| Database | PostgreSQL via `pg`, in-memory fallback for local dev |
| AI / Placement | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`), prompt caching |
| Transcription | AssemblyAI — speaker diarization, `speech_models: ["universal-2"]` |
| TTS | ElevenLabs — two natural voices for listening dialogues |
| Tests | Playwright E2E (7 smoke tests) |
| Node | >= 24 |

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
# Fill in .env with your API keys
npm start
```

The site runs at `http://127.0.0.1:5173`. For Cloudflare Tunnel or Cloud Run, set `HOST=0.0.0.0`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Key from console.anthropic.com |
| `ASSEMBLYAI_API_KEY` | Yes (for class recording) | Key from assemblyai.com |
| `ELEVENLABS_API_KEY` | Yes (for listening audio) | Key from elevenlabs.io |
| `DATABASE_URL` | No | PostgreSQL connection string; in-memory fallback if not set |
| `HOST` | No | Bind address — use `0.0.0.0` for Cloudflare Tunnel / Cloud Run |
| `PORT` | No | Port (default `5173`) |

## PostgreSQL setup

```bash
docker compose up -d postgres
node --env-file=.env scripts/migrate.js
node --env-file=.env scripts/seed.js
npm start
```

## Demo accounts

```text
lucas@example.com   / english123   (student)
teacher@example.com / teacher123  (teacher)
admin@example.com   / admin123    (admin)
```

Teacher invite link: `/?invite=ANA-TEACHER#signup`

## API endpoints

```text
GET  /api/health

POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/invites/:code

GET  /api/placement                           ← latest placement from DB
GET  /api/placement/questions                 ← generate 8-question test
POST /api/placement                           ← evaluate answers or writing sample
GET  /api/my-tests                            ← student's placement history
GET  /api/my-tests/:testId                    ← single test detail

GET  /api/notifications                       ← student's unread notifications
POST /api/notifications/:id/read

GET  /api/account
PUT  /api/account
PUT  /api/account/password

POST /api/pronunciation-attempts
POST /api/tts                                 ← ElevenLabs audio (voiceIndex 0 or 1)
POST /api/recordings                          ← upload class audio for transcription
GET  /api/recordings/:recordingId

GET  /api/teacher/summary
GET  /api/teacher/students/:studentId/tests
GET  /api/teacher/students/:studentId/tests/:testId
POST /api/teacher/level-suggestions/:studentId/approve
POST /api/teacher/level-suggestions/:studentId/dismiss

GET  /api/admin/summary
GET  /api/admin/resources
POST /api/admin/assignments
POST /api/admin/students
PUT  /api/admin/students/:id
POST /api/admin/teachers
PUT  /api/admin/teachers/:id
POST /api/admin/plans
PUT  /api/admin/plans/:id
POST /api/admin/courses
PUT  /api/admin/courses/:id
POST /api/admin/students/:id/notify           ← send recommendation to student
POST /api/admin/level-suggestions/:id/approve
POST /api/admin/level-suggestions/:id/dismiss
GET  /api/admin/students/:studentId/tests
GET  /api/admin/students/:studentId/tests/:testId
```

## Tests

```bash
npm test          # syntax check + E2E
npm run check     # syntax only
npm run test:e2e  # Playwright only
```

## Project layout

```text
src/
  agents/
    placement.js         ← Claude: generate 8-question test + evaluate answers
    lesson-analysis.js   ← AssemblyAI transcription + Claude lesson analysis
  server/
    routes/
      auth.js / account.js / placement.js / pronunciation.js
      recordings.js / tts.js / teacher.js / admin.js / index.js
    auth.js / cookies.js / http.js / static.js / validators.js
  storage/
    index.js             ← createStorage() factory
    postgres.js          ← PostgresStorage (~43 methods)
    memory.js            ← MemoryStorage (dev fallback)
  security.js

db/schema.sql            ← full schema (idempotent, 15+ tables)
kb/english/              ← CEFR guides + assessment KB (4 files)
agents/                  ← product AI agent specs
scripts/migrate.js / seed.js
tests/smoke.spec.js      ← 7 Playwright tests
```

## What is not yet implemented

- Lesson content and in-app lesson player (tables exist, content empty)
- AI Coach wired to Claude API (static copy only)
- AI Teacher wired to Claude API (spec defined)
- Pronunciation scoring pipeline (metadata stored, audio upload pending)
- Payment gateway (table exists)
- RAG / vector search for KB (loaded into prompt context currently)
- React / TypeScript migration

## Documentation

- `architecture/` — system shape, data flows, agent roles, roadmap
- `docs/` — product decisions and historical planning notes
- `kb/english/` — CEFR knowledge base and assessment guides
- `agents/` — product AI agent specifications
- `AGENTS.md` — instructions for AI coding agents
