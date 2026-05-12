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

## Important Decisions

- The current prototype does not send audio or video to any server.
- Recordings need clear consent from both student and teacher.
- Before using real AI with audio/video, the app needs a backend, authentication, privacy policies, and retention/deletion rules.
- Student-specific AI memory must be permissioned and isolated per student.
- Raw media should be treated as sensitive data; AI should prefer derived artifacts such as transcripts, summaries, and pronunciation metrics when possible.
- Passwords must never be stored directly in frontend storage or plain database fields.
- The local student profile is a prototype data shape, not a production storage model.
