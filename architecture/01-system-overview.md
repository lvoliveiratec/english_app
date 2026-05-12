# System Overview

FluentPath English is an English learning platform with a personalized AI Teacher for every student.

The platform has two broad areas:

- Public product pages for visitors.
- Authenticated student learning pages.
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

## Admin Experience

Administrators can currently:

- View school-level totals and student progress summaries.
- Create and edit students, teachers, plans, and courses.
- See whether the app is using PostgreSQL, memory storage, or static-file fallback.

## AI Layers

FluentPath has two AI responsibilities:

- AI Coach: motivation, planning, daily direction, progress framing.
- AI Teacher: instruction, correction, speech feedback, writing feedback, and practice generation.

In the early prototype, these are documented roles and static/local behavior. The backend already stores users, profiles, account data, admin resources, and pronunciation attempt metadata. In the real app, AI responses should be backed by a server-side orchestration layer, student memory, RAG, and the English KB.

## Core Architecture

The intended production architecture:

- Frontend app.
- Backend API.
- Postgres database.
- In-memory development fallback.
- Object storage for media.
- Worker pipeline for transcription and media processing.
- RAG layer for curriculum, English KB, teacher materials, student memory, and session summaries.
- AI orchestration for AI Coach and AI Teacher responses.
- Audit, privacy, consent, and deletion workflows.
