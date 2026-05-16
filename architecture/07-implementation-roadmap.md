# Implementation Roadmap

## Phase 1: Prototype Foundation ✅ Complete

- Public pages, signup, login, logout, account settings
- Student, teacher, and admin role-based dashboards
- Teacher invite links with automatic student assignment
- Admin management: students, teachers, assignments, plans, courses
- PostgreSQL backend with in-memory fallback
- Playwright smoke tests for all major flows
- Docker Compose for local PostgreSQL

## Phase 2: AI Placement and Level Tracking ✅ Complete

- Placement Agent — 8-question test: grammar ×2, vocabulary ×2, reading ×2, listening ×1, speaking ×1
- Questions generated dynamically per student profile using CEFR assessment KB
- Listening questions use ElevenLabs TTS with two natural voices (iOS Web Audio API)
- Score 0-100% computed by Claude based on correct/incorrect answers
- Auto-placement after signup using motivation text
- Placement results stored in PostgreSQL with full questions+answers in `source_data`
- Level suggestions: AI level ≠ self-reported → queued for teacher/admin review
- Teacher and admin AI Level Review panels with approve/dismiss
- My Tests page — compact list → tap → detail with questions, answers, AI feedback, priorities
- Teacher can see student test history

## Phase 3: Admin UX and Notifications ✅ Complete

- Admin dashboard refactored into 6 sub-pages: overview + students, teachers, assignments, plans, courses
- Each sub-page has: search/filter bar + pagination (10/page + Load more)
- Student filters: name/email, level, goal, teacher
- Teacher filters: name/email, specialty, status
- Assignment filters: student/teacher name, source
- `student_notifications` table — admin sends AI recommendation → student sees yellow panel on dashboard → "Got it ✓" dismisses
- In-person class recording: browser record or file upload (iOS .m4a), AssemblyAI transcription with speaker diarization, Claude lesson analysis

## Phase 4: AI Teacher and Lesson Content (next)

- Build lesson content (curriculum) stored in `lessons` table
- Wire AI Teacher agent to Claude API for lesson feedback, corrections, practice generation
- Lesson player UI in the frontend
- AI Teacher uses: student placement level, goal, interests, mistake history, KB chunks
- `lesson_progress` records updated after each lesson activity

## Phase 5: AI Coach Personalization

- Wire AI Coach to Claude API
- Personalized dashboard greeting based on real student history
- Daily recommendations based on lesson progress and placement signals
- Coach uses: last session, streak, recurring mistakes, next review items

## Phase 6: Pronunciation and Media Hardening

- Pronunciation Agent: score attempts against the phrase, return error list
- Pronunciation history stored per student, fed into AI Teacher context
- Consent, retention, and deletion workflows for class recording media
- Teacher approval workflow for media access

## Phase 7: RAG and Contextual Memory

- Vector index for KB (curriculum, grammar, vocabulary, pronunciation)
- Chunk and embed all `kb/english/` files
- Permissioned retrieval: global KB public, student memory isolated per student
- AI Teacher receives: compact student history + relevant KB chunks + current lesson
- Student memory: mistakes, pronunciation errors, session summaries

## Phase 8: Teacher Tools and Business Operations

- Teacher summary agent: per-student progress summaries from real history
- Teacher notes on students
- Class scheduling and lesson assignment
- Subscription and payment gateway integration
- Audit logs for GDPR/LGPD compliance
- Data export and deletion workflows

## Phase 9: Frontend Migration

- Move from single `app.js` / `index.html` to React + TypeScript
- Real routing (React Router or TanStack Router)
- Reusable component library
- Authenticated and public layouts
- Proper loading, error, and empty states throughout
