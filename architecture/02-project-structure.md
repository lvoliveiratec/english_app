# Project Structure

## Current Structure

```text
english_app/
  src/
    agents/
      placement.js          ← Claude API: generates 8-question test + evaluates
      lesson-analysis.js    ← AssemblyAI transcription + Claude lesson analysis

    server/
      auth.js               ← getSession / getAdminSession / getTeacherSession
      cookies.js            ← session cookie helpers
      http.js               ← readRequestBody / readRequestBodyBuffer / sendJson
      static.js             ← static file serving
      validators.js         ← normalizeXxx input sanitizers
      routes/
        index.js            ← dispatcher (health endpoint + feature flags)
        auth.js             ← signup, login, logout, me, invites
        account.js          ← GET/PUT account, PUT password, GET/POST notifications
        placement.js        ← GET placement, GET questions, POST placement, GET my-tests
        pronunciation.js    ← POST pronunciation-attempts
        recordings.js       ← POST audio upload → AssemblyAI → Claude (async)
        tts.js              ← POST /api/tts → ElevenLabs MP3 audio
        teacher.js          ← GET summary, GET student tests, POST level-suggestion review
        admin.js            ← CRUD, POST notify, GET student tests, POST level-suggestion

    storage/
      index.js              ← createStorage() factory (postgres if DATABASE_URL, else memory)
      postgres.js           ← PostgresStorage (~43 methods)
      memory.js             ← MemoryStorage (in-memory dev fallback)

    security.js             ← scrypt hashing, timing-safe verify, createToken

  db/
    schema.sql              ← full PostgreSQL schema (idempotent)

  kb/
    english/
      README.md
      cefr-level-guide.md             ← A1–C2 level expectations
      assessment-grammar.md           ← A1–C1 grammar structures and gap-fill items
      assessment-vocabulary.md        ← vocabulary ranges, question formats, word lists
      assessment-reading.md           ← sample texts and comprehension questions
      assessment-listening.md         ← transcript cloze and dialogue methods
      correction-policy.md
      grammar-syllabus.md
      lesson-patterns.md
      pronunciation-guide.md
      speaking-assessment-rubric.md
      vocabulary-themes.md
      writing-spelling-guide.md

  agents/                   ← product AI agent specs (contracts)
    ai-coach.md
    ai-teacher.md
    placement-agent.md      ← implemented in src/agents/placement.js
    pronunciation-agent.md
    teacher-summary-agent.md

  architecture/             ← system docs
  docs/                     ← product decisions and historical planning

  scripts/
    migrate.js              ← runs db/schema.sql against DATABASE_URL
    seed.js                 ← inserts demo users and demo data

  uploads/                  ← class recording audio files (gitignored)

  tests/
    smoke.spec.js           ← 7 Playwright E2E tests

  app.js                    ← all frontend JS (~3200 lines, SPA)
  index.html                ← single HTML file, hash-routed pages
  styles.css                ← all styles
  server.js                 ← HTTP server entry point
  AGENTS.md                 ← instructions for AI coding agents
  .env.example              ← environment variable template
  Dockerfile
  docker-compose.yml        ← local PostgreSQL service
  package.json
  playwright.config.js
```

## Hash Routes (SPA Pages)

| Route | Access | Description |
|---|---|---|
| `#home` | Public | Landing page |
| `#login` | Public | Login form |
| `#signup` | Public | Signup with full profile |
| `#courses` | Public | Course catalog |
| `#coach` | Public | AI Coach explanation |
| `#course` | Public | Course detail |
| `#dashboard` | Student | Main student workspace |
| `#lessons` | Student | Lessons placeholder |
| `#my-tests` | Student | Placement test history (compact list) |
| `#test-detail` | Student/Teacher | Single test with questions, answers, AI feedback |
| `#account` | Student | Profile, address, password |
| `#teacher` | Teacher | Assigned students, level suggestions, invite |
| `#admin` | Admin | Overview with metric nav cards |
| `#admin-students` | Admin | Student management + progress + filters |
| `#admin-teachers` | Admin | Teacher management + filters |
| `#admin-assignments` | Admin | Assignment form + paginated list + filters |
| `#admin-plans` | Admin | Plans management |
| `#admin-courses` | Admin | Course management |

## Module Responsibilities

| Path | Responsibility |
|---|---|
| `server.js` | Creates HTTP server, calls `createStorage()`, delegates to routes |
| `app.js` | All frontend logic — routing, API calls, DOM rendering, TTS, speech recognition |
| `src/agents/placement.js` | Claude API — question generation and evaluation |
| `src/agents/lesson-analysis.js` | AssemblyAI transcription + Claude lesson analysis |
| `src/server/routes/` | One file per domain. Returns `true` if handled |
| `src/storage/` | Same interface — PostgresStorage and MemoryStorage |
| `src/security.js` | All crypto — never use raw crypto elsewhere |
| `db/schema.sql` | Single source of truth for DB shape (idempotent) |
| `kb/english/` | Source knowledge for Claude system prompts |
| `agents/` | Product-level AI agent specs and contracts |
| `uploads/` | Uploaded audio/video files (local; gitignored) |

## Future Structure

```text
english_app/
  apps/
    web/           ← React + TypeScript frontend
    api/           ← Node.js API (or modular monolith)
    workers/       ← transcription, pronunciation, embedding pipelines
  packages/
    database/      ← schema, migrations
    ai-contracts/  ← Claude input/output type definitions
  kb/
    english/ / curriculum/ / policies/
```
