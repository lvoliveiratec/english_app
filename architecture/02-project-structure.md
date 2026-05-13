# Project Structure

## Current Structure

```text
english_app/
  src/
    agents/
      placement.js           ← Claude API: generates questions + evaluates placement
    server/
      auth.js                ← getSession / getAdminSession / getTeacherSession
      cookies.js             ← session cookie helpers
      http.js                ← readRequestBody / sendJson
      static.js              ← static file serving
      validators.js          ← normalizeXxx input sanitizers
      routes/
        index.js             ← routes dispatcher
        auth.js              ← signup, login, logout, me, invites
        account.js           ← GET/PUT account, PUT password
        placement.js         ← GET placement, GET questions, POST placement
        pronunciation.js     ← POST pronunciation-attempts
        teacher.js           ← GET summary, POST level-suggestion review
        admin.js             ← admin CRUD + POST level-suggestion review
    storage/
      index.js               ← createStorage() factory
      postgres.js            ← PostgresStorage (all DB queries)
      memory.js              ← MemoryStorage (in-memory dev fallback)
    security.js              ← scrypt hashing, timing-safe verify, createToken

  db/
    schema.sql               ← full PostgreSQL schema (idempotent)

  kb/
    english/
      README.md
      cefr-level-guide.md             ← A1–C2 level expectations
      assessment-grammar.md           ← gap-fill questions by CEFR level
      assessment-vocabulary.md        ← vocabulary ranges and question formats
      assessment-reading.md           ← text samples and comprehension questions
      assessment-listening.md         ← transcript cloze and dialogue methods
      correction-policy.md            ← how AI Teacher corrects students
      grammar-syllabus.md             ← grammar topics by level
      lesson-patterns.md              ← reusable lesson formats
      pronunciation-guide.md          ← sounds, stress, rhythm
      speaking-assessment-rubric.md   ← speaking evaluation criteria
      vocabulary-themes.md            ← vocabulary domains and targets
      writing-spelling-guide.md       ← spelling, punctuation, writing

  agents/                    ← product AI agent specs (contracts)
    ai-coach.md
    ai-teacher.md
    placement-agent.md       ← implemented in src/agents/placement.js
    pronunciation-agent.md
    teacher-summary-agent.md

  architecture/              ← system docs (this folder)
  docs/                      ← product decisions and historical planning notes

  scripts/
    migrate.js               ← runs db/schema.sql against DATABASE_URL
    seed.js                  ← inserts demo users and demo data

  tests/
    smoke.spec.js            ← Playwright E2E (7 tests)

  app.js                     ← all frontend JavaScript (SPA)
  index.html                 ← single HTML file, hash-routed pages
  styles.css                 ← all styles
  server.js                  ← HTTP server entry point
  AGENTS.md                  ← instructions for AI coding agents
  .env.example               ← environment variable template
  Dockerfile
  docker-compose.yml         ← local PostgreSQL service
  package.json
  playwright.config.js
```

## Module Responsibilities

| Path | Responsibility |
|---|---|
| `server.js` | Creates HTTP server, calls `createStorage()`, delegates to routes |
| `app.js` | All frontend logic — routing, API calls, DOM rendering |
| `src/agents/placement.js` | Claude API calls — question generation and evaluation |
| `src/server/routes/` | One file per domain. Each exports `handleXxxRoutes({request, response, parsedUrl, storage})` returning `true` if handled |
| `src/storage/` | `PostgresStorage` and `MemoryStorage` implement the same interface |
| `src/security.js` | All crypto — never use raw crypto elsewhere |
| `db/schema.sql` | Single source of truth for DB shape (idempotent) |
| `kb/english/` | Source knowledge for Claude system prompts |
| `agents/` | Product-level AI agent specs and contracts |

## Future Structure

When this grows into a real multi-tenant product:

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
    english/
    curriculum/
    policies/
```
