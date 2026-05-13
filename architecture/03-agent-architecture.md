# Agent Architecture

FluentPath English uses agent roles as architectural boundaries.

These agents are not necessarily separate deployed services at the beginning. They describe ownership, responsibilities, and future automation boundaries.

The product agent contracts now live in `agents/`:

- `agents/ai-coach.md`
- `agents/ai-teacher.md`
- `agents/placement-agent.md`
- `agents/pronunciation-agent.md`
- `agents/teacher-summary-agent.md`

Repository-level instructions for coding agents live in `AGENTS.md`.

## Frontend Agent

Owns the learner-facing UI.

Responsibilities:

- Public pages.
- Student dashboard.
- Teacher dashboard.
- Admin assignment management.
- Lesson player.
- Forms and validation.
- Responsive layouts.
- Accessibility and interaction states.
- Integration with backend contracts.

## Backend Agent

Owns the API and business logic.

Responsibilities:

- Authentication.
- Student, teacher, and admin profiles.
- Courses, lessons, assignments, and progress.
- Teacher invite validation.
- Assignment-scoped teacher access.
- Media upload authorization.
- AI request orchestration.
- Privacy, consent, audit, export, and deletion flows.

## Database Agent

Owns structured data and persistence.

Responsibilities:

- Postgres schema.
- Migrations.
- Data integrity.
- Student progress records.
- Teacher invite and teacher/student assignment records.
- Media metadata.
- Payment and subscription records.
- Audit events.

## AI Coach Agent

Owns planning, motivation, and student direction.

Responsibilities:

- Greet the student.
- Summarize recent progress.
- Recommend the daily focus.
- Encourage consistency.
- Decide which practice area should come next.

## AI Teacher Agent

Owns instruction and correction.

Responsibilities:

- Teach English directly.
- Check pronunciation.
- Check spelling and writing.
- Correct grammar and word choice.
- Run conversation and roleplay practice.
- Generate lesson-aligned drills.
- Save compact learning signals.

## RAG Agent Or Retrieval Layer

Owns safe context assembly for AI.

Responsibilities:

- Retrieve authorized English KB chunks.
- Retrieve curriculum chunks.
- Retrieve student-specific memory only for the current student.
- Retrieve teacher notes when permission allows it.
- Avoid exposing raw media directly to the AI Teacher.
- Return compact context packets.

## Human Teacher Surface

Current and future teacher dashboard responsibilities:

- See student progress.
- Review summaries and recurring mistakes.
- Share invite links for automatic student assignment.
- Assign lessons.
- Add notes.
- Review authorized class recordings or transcripts.
