# Implementation Roadmap

## Phase 1: Prototype Foundation ✅ Complete

- Public pages (home, courses, course detail)
- Signup with full learning profile (level, goal, interests, address, motivation)
- Login, logout, account settings (profile, address, password)
- Student, teacher, and admin role-based dashboards
- Teacher invite links with automatic student assignment
- Admin management: students, teachers, assignments, plans, courses
- PostgreSQL backend with in-memory fallback
- Playwright smoke tests for all major flows
- Docker Compose for local PostgreSQL

## Phase 2: AI Placement and Level Tracking ✅ Complete

- Placement Agent implemented with Claude Haiku
- 7-question placement test: grammar, vocabulary, reading, listening
- Test questions generated dynamically per student profile using CEFR assessment KB
- Auto-placement after signup using motivation text as writing sample
- Placement results stored in PostgreSQL (`ai_feedback` table), available across all devices
- Level suggestions: when AI assessment differs from self-reported level, queues for review
- Teacher dashboard: AI Level Review panel — approve/dismiss per student
- Admin dashboard: same panel for unassigned students and all students
- Assessment KB: 4 files covering grammar, vocabulary, reading, and listening with CEFR-aligned content

## Phase 3: AI Teacher and Lesson Content (next)

- Build lesson content (curriculum) stored in `lessons` table
- Wire AI Teacher agent to Claude API for lesson feedback, corrections, practice generation
- Lesson player UI in the frontend
- AI Teacher uses student placement level, goal, interests, and mistake history as context
- `lesson_progress` records updated after each lesson activity

## Phase 4: AI Coach Personalization

- Wire AI Coach to Claude API
- Personalized dashboard greeting based on real student history
- Daily recommendations based on lesson progress and placement signals
- Progress framing and motivation messages
- Coach uses student memory: last session, streak, recurring mistakes

## Phase 5: Pronunciation and Media

- Real audio upload and storage (requires consent + retention design)
- Pronunciation Agent: score attempts against the phrase, return error list
- Pronunciation history stored per student, fed into AI Teacher context
- Video recording for in-person classes with teacher consent workflow
- Media deletion and retention policies

## Phase 6: RAG and Contextual Memory

- Vector index for the English KB (curriculum, grammar, vocabulary, pronunciation)
- Chunk and embed all `kb/english/` files
- Permissioned retrieval: global KB is public, student memory is isolated per student
- Student memory: mistakes, pronunciation errors, session summaries stored and retrieved
- AI Teacher receives: compact student history + relevant KB chunks + current lesson

## Phase 7: Teacher Tools and Business Operations

- Teacher summary agent: per-student progress summaries using real history
- Teacher notes on students
- Class scheduling and lesson assignment
- Subscription and payment gateway integration
- Audit logs for GDPR/LGPD compliance
- Data export and deletion workflows

## Phase 8: Frontend Migration

- Move from single `app.js` / `index.html` to React + TypeScript
- Real routing (React Router or TanStack Router)
- Reusable component library
- Authenticated and public layouts
- Proper loading, error, and empty states throughout
