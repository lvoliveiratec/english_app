# System Overview

FluentPath English is an English learning platform with a personalized AI Teacher for every student.

The platform has two broad areas:

- Public product pages for visitors.
- Authenticated student learning pages.
- Teacher pages for assigned student oversight.
- Administrative pages for school operations.

## Public Experience

Public pages explain:

- What FluentPath English is.
- Which courses are available.
- How the AI Coach and AI Teacher method works.
- Why personalized AI guidance improves daily learning.
- How students can sign in or enroll.

## Student Experience

After login, the student sees:

- Student dashboard.
- First AI Teacher contact.
- Placement baseline confirmation based on signup profile.
- Recommended lessons.
- Skill practice: vocabulary, speaking, reading, writing, listening, and pronunciation.
- Read-out-loud pronunciation practice with meaning, form, and pronunciation focus.
- Local recording demos for speech and class media.
- Account settings for contact, address, and password changes.
- Optional teacher assignment through an invite link during signup.

Students who sign up without an invite can still use the student experience, but they remain pending teacher assignment until an admin routes them.

## Teacher Experience

After teacher login, the teacher sees:

- Teacher dashboard.
- Assigned student metrics.
- Student progress and next class focus.
- Suggested teacher actions.
- A teacher invite link for automatic student assignment during signup.

Teacher access to student records is assignment-based through `teacher_student_assignments`.

## Admin Experience

Administrators can currently:

- View school-level totals and student progress summaries.
- Create and edit students, teachers, plans, and courses.
- Assign and reassign students to teachers.
- See whether the app is using PostgreSQL, memory storage, or static-file fallback.

## AI Layers

FluentPath has two AI responsibilities:

- AI Coach: motivation, planning, daily direction, progress framing.
- AI Teacher: instruction, correction, speech feedback, writing feedback, and practice generation.

In the early prototype, these are documented roles and static/local behavior. The backend already stores users, profiles, account data, admin resources, teacher assignments, teacher invites, and pronunciation attempt metadata. In the real app, AI responses should be backed by a server-side orchestration layer, student memory, RAG, and the English KB.

## Core Architecture

The intended production architecture:

- Frontend app.
- Backend API.
- Postgres database.
- In-memory development fallback.
- Assignment-scoped teacher access.
- Object storage for media.
- Worker pipeline for transcription and media processing.
- RAG layer for curriculum, English KB, teacher materials, student memory, and session summaries.
- AI orchestration for AI Coach and AI Teacher responses.
- Audit, privacy, consent, and deletion workflows.
