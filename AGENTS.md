# AGENTS.md

This file guides AI coding agents working in this repository.

## Project Shape

FluentPath English is an English-learning app prototype moving toward a real backend product.

Current stack:

- Plain HTML/CSS/JavaScript frontend.
- Node.js HTTP server.
- PostgreSQL via `DATABASE_URL`.
- In-memory storage fallback for local development.
- Playwright end-to-end smoke tests.

## Important Commands

```bash
npm install
npm test
npm run check
npm run test:e2e
npm run db:migrate
```

Run the app:

```bash
npm start
```

Use PostgreSQL:

```bash
export DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/fluentpath"
npm run db:migrate
npm start
```

## Development Rules

- Keep product copy in English.
- Keep student media, transcripts, and profile data treated as sensitive.
- Do not store plaintext passwords.
- Do not process real audio/video until consent, retention, and deletion workflows exist.
- Keep tests updated when changing login, signup, dashboard, admin, storage, or routing.
- Prefer small modules over growing `server.js`, `app.js`, or `index.html`.
- Backend routes live under `src/server/routes/`.
- Storage implementations live under `src/storage/`.
- Database schema lives in `db/schema.sql`.

## Current Architecture Direction

The frontend is still a static prototype. As it grows, split it into either:

- modular plain JavaScript under `src/client/`, or
- a React + TypeScript frontend with real routing.

The backend is being split into:

- `src/server/http.js`
- `src/server/cookies.js`
- `src/server/auth.js`
- `src/server/validators.js`
- `src/server/routes/`
- `src/storage/`

## Product Agents

Product agent specifications live in `agents/`.

These are not fully implemented in code yet. They define the future behavior and contracts for:

- AI Coach
- AI Teacher
- Placement Agent
- Pronunciation Agent
- Teacher Summary Agent

When implementing AI features, use these specs as contracts and keep student-specific memory permissioned server-side.
