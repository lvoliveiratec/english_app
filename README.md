# FluentPath English

First prototype of an English learning app/site with:

- Home page
- Demonstration login, logout, student account creation, and account settings
- Courses page
- Simulated AI Coach
- Student dashboard with profile-aware AI Teacher copy
- Initial backend API with auth, sessions, student addresses, PostgreSQL schema, and in-memory fallback
- Admin dashboard prototype with metrics plus forms to create/edit students, teachers, plans, and courses
- Pronunciation practice with local audio recording
- Pronunciation attempt records with student, phrase, timestamp, and processing status
- Local audio/video recording for in-person classes, with consent
- Playwright smoke tests for login, signup, account settings, admin, course navigation, and mobile navigation
- Dockerfile for container deployment experiments such as Cloud Run
- Docker Compose service for a local PostgreSQL development database

## How to open

Open `index.html` in a browser.

Some browsers only allow microphone/camera access on `localhost` or HTTPS. If recording does not work directly from the file, run the local Node server.

## How to run with Node

This project uses Node through nvm. If your terminal does not recognize `node`, run:

```bash
source ~/.nvm/nvm.sh
nvm use
```

Then:

```bash
npm start
```

The site runs at `http://127.0.0.1:5173`.

For Cloud Run style environments, set:

```bash
HOST=0.0.0.0
PORT=8080
```

## Backend and PostgreSQL

The app can run without PostgreSQL. If `DATABASE_URL` is not set, the backend uses in-memory demo data so local development and tests keep working.

To use PostgreSQL, set `DATABASE_URL` and run migrations:

```bash
export DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/fluentpath"
npm run db:migrate
npm run db:seed
npm start
```

For the included local database:

```bash
docker compose up -d postgres
export DATABASE_URL="postgres://fluentpath:fluentpath_dev@localhost:5432/fluentpath"
npm run db:migrate
npm run db:seed
npm start
```

Current API endpoints:

```text
GET  /api/health
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/account
PUT  /api/account
PUT  /api/account/password
POST /api/pronunciation-attempts
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

Demo accounts when using in-memory storage:
The same accounts can be added to PostgreSQL with `npm run db:seed`.

```text
lucas@example.com / english123
admin@example.com / admin123
teacher@example.com / teacher123
```

When the app is served over HTTP/HTTPS, login, signup, admin, account, and pronunciation attempts are expected to use the backend API. Local browser fallback is kept only for opening `index.html` directly as a static file.

## Docker

Run PostgreSQL locally:

```bash
docker compose up -d postgres
```

Build and run the app container locally:

```bash
docker build -t fluentpath-english .
docker run --rm -p 8080:8080 fluentpath-english
```

With PostgreSQL:

```bash
docker run --rm -p 8080:8080 \
  -e DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/fluentpath" \
  fluentpath-english
```

For Cloud Run, configure `DATABASE_URL` as an environment variable or secret. Run migrations separately before serving production traffic.

## How to test

Install dependencies:

```bash
npm install
npx playwright install chromium
```

Run the full local check:

```bash
npm test
```

This runs JavaScript syntax checks and Playwright end-to-end smoke tests.

Useful scripts:

```bash
npm run check
npm run test:e2e
npm run test:e2e:ui
```

## Documentation

The `docs/` folder stores project history, decisions, and architecture notes:

- `docs/000-process-log.md`
- `docs/001-product-vision.md`
- `docs/002-technical-roadmap.md`
- `docs/003-agent-roles.md`
- `docs/004-mcp-kb-research.md`
- `docs/005-rag-and-data-architecture.md`
- `docs/006-ai-teacher-agent.md`
- `docs/007-page-and-student-flow.md`
- `docs/008-backend-foundation-plan.md`

The first English knowledge base lives in `kb/english/`.

The project architecture folder lives in `architecture/`.

Product agent specifications live in `agents/`.

Repository instructions for AI coding agents live in `AGENTS.md`.

## Next technical steps

1. Add lesson progress create/update endpoints.
2. Add teacher-facing APIs and teacher dashboard screens.
3. Add admin management for payments, consent, retention, and deletion policies.
4. Add authorized audio/video upload records before processing real media.
5. Add transcription and AI feedback pipelines using student history.
