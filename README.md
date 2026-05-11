# FluentPath English

First prototype of an English learning app/site with:

- Home page
- Demonstration login
- Courses page
- Simulated AI Coach
- Pronunciation practice with local audio recording
- Local audio/video recording for in-person classes, with consent

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

## Documentation

The `docs/` folder stores project history, decisions, and architecture notes:

- `docs/000-process-log.md`
- `docs/001-product-vision.md`
- `docs/002-technical-roadmap.md`
- `docs/003-agent-roles.md`
- `docs/004-mcp-kb-research.md`
- `docs/005-rag-and-data-architecture.md`
- `docs/006-ai-teacher-agent.md`

The first English knowledge base lives in `kb/english/`.

## Next technical steps

1. Create a backend with real users, student profiles, teacher profiles, and admin profiles.
2. Store lesson progress in a database.
3. Upload authorized audio and video for processing.
4. Transcribe classes and pronunciation attempts.
5. Generate personalized AI feedback using the student's history.
6. Create a teacher dashboard with progress summaries, difficulties, and recommendations.
7. Add privacy, consent, retention, and recording deletion policies.
