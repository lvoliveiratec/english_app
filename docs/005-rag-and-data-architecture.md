# RAG And Data Architecture

FluentPath English needs both structured data and retrieval over unstructured learning artifacts.

## Structured Database

Use Postgres as the system of record.

Core entities:

- `users`: authentication identity, role, locale, status.
- `students`: user linkage, English level, goals, consent flags.
- `teachers`: user linkage, permissions, assigned cohorts.
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

## RAG Indexes

Start with Postgres + pgvector if operational simplicity matters. Move to a dedicated vector database only when scale or retrieval quality requires it.

Indexes:

- Curriculum knowledge.
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

## Privacy Boundaries

- Student media is private to that student, authorized teachers/admins, and approved processing jobs.
- Student-specific RAG memory must never be shared across students.
- Curriculum content can be global.
- Teacher-uploaded materials are scoped to teacher, class, course, or institution.
- Raw voice/video should not be sent to model providers unless consent and provider policy allow it.
- Prefer derived artifacts for AI context: transcripts, pronunciation metrics, and summaries.
- Maintain audit logs for teacher/admin/media access.
- Support deletion across database rows, object storage, vector records, transcripts, summaries, and cached exports.
