# Placement Agent

**Status: Implemented** — `src/agents/placement.js`

## Purpose

Estimates the student's English level and creates a placement baseline using a structured 8-question test and/or writing sample.

## How it works

### Auto-placement (after signup)
- Runs automatically with the student's motivation text as a writing sample
- No form required; gives an initial baseline immediately

### Placement test (on demand)
- Student clicks "Take placement test" or "Retake test" from the dashboard
- Claude generates 8 questions via `GET /api/placement/questions`:
  - Grammar ×2 (gap-fill at self-reported level and one level below)
  - Vocabulary ×2 (gap-fill + multiple-choice with 3 options)
  - Reading ×2 (shared 60-80 word passage, detail + inference questions)
  - Listening ×1 (dialogue cloze, 2 blanks; natural audio via ElevenLabs TTS)
  - Speaking ×1 (read a sentence aloud; transcript captured via Web Speech API)
- Student answers and submits
- Claude evaluates all 8 answers together and returns placement result

### Score
- 0-100% — Claude computes based on correct/incorrect answers across all 8 questions
- Stored in `ai_feedback.score` and included in test history

### Level suggestion
- If assessed level ≠ self-reported level → creates a suggestion in `student_profiles`
- Teacher (for assigned students) or admin (for all) reviews and can approve/dismiss
- On approve: `student_profiles.level = suggested_level`

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/placement` | Fetch latest placement from DB |
| `GET` | `/api/placement/questions` | Generate 8 questions for current student |
| `POST` | `/api/placement` | Evaluate answers or writing sample, save result |
| `GET` | `/api/my-tests` | Student's placement history (compact list) |
| `GET` | `/api/my-tests/:testId` | Single test detail with questions+answers |

## Outputs

```json
{
  "feedback": "2-3 encouraging sentences",
  "level": "Beginner | Elementary | Intermediate | Upper Intermediate | Advanced",
  "score": 75,
  "metrics": { "fluency": 12, "listening": 18, "pronunciation": 10 },
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

## Storage

- `ai_feedback` (source_type: `'placement'`):
  - `summary` = feedback text
  - `recommendations` = priorities array
  - `score` = 0-100 integer
  - `source_data` = JSON with `{ questions, answers, level }`
- `student_profiles.suggested_level` + `level_review_status` for level suggestions

## Boundaries

- Baseline is an estimate, not a measured score — the UI communicates this clearly
- Level only changes in `student_profiles` when teacher/admin explicitly approves
- Never use other students' data
