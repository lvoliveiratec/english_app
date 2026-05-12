# RAG And Data Architecture

FluentPath English needs both structured data and retrieval over unstructured learning artifacts.

## Structured Database

Use Postgres as the system of record.

Core entities:

- `users`: authentication identity, role, locale, status.
- `student_profiles`: user linkage, English level, goals, profile questionnaire, learning context.
- `teacher_profiles`: user linkage, specialty, status, future assigned cohorts.
- `admin_profiles`: user linkage and admin status.
- `addresses`: contact/location data tied to users.
- `courses`: curriculum container.
- `units`: course sections.
- `lessons`: metadata, skill focus, CEFR level, objectives.
- `lesson_activities`: prompts, rubrics, expected outputs, activity type.
- `student_enrollments`: student-course membership.
- `practice_sessions`: student, lesson/activity, mode, timestamps, score summary.
- `session_turns`: prompt, student response, AI/teacher feedback, timing.
- `assessments`: fluency, grammar, vocabulary, pronunciation, rubric scores.
- `assignments`: teacher-created tasks, due dates, completion state.
- `student_progress`: normalized progress snapshots by skill/course/unit.
- `media_assets`: owner student, asset type, storage URI, duration, MIME type, processing state.
- `media_derivatives`: transcript, waveform, thumbnail, compressed versions, pronunciation metrics.
- `pronunciation_attempts`: current metadata record for read-out-loud practice attempts.
- `content_documents`: curriculum and teacher-uploaded learning materials.
- `rag_chunks`: chunk metadata, source document, permissions, embedding reference.
- `audit_events`: access, export, deletion, admin actions.

## Media Storage

Store binary media outside the database in object storage.

Suggested prefixes:

- `student-media/raw/{student_id}/{asset_id}` for original voice, video, and image uploads.
- `student-media/processed/{student_id}/{asset_id}` for normalized audio, compressed video, thumbnails, and extracted frames.
- `learning-content/{course_id}/{document_id}` for curriculum and teacher materials.
- `exports/{request_id}` for temporary student data exports.

The database stores metadata only: owner, object key, checksum, size, duration, consent state, retention state, processing status, and access classification.

Current prototype state:

- Read-out-loud recording creates a `pronunciation_attempts` row with student ID, phrase, duration estimate, local size estimate, timestamp, and `recorded_locally` status.
- Raw audio is still local to the browser.
- Future upload processing should update the attempt with object-storage URL, transcript, pronunciation metrics, and analysis state.

## RAG Indexes

Start with Postgres + pgvector if operational simplicity matters. Move to a dedicated vector database only when scale or retrieval quality requires it.

Indexes:

- Curriculum knowledge.
- English teacher knowledge from `kb/english/`.
- Teacher materials.
- Student memory.
- Session transcripts and summaries.

Each chunk should include:

- `source_type`
- `source_id`
- `course_id`
- `student_id` when student-specific
- `teacher_id` or cohort scope when relevant
- `visibility_scope`
- `created_at`
- `retention_until`
- `consent_basis`

## Retrieval Rule

Permissions must be enforced before or during retrieval. Never rely only on the AI prompt to separate student data.

Recommended flow:

1. Ingest document, transcript, or summary.
2. Normalize and chunk.
3. Generate embeddings.
4. Store embeddings with metadata and permission scope.
5. Retrieve by task context, student, course, and visibility boundary.
6. Rerank.
7. Assemble a compact context packet for the AI Coach.

For pronunciation attempts, only derived artifacts should enter RAG: transcripts, summaries, pronunciation metrics, recurring-error records, and teacher-approved notes. Raw audio should stay in object storage with explicit consent, retention, and deletion controls.

## Privacy Boundaries

- Student media is private to that student, authorized teachers/admins, and approved processing jobs.
- Student-specific RAG memory must never be shared across students.
- Curriculum content can be global.
- Teacher-uploaded materials are scoped to teacher, class, course, or institution.
- Raw voice/video should not be sent to model providers unless consent and provider policy allow it.
- Prefer derived artifacts for AI context: transcripts, pronunciation metrics, and summaries.
- Maintain audit logs for teacher/admin/media access.
- Support deletion across database rows, object storage, vector records, transcripts, summaries, and cached exports.

## AI Teacher Retrieval Context

The AI Teacher Agent should receive a compact context packet assembled server-side:

- Student profile and level.
- Current lesson objective.
- Recent mistakes and due reviews.
- Relevant English KB chunks.
- Relevant curriculum chunks.
- Authorized teacher notes.
- Speech or writing analysis output.
- Privacy-safe session summary.

The AI Teacher Agent should never retrieve directly from raw storage. It should receive only filtered, authorized, task-specific context.
