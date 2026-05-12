# FluentPath English

First prototype of an English learning app/site with:

- Home page
- Demonstration login, logout, and local student account creation
- Courses page
- Simulated AI Coach
- Student dashboard with profile-aware AI Teacher copy
- Initial backend API with auth, sessions, PostgreSQL schema, and in-memory fallback
- Admin dashboard prototype with metrics plus forms to create/edit students, teachers, plans, and courses
- Pronunciation practice with local audio recording
- Local audio/video recording for in-person classes, with consent
- Playwright smoke tests for login, signup, admin, course navigation, and mobile navigation

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

## Backend and PostgreSQL

The app can run without PostgreSQL. If `DATABASE_URL` is not set, the backend uses in-memory demo data so local development and tests keep working.

To use PostgreSQL, set `DATABASE_URL` and run migrations:

```bash
export DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/fluentpath"
npm run db:migrate
npm start
```

Current API endpoints:

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

Demo accounts when using in-memory storage:

```text
lucas@example.com / english123
admin@example.com / admin123
teacher@example.com / teacher123
```

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

## Next technical steps

1. Add dedicated student profile endpoints for the logged-in student.
2. Add lesson progress create/update endpoints.
3. Add teacher-facing APIs and teacher dashboard screens.
4. Add admin management for payments, consent, retention, and deletion policies.
5. Add authorized audio/video upload records before processing real media.
6. Add transcription and AI feedback pipelines using student history.
