# Placement Agent

**Status: Implemented** — `src/agents/placement.js`

## Purpose

Estimates the student's English level and creates a placement baseline using a structured test and/or writing sample.

## How it works

### Phase 1 — Auto-placement (after signup)
- Called automatically after a new student signs up.
- Uses the student's motivation text as a writing sample.
- Returns an initial baseline without a full test.

### Phase 2 — Placement test (on demand)
- Student clicks "Take placement test" or "Retake test" in the dashboard.
- Agent generates 7 questions across 4 skills:
  - Grammar (×2): gap-fill questions targeting the self-reported level and one level below
  - Vocabulary (×2): gap-fill + multiple choice with 3 options
  - Reading (×2): shared passage (60–80 words), one detail + one inference question
  - Listening (×1): dialogue cloze with 2 blanks
- Student answers all questions and submits.
- Agent evaluates the full set and returns a placement result.

### Level suggestion
- If the assessed level differs from the self-reported level, a level suggestion is created.
- The assigned teacher (or admin if no teacher) reviews and can approve or dismiss.
- On approve: the student's level is updated in `student_profiles`.

## Inputs

### Question generation
- Student profile (native language, self-reported level, goal)
- Assessment KB files: `kb/english/assessment-grammar.md`, `assessment-vocabulary.md`, `assessment-reading.md`, `assessment-listening.md`

### Evaluation
- Student profile
- All 7 questions (passed back from frontend)
- Student answers keyed by question ID
- CEFR guide + all assessment KB files

### Writing sample (auto-placement)
- Profile motivation text
- Student profile (native language, level, goal)

## Outputs

```json
{
  "feedback": "2–3 encouraging sentences describing the result",
  "level": "Beginner | Elementary | Intermediate | Upper Intermediate | Advanced",
  "metrics": { "fluency": 28, "listening": 34, "pronunciation": 25 },
  "priorities": ["specific priority 1", "specific priority 2", "specific priority 3"]
}
```

Metrics are deterministic from level:

| Level | Fluency | Listening | Pronunciation |
|---|---|---|---|
| Beginner | 12% | 18% | 10% |
| Elementary | 28% | 34% | 25% |
| Intermediate | 52% | 58% | 48% |
| Upper Intermediate | 70% | 76% | 66% |
| Advanced | 84% | 88% | 82% |

## Boundaries

- The baseline is an estimate, not a measured score. The UI communicates this clearly.
- Do not overstate accuracy — always call it an "initial baseline".
- Accept reasonable answers with minor spelling errors.
- Level should only change in `student_profiles` when a teacher or admin explicitly approves a suggestion.
- Student data from other students must never be used.

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/placement` | Fetch latest placement from DB |
| `GET` | `/api/placement/questions` | Generate 7 questions for current student |
| `POST` | `/api/placement` | Evaluate answers or writing sample, save result |

## Storage

Saved in `ai_feedback` table with `source_type = 'placement'`:
- `summary` — feedback text
- `recommendations` — priorities array

Level suggestions saved in `student_profiles`:
- `suggested_level` — Claude's assessed level
- `level_review_status` — `'none' | 'pending' | 'approved' | 'dismissed'`
