# Agent Roles

This project can use several specialized agents as architectural roles. These are not necessarily separate deployed services on day one; they are ownership boundaries for planning, implementation, and future automation.

## Frontend Agent

Owns the learner-facing FluentPath English interface.

Responsibilities:

- Build the English-only web experience.
- Create reusable UI for lessons, practice flows, progress, onboarding, and account settings.
- Own responsive layout, accessibility, interaction states, loading states, and error states.
- Integrate with API contracts without owning backend business logic.

Near-term stack recommendation:

- React + TypeScript.
- Vite for the standalone frontend.
- Tailwind CSS for styling.
- Radix UI or shadcn/ui for accessible primitives.
- TanStack Query for server state.
- React Hook Form + Zod for forms.
- Playwright for critical learner flow tests.

## Backend Agent

Owns the API, authentication, business rules, and service boundaries.

Responsibilities:

- Student, teacher, and admin authentication.
- Course, lesson, assignment, and progress APIs.
- Teacher invite validation and teacher/student assignment rules.
- Admin assignment and reassignment workflows.
- Media upload authorization and processing job creation.
- AI practice endpoint orchestration.
- Pronunciation attempt metadata and processing status APIs.
- Privacy, audit, export, and deletion workflows.

## Database Agent

Owns structured data, schema, migrations, query patterns, and database integrity.

Responsibilities:

- Postgres schema design.
- Student, teacher, course, lesson, progress, media, payment, and audit entities.
- Address and pronunciation attempt entities.
- Teacher invite and teacher/student assignment entities.
- Data retention fields and deletion workflows.
- Permission boundaries for student-specific records.
- Database migrations and seed data.

## AI Coach Agent

Owns the student-facing AI conversation behavior.

Responsibilities:

- Communicate only in English.
- Adapt to the student's level, goals, current lesson, and recent mistakes.
- Support conversation, roleplay, pronunciation practice, writing feedback, vocabulary review, grammar help, and lesson recap.
- Save compact learning signals after each session.
- Use authorized curriculum and student memory through a server-side retrieval layer.

Safety and privacy:

- Never expose private data from another student.
- Avoid unnecessary sensitive data collection.
- Store summaries and learning signals by default, not full transcripts, unless consent allows it.
- Keep corrections respectful, specific, and useful.

## AI Teacher Agent

Owns the instructional intelligence of the site. This is the teacher-like agent that speaks with students, teaches lessons, checks speech, checks spelling and writing, corrects mistakes, and directs the next practice activity.

Responsibilities:

- Speak only in English inside the product experience.
- Use the English KB in `kb/english/` as its global teaching foundation.
- Adapt teaching to the student's CEFR level, goals, mistakes, and lesson progress.
- Check pronunciation using transcripts, speech timing, pronunciation metrics, and recurring sound errors.
- Use pronunciation attempt metadata as a processing record, not as a measured score until transcript/metrics exist.
- Check spelling, grammar, word choice, sentence structure, and writing clarity.
- Generate drills for pronunciation, vocabulary, grammar, conversation, roleplay, and writing.
- Save compact learning signals for future personalization.
- Create optional handoff notes for human teachers.

Core modes:

- `daily_check_in`
- `guided_lesson`
- `conversation_practice`
- `roleplay`
- `pronunciation_practice`
- `writing_feedback`
- `vocabulary_review`
- `grammar_help`
- `lesson_recap`
- `teacher_handoff`

Boundaries:

- The AI Teacher Agent does not own authentication, billing, database migrations, or raw media storage.
- It should receive only authorized context assembled by the backend/RAG layer.
- It should store summaries and learning signals by default, not raw transcripts, unless consent allows it.

## Implementation Rule

Each agent role should have a written contract before implementation: inputs, outputs, owned files/services, data access, and privacy boundaries.
