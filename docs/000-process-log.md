# Process Log

This document records what we are building and why each step was taken.

## 2026-05-11

- Created the first static prototype of FluentPath English.
- The site includes a home page, demonstration login, courses, and an AI Coach area.
- The AI Coach is still a local simulation, but it already shows the desired experience: personalized greeting, progress summary, and pronunciation suggestions.
- Added local voice recording for pronunciation practice.
- Added local audio/video recording for in-person classes, with a consent notice.
- Installed Node through nvm to run local tools without relying on a global system installation.
- Prepared npm scripts and a simple local Node server.
- Started the documentation structure in `docs/`.
- Confirmed the product, site, and documentation should be English-only.
- Started architectural planning for frontend, backend, database, RAG, knowledge bases, and the student-facing AI Coach.
- Added the AI Teacher Agent as the instructional agent responsible for lessons, speech checks, spelling, writing feedback, corrections, and student direction.
- Created the first English KB in `kb/english/` with CEFR, grammar, pronunciation, vocabulary, spelling/writing, assessment, correction, and lesson pattern modules.
- Reworked the prototype page structure into public pages and post-login student pages.
- Home now explains the product and includes student review examples.
- Courses now opens course detail content.
- AI Coach now explains the method instead of acting as the student dashboard.
- Login now sends students to a dashboard.
- Dashboard includes the first AI Teacher contact and an initial placement questionnaire.
- Lessons page organizes practice by vocabulary, speaking, reading, writing, listening, and pronunciation.
- Clarified the login flow so sign in routes to the student dashboard, not the public AI Coach method page.
- Added a dashboard hero and script cache-buster to make the post-login destination clear during testing.
- Added the `architecture/` folder with system overview, project structure, agent architecture, data/RAG architecture, student flow, Mermaid diagrams, and implementation roadmap.

## 2026-05-12

- Added Playwright as the first end-to-end test framework.
- Added `npm test`, `npm run test:e2e`, and `npm run test:e2e:ui`.
- Created smoke tests for student login, dashboard actions, course browsing, course detail, and mobile navigation.
- Added `Logout` to the student session flow.
- Updated the Home AI panel so it does not show a student's name before login.
- Added a `Create account` flow for a local student profile prototype.
- The student profile captures personal details, English level, main goal, speaking confidence, study availability, interests, favorite media, hobbies, foods/drinks, sports, and motivation.
- The prototype saves the student profile in `localStorage` as `fluentpath:studentProfile`.
- Passwords are not saved in the local student profile.
- Dashboard and Home AI copy now use saved student profile signals when the student is signed in.
- Added tests to confirm account creation, profile persistence, profile-aware dashboard copy, and the rule that password is not stored.
- Added a backend foundation plan in `docs/008-backend-foundation-plan.md`.
- Added the first backend API routes to the existing Node server.
- Added PostgreSQL support through `pg`, with `DATABASE_URL` and `npm run db:migrate`.
- Added in-memory demo storage as a fallback when PostgreSQL is not configured.
- Added `db/schema.sql` with users, profiles, sessions, courses, lessons, progress, consent, media, AI feedback, and payments tables.
- Added server-side password hashing with `scrypt`.
- Connected signup/login/logout to backend endpoints while keeping local fallback behavior for the static prototype.
- Added an admin route and admin dashboard prototype for students, teachers, admins, progress, payments, and operational activity.
- Added a demo admin account in memory storage: `admin@example.com` / `admin123`.
- Added Playwright coverage for admin login and administrative dashboard loading.
- Corrected the student dashboard progress meters so new accounts no longer show fake hardcoded percentages.
- Progress now starts as `Not assessed` and only shows an initial baseline estimate after the placement form is completed.
- Expanded the Admin dashboard with management modules for students, teachers, plans/prices, and courses.
- Added admin API endpoints to list, create, and update students, teachers, plans, and courses.
- Added a `plans` table to the PostgreSQL schema and added admin course fields for description/status.
- Extended Playwright admin coverage to create student, teacher, plan, course, and update a course.
- Refactored the backend from a monolithic `server.js` into `src/server/` modules for HTTP helpers, cookies, auth, validators, static serving, and route handlers.
- Added `Dockerfile` and `.dockerignore` for container deployment experiments and Cloud Run style hosting.
- Added root `AGENTS.md` for repository-level AI coding agent instructions.
- Added product agent specification files in `agents/` for AI Coach, AI Teacher, Placement, Pronunciation, and Teacher Summary agents.
- Added `docker-compose.yml` with a local PostgreSQL service for development.
- Added `npm run db:seed` to create demo student, teacher, admin, address, plan, course, payment, and progress data in PostgreSQL.
- Added `users.phone` and an `addresses` table so student location/contact data can be stored server-side.
- Added address fields to student signup.
- Added an authenticated Account page where users can update name, email, phone, address, and password.
- Added Account API routes for profile updates and password changes.
- Expanded Playwright coverage for signup address data and account settings.
- Removed hardcoded demo values from the login form so a new device does not look pre-authenticated.
- Limited silent local browser fallback to direct static-file previews; HTTP/HTTPS sessions now show backend errors instead of pretending data was saved locally.
- Reframed the dashboard assessment as a placement baseline confirmation because signup already captures the first student profile.
- Added meaning, form, and pronunciation focus notes to the read-out-loud practice phrase.
- Added a `pronunciation_attempts` table and `POST /api/pronunciation-attempts` so recorded practice can create an attempt ID tied to the student, phrase, timestamp, and processing status.
- Reviewed and updated `architecture/06-diagrams.md` to reflect the current backend modules, admin flow, Account flow, PostgreSQL schema, pronunciation-attempt metadata, and future media/RAG pipeline.
- Updated backend, RAG, AI Teacher, agent role, and pronunciation agent documentation to match the current implementation.

