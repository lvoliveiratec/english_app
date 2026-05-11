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
- Media upload authorization and processing job creation.
- AI practice endpoint orchestration.
- Privacy, audit, export, and deletion workflows.

## Database Agent

Owns structured data, schema, migrations, query patterns, and database integrity.

Responsibilities:

- Postgres schema design.
- Student, teacher, course, lesson, progress, media, payment, and audit entities.
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

## Implementation Rule

Each agent role should have a written contract before implementation: inputs, outputs, owned files/services, data access, and privacy boundaries.
