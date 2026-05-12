# Implementation Roadmap

## Phase 1: Stronger Prototype

- Improve public pages.
- Add course detail pages.
- Add student dashboard.
- Add signup profile capture and placement baseline confirmation.
- Add lessons page.
- Add signup, login, logout, and local static-preview fallback state.
- Add Playwright smoke tests for core flows.
- Add initial backend API with PostgreSQL schema and memory fallback.
- Add first admin dashboard prototype.
- Add local PostgreSQL through Docker Compose.
- Add account settings for contact, address, and password updates.
- Keep all copy English-only.
- Keep documentation updated.

## Phase 2: Frontend App

- Move from static HTML/CSS/JS to React + TypeScript.
- Add real routing.
- Build reusable components.
- Add authenticated and public layouts.
- Add lesson player UI.
- Add dashboard states and onboarding flow.

## Phase 3: Backend Foundation

- Create backend API.
- Add authentication.
- Add Postgres.
- Add migrations.
- Add user, session, student profile, teacher profile, admin profile, course, lesson, progress, consent, and media models.
- Add API contracts for frontend.
- Connect signup, login, logout, current profile, account update, and password update to the backend.
- Add admin summary API and administrative dashboard.
- Add account settings APIs and pronunciation attempt metadata.
- Keep media upload out of the first backend milestone until auth and consent are in place.

## Phase 4: AI Teacher MVP

- Define AI Teacher input/output contract.
- Connect English KB retrieval.
- Store compact student learning signals.
- Generate lesson feedback.
- Generate writing corrections.
- Generate pronunciation feedback from transcript/metrics.

## Phase 5: Media And RAG

- Add signed uploads.
- Add object storage.
- Add transcription pipeline.
- Add media processing workers.
- Add vector index for KB and student memory.
- Add permissioned RAG retrieval.

## Phase 6: Teacher And Business Operations

- Add teacher dashboard.
- Add assignments.
- Add pricing and payment records.
- Add subscription status.
- Add audit logs.
- Add export and deletion workflows.