## 2026-05-13

- Added a teacher dashboard route and UI for human teachers.
- Teacher login now routes to `#teacher` instead of the student dashboard.
- Added `GET /api/teacher/summary` protected by teacher role checks.
- Added `teacher_student_assignments` so teachers only see assigned students.
- Added `teacher_invites` and invite-code validation.
- Signup through a teacher invite link now automatically assigns the new student to the inviting teacher.
- Normal signup keeps students in `pending_assignment` until an admin assigns them.
- Added a teacher dashboard invite-link panel with copy support.
- Added Admin dashboard assignment management so admins can manually assign or reassign students to teachers.
- Added assignment metadata: `source` and `assigned_by_admin_id`.
- Updated PostgreSQL and in-memory storage adapters for teacher summaries, invite links, assignment creation, and active assignment lookups.
- Added Playwright coverage for teacher login, invite signup assignment, and admin manual assignment.
- Improved mobile layout stability across teacher/admin/student pages and verified no horizontal overflow at common mobile widths.
- Used a Cloudflare Quick Tunnel for mobile device testing against the local app.

## Important Decisions

- The current prototype does not upload raw audio or video to any server.
- Pronunciation recording now creates backend metadata when the API is available, but the raw audio still stays in the browser until authorized upload storage is implemented.
- Recordings need clear consent from both student and teacher.
- Before using real AI with audio/video, the app needs a backend, authentication, privacy policies, and retention/deletion rules.
- Student-specific AI memory must be permissioned and isolated per student.
- Raw media should be treated as sensitive data; AI should prefer derived artifacts such as transcripts, summaries, and pronunciation metrics when possible.
- Raw audio should not be embedded directly into RAG. Store raw media in object storage, store transcripts/derived metrics in the database, and index only permissioned text/summary artifacts.
- Passwords must never be stored directly in frontend storage or plain database fields.
- The local student profile is a prototype data shape, not a production storage model.
- User address and contact changes belong behind authenticated account routes, not public profile-only storage.
- Teacher access to student learning data is assignment-based.
- Teacher invite links can assign students automatically, but admin manual assignment remains the operational fallback and correction path.
