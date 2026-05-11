# System Overview

FluentPath English is an English learning platform with a personalized AI Teacher for every student.

The platform has two broad areas:

- Public product pages for visitors.
- Authenticated student learning pages.

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
- Placement questionnaire.
- Recommended lessons.
- Skill practice: vocabulary, speaking, reading, writing, listening, and pronunciation.
- Local recording demos for speech and class media.

## AI Layers

FluentPath has two AI responsibilities:

- AI Coach: motivation, planning, daily direction, progress framing.
- AI Teacher: instruction, correction, speech feedback, writing feedback, and practice generation.

In the early prototype, these are documented roles and static/local behavior. In the real app, they should be backed by a server-side AI orchestration layer, student memory, RAG, and the English KB.

## Core Architecture

The intended production architecture:

- Frontend app.
- Backend API.
- Postgres database.
- Object storage for media.
- Worker pipeline for transcription and media processing.
- RAG layer for curriculum, English KB, teacher materials, student memory, and session summaries.
- AI orchestration for AI Coach and AI Teacher responses.
- Audit, privacy, consent, and deletion workflows.
