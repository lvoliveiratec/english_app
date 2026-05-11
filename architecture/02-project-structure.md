# Project Structure

## Current Prototype Structure

```text
english_app/
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
  app.js
  index.html
  package.json
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
- `docs/`: project decisions, product notes, roadmap, and process log.
- `kb/`: source knowledge for AI retrieval.
- `apps/web`: future frontend application.
- `apps/api`: future backend API.
- `apps/workers`: future async processing jobs.
- `packages/database`: future schema and migrations.
- `packages/ai-contracts`: future AI input/output contracts.
