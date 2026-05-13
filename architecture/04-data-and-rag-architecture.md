# Data And RAG Architecture

FluentPath English needs structured data, media storage, derived learning artifacts, and retrieval over knowledge sources.

## Structured Data

Use Postgres as the system of record.

Core entity groups:

- Identity: users, roles, sessions.
- Learning: students, courses, units, lessons, activities, enrollments.
- Progress: practice sessions, session turns, assessments, skill snapshots.
- Teaching: teachers, cohorts, assignments, teacher notes.
- Teacher invites: invite codes, status, use counts, expiration, and teacher ownership.
- Media: media assets, derivatives, transcripts, pronunciation metrics.
- Pronunciation attempts: student, phrase, duration, local size estimate, object-storage URL when available, transcript, processing status, and timestamp.
- AI memory: student mistakes, summaries, review schedules, recommendations.
- Business: prices, plans, subscriptions, payments.
- Governance: consent records, retention records, audit events, deletion requests.

## Media Storage

Store binary media outside the database.

Object storage should hold:

- Raw student audio.
- Raw student video.
- Uploaded images.
- Processed audio.
- Compressed video.
- Thumbnails.
- Extracted frames.
- Temporary exports.

The database stores metadata, permissions, consent, and processing state.

Current prototype behavior:

- A pronunciation attempt creates database metadata through `POST /api/pronunciation-attempts`.
- The raw audio is not uploaded yet.
- The attempt starts with `processing_status = recorded_locally`.
- Future upload processing should attach `audio_storage_url`, then transcript and pronunciation metrics.

## Knowledge Bases

### Current approach — prompt context

KB files are loaded into Claude API system prompts at module startup.
Prompt caching (`cache_control: { type: "ephemeral" }`) is used to avoid re-sending the same content on every request.

Files currently loaded in `src/agents/placement.js`:
- `kb/english/cefr-level-guide.md`
- `kb/english/assessment-grammar.md`
- `kb/english/assessment-vocabulary.md`
- `kb/english/assessment-reading.md`
- `kb/english/assessment-listening.md`

This works well for small-to-medium KBs. As content grows, chunking and vector retrieval (RAG) become necessary.

### Planned Global KBs

- English KB (CEFR levels, grammar, vocabulary, pronunciation, correction policy)
- Curriculum KB (lesson content, exercises, unit structure)
- Platform help KB
- Correction style guide

### Planned Scoped KBs

- Teacher materials (assignment-scoped)
- Student memory (isolated per student)
- Session summaries
- Student-specific transcripts (consent-gated)

## RAG Retrieval Rule

Permissions must be enforced before or during retrieval.

The AI Teacher should not directly query raw stores. The backend/RAG layer should assemble a context packet:

- Student level.
- Current lesson.
- Relevant English KB chunks.
- Relevant curriculum chunks.
- Recent mistakes.
- Due review items.
- Authorized teacher notes.
- Speech or writing analysis output.

Raw media should not be inserted into RAG. The RAG layer should use permissioned transcripts, summaries, pronunciation metrics, recurring-error records, and teacher-approved notes. Raw audio/video belongs in object storage with retention and deletion controls.

## Student Memory

Student memory should store learning signals, not unnecessary raw data.

Examples:

- Recurring grammar mistakes.
- Difficult sounds.
- Vocabulary misses.
- Writing patterns.
- Confidence signals.
- Completed lessons.
- Recommended next activity.
- Last practiced date.
- Next review date.

## Privacy Requirements

- Student-specific memory must never be shared across students.
- Raw media should have strict retention rules.
- Deletion must cover database rows, object storage, vector records, transcripts, summaries, and cached exports.
- Admin and teacher access must be audited.
- Teacher access to student-specific context must be constrained by active teacher/student assignments.
- Consent must be captured before class recording or media analysis.
