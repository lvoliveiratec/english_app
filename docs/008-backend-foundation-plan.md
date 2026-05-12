# Backend Foundation Plan

This document defines the next implementation step after the static prototype.

## Goal

Create a real backend foundation that can replace the current local demo state.

The first backend should support:

- Real users.
- Student profiles.
- Teacher profiles.
- Admin profiles.
- Login, logout, and current-session checks.
- Student profile storage.
- Lesson progress storage.
- Consent records for audio/video.
- A future path for transcription and AI feedback.

## Recommended Sequence

### 1. Backend API

Create a small API server with:

- Health check endpoint.
- Auth endpoints.
- Student profile endpoints.
- Teacher/admin placeholders.
- Database connection.
- Migration workflow.

Suggested first endpoints:

```text
GET  /api/health
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/students/me/profile
PUT  /api/students/me/profile
```

Current implemented endpoints:

```text
GET  /api/health
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/admin/summary
GET  /api/admin/resources
POST /api/admin/students
PUT  /api/admin/students/:id
POST /api/admin/teachers
PUT  /api/admin/teachers/:id
POST /api/admin/plans
PUT  /api/admin/plans/:id
POST /api/admin/courses
PUT  /api/admin/courses/:id
```

The backend currently uses PostgreSQL when `DATABASE_URL` is set. Without `DATABASE_URL`, it uses in-memory demo storage.

### 2. Database Schema

Start with tables that match the current product needs:

- `users`
- `student_profiles`
- `teacher_profiles`
- `admin_profiles`
- `sessions`
- `courses`
- `plans`
- `lessons`
- `lesson_progress`
- `consent_records`
- `media_records`
- `ai_feedback`
- `payments`

The current `localStorage["fluentpath:studentProfile"]` shape should become the first version of `student_profiles`.

### 3. Authentication And Roles

Required roles:

- `student`
- `teacher`
- `admin`

Minimum behavior:

- Students can access their own profile and progress.
- Teachers can later access assigned student summaries.
- Admins can later manage users, courses, policies, and operational records.

Passwords must be hashed server-side. The frontend must never store passwords.

### 4. Lesson Progress

Track:

- Student ID.
- Lesson ID.
- Skill area.
- Status.
- Score or completion percentage.
- Time spent.
- Mistakes and correction tags.
- Last activity timestamp.

This becomes the base memory for personalized recommendations.

### 5. Authorized Media Uploads

Before uploading real audio/video, the backend needs:

- A consent record.
- Student ID.
- Teacher ID when applicable.
- Media purpose.
- Retention policy.
- Deletion status.
- Processing status.

Suggested states:

```text
pending_upload
uploaded
transcribing
analyzed
failed
deleted
```

### 6. Transcription And AI Feedback

Do this only after auth, consent, and media records exist.

Pipeline:

- Upload authorized media.
- Create transcript.
- Extract pronunciation or speaking signals.
- Store compact feedback.
- Generate student-facing recommendations.
- Generate teacher-facing summaries.

### 7. Teacher Dashboard

Start after progress and AI feedback are stored.

Teacher dashboard should show:

- Student progress summary.
- Recurring difficulties.
- Recommended next lessons.
- Speaking/pronunciation trends.
- Recent AI feedback.
- Consent and media processing status.

### 8. Privacy, Consent, Retention, And Deletion

These are not optional extras. They should be part of the data model before real media processing.

Minimum policies to define:

- What data is collected.
- Why it is collected.
- Who can access it.
- How long it is retained.
- How a student can request deletion.
- What happens to raw media after transcription/analysis.

## First Implementation Milestone

Build only this first:

- API server. Started.
- Database connection. Started.
- Migrations. Started.
- `users`, `student_profiles`, `sessions`. Started.
- Student signup/login/logout. Started.
- Current student profile endpoint. Pending.
- Frontend connected to those endpoints. Started.
- Admin summary endpoint and first admin dashboard. Started.
- Admin management for students, teachers, plans, and courses. Started.

Keep media upload, transcription, AI feedback, and teacher dashboards as later milestones.

## Immediate Next Backend Tasks

- Add `GET /api/students/me/profile`.
- Add `PUT /api/students/me/profile`.
- Add lesson progress create/update endpoints.
- Expand server-side role checks into permission scopes and audit logs.
- Add teacher assignment tables before building the teacher dashboard.
- Add seed data or an admin creation script for PostgreSQL development.
- Add admin payment management endpoints.
- Add admin policy/consent management endpoints.
