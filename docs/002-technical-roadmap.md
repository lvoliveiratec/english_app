# Technical Roadmap

## Phase 1: Navigable Prototype

- Plain HTML, CSS, and JavaScript.
- No backend.
- No database.
- Local browser recordings.
- Simple data in `localStorage`.

## Phase 2: Real App Foundation

- Create the backend.
- Create authentication.
- Create student, teacher, and administrator profiles.
- Create the database for progress, courses, lessons, and activities.
- Create secure upload for authorized audio/video.

## Phase 3: Applied AI

- Transcribe class audio.
- Analyze pronunciation.
- Identify recurring errors.
- Generate daily recommendations for each student.
- Create summaries for teachers.

## Phase 4: Privacy And Operations

- Explicit consent for recordings.
- Role-based access control.
- Media retention.
- Data deletion when requested.
- Audit logging for recording and analysis access.

## Phase 5: Agentic Product Architecture

- Define frontend, backend, database, and AI Coach agent responsibilities.
- Define the AI Teacher Agent as the instructional agent for teaching, correction, speech feedback, and writing feedback.
- Build knowledge bases for curriculum, platform help, correction style, and privacy policies.
- Build and expand the English KB in `kb/english/`.
- Add RAG retrieval for curriculum, teacher materials, student memory, and session summaries.
- Keep student-specific memory isolated per student and permissioned server-side.
