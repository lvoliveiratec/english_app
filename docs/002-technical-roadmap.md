# Technical Roadmap

## Phase 1: Navigable Prototype

- Plain HTML, CSS, and JavaScript.
- No backend.
- No database.
- Local browser recordings.
- Simple data in `localStorage`.
- Demonstration login, logout, and local student account creation.
- Local student profile shape for future backend storage.
- Playwright smoke tests for core navigation and account flows.
- Initial Node backend routes.
- PostgreSQL schema and migration script.
- In-memory fallback storage for local development without PostgreSQL.
- Initial admin dashboard prototype.

## Phase 2: Real App Foundation

- Expand the backend API.
- Harden authentication and session management.
- Expand role-based profiles for students, teachers, and administrators.
- Store lesson progress and placement data in the database.
- Move remaining `localStorage` state into server-side storage.
- Add update endpoints for student profiles and progress.
- Add teacher-facing APIs.
- Add real admin management actions.
- Create secure upload records for authorized audio/video.

Suggested first backend milestone:

- Add a database connection and migrations. Done.
- Add `users`, `student_profiles`, `teacher_profiles`, `admin_profiles`, and `sessions` tables. Done.
- Add endpoints for student signup, login, logout, and current user. Started.
- Add admin summary endpoint. Started.
- Add profile retrieval/update endpoints. Next.
- Keep audio/video upload out of scope until authentication, consent, and ownership are working.

## Phase 3: Applied AI

- Transcribe class audio.
- Analyze pronunciation.
- Identify recurring errors.
- Generate daily recommendations for each student.
- Create summaries for teachers.
- Use student profile, placement, lesson history, corrections, and transcripts as AI context.

## Phase 4: Privacy And Operations

- Explicit consent for recordings.
- Role-based access control.
- Media retention.
- Data deletion when requested.
- Audit logging for recording and analysis access.
- Clear policy for which data is stored, why it is stored, who can access it, and when it is deleted.

## Phase 5: Agentic Product Architecture

- Define frontend, backend, database, and AI Coach agent responsibilities.
- Define the AI Teacher Agent as the instructional agent for teaching, correction, speech feedback, and writing feedback.
- Build knowledge bases for curriculum, platform help, correction style, and privacy policies.
- Build and expand the English KB in `kb/english/`.
- Add RAG retrieval for curriculum, teacher materials, student memory, and session summaries.
- Keep student-specific memory isolated per student and permissioned server-side.
