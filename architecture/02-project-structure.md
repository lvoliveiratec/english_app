# Project Structure

## Current Prototype Structure

```text
english_app/
  agents/
    ai-coach.md
    ai-teacher.md
    placement-agent.md
    pronunciation-agent.md
    teacher-summary-agent.md
  architecture/
    README.md
    01-system-overview.md
    02-project-structure.md
    03-agent-architecture.md
    04-data-and-rag-architecture.md
    05-student-flow.md
    06-diagrams.md
    07-implementation-roadmap.md
  docs/
    000-process-log.md
    001-product-vision.md
    002-technical-roadmap.md
    003-agent-roles.md
    004-mcp-kb-research.md
    005-rag-and-data-architecture.md
    006-ai-teacher-agent.md
    007-page-and-student-flow.md
    008-backend-foundation-plan.md
  db/
    schema.sql
  kb/
    english/
      README.md
      cefr-level-guide.md
      correction-policy.md
      grammar-syllabus.md
      lesson-patterns.md
      pronunciation-guide.md
      speaking-assessment-rubric.md
      vocabulary-themes.md
      writing-spelling-guide.md
  tests/
    smoke.spec.js
  scripts/
    migrate.js
    seed.js
  src/
    security.js
    server/
      auth.js
      cookies.js
      http.js
      static.js
      validators.js
      routes/
        account.js
        admin.js
        auth.js
        index.js
    storage/
      index.js
      memory.js
      postgres.js
  AGENTS.md
  .dockerignore
  .env.example
  Dockerfile
  app.js
  docker-compose.yml
  index.html
  package.json
  package-lock.json
  playwright.config.js
  server.js
  styles.css
```

## Future Application Structure

When the prototype becomes a real app, a likely structure is:

```text
english_app/
  apps/
    web/
      src/
        app/
        components/
        features/
        routes/
        styles/
        tests/
    api/
      src/
        auth/
        courses/
        lessons/
        students/
        teachers/
        media/
        ai/
        rag/
        billing/
        audit/
    workers/
      src/
        transcription/
        pronunciation/
        media-processing/
        embedding/
  packages/
    shared/
    database/
    ai-contracts/
  architecture/
  docs/
  kb/
    english/
    curriculum/
    policies/
```

## Ownership Boundaries

- `architecture/`: system shape and diagrams.
- `agents/`: product AI agent specifications and contracts.
- `docs/`: project decisions, product notes, roadmap, and process log.
- `db/`: PostgreSQL schema and migration SQL.
- `kb/`: source knowledge for AI retrieval.
- `src/server`: backend HTTP helpers, auth helpers, static serving, validators, and API routes.
- `src/storage`: backend storage adapters for PostgreSQL and in-memory development data.
- `src/security.js`: password hashing, token, and ID helpers.
- `scripts/`: local backend/database utility scripts.
- `tests/`: Playwright smoke tests for the current prototype.
- `playwright.config.js`: end-to-end test configuration.
- `AGENTS.md`: instructions for AI coding agents working in this repository.
- `Dockerfile`: container runtime for local deployment experiments and Cloud Run style hosting.
- `docker-compose.yml`: local PostgreSQL service for development.
- `.env.example`: local environment variable template.
- `apps/web`: future frontend application.
- `apps/api`: future backend API.
- `apps/workers`: future async processing jobs.
- `packages/database`: future schema and migrations.
- `packages/ai-contracts`: future AI input/output contracts.
