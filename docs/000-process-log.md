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

## Important Decisions

- The current prototype does not send audio or video to any server.
- Recordings need clear consent from both student and teacher.
- Before using real AI with audio/video, the app needs a backend, authentication, privacy policies, and retention/deletion rules.
- Student-specific AI memory must be permissioned and isolated per student.
- Raw media should be treated as sensitive data; AI should prefer derived artifacts such as transcripts, summaries, and pronunciation metrics when possible.
