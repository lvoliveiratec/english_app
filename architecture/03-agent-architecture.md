# Agent Architecture

FluentPath English uses agent roles as architectural boundaries for AI features.

Agents are not separate deployed services — they are modules within the backend that make Claude API calls and return structured results.

## Implementation Status

| Agent | Spec | Implemented |
|---|---|---|
| Placement Agent | `agents/placement-agent.md` | ✅ `src/agents/placement.js` |
| AI Coach | `agents/ai-coach.md` | ⏳ UI placeholder only |
| AI Teacher | `agents/ai-teacher.md` | ⏳ not yet wired |
| Pronunciation Agent | `agents/pronunciation-agent.md` | ⏳ not yet wired |
| Teacher Summary Agent | `agents/teacher-summary-agent.md` | ⏳ not yet wired |

---

## Placement Agent (implemented)

**File:** `src/agents/placement.js`

**Two functions:**

### `generatePlacementQuestions({ profile, selfReportedLevel })`
- Loads 4 assessment KB files as a cached system prompt
- Asks Claude Haiku to generate 7 questions:
  - 2 grammar (gap-fill, at reported level and one below)
  - 2 vocabulary (gap-fill + multiple choice)
  - 2 reading (shared passage, detail + inference)
  - 1 listening (dialogue cloze)
- Returns `{ questions: [...] }` with type, skill, passage, prompt, options per question

### `runPlacementAgent({ profile, level, goal, questions, answers, writing })`
- Two modes:
  - **Full test**: receives `questions` + `answers` → evaluates all answers together
  - **Writing sample**: receives `writing` → used for auto-placement after signup
- Loads CEFR guide + assessment KB as cached system prompt
- Returns `{ feedback, level, metrics, priorities }`
- `level` is one of: Beginner, Elementary, Intermediate, Upper Intermediate, Advanced
- `metrics` are deterministic from level: `{ fluency, listening, pronunciation }`

**Level suggestion flow:**
- After evaluation, if `result.level !== profile.level`, a level suggestion is created in `student_profiles` (`suggested_level`, `level_review_status = 'pending'`)
- Teacher (for assigned students) or Admin (for all students) reviews and approves/dismisses
- On approve: `student_profiles.level = suggested_level`

---

## AI Coach Agent (planned)

Owns planning, motivation, and daily direction.

**Planned inputs:** student profile, placement result, lesson progress, pronunciation history, time since last session.

**Planned outputs:** personalized greeting, progress summary, today's recommended focus, encouragement message.

**Current state:** Dashboard greeting is static copy personalized from the student profile object. Not connected to Claude.

---

## AI Teacher Agent (planned)

Owns instruction, correction, and practice generation.

**Planned inputs:** student profile, current lesson, student answer or transcript, placement level, recurring mistakes from history, KB chunks.

**Planned outputs:** lesson explanation, corrections, practice prompts, feedback summary, next recommendation.

**Current state:** Not yet wired. Spec in `agents/ai-teacher.md`.

---

## Pronunciation Agent (planned)

Owns pronunciation scoring and feedback.

**Planned inputs:** phrase, audio transcript (when available), student history of mispronounced sounds.

**Planned outputs:** score, specific sound errors, remediation suggestions.

**Current state:** Pronunciation attempt metadata is stored in `pronunciation_attempts`. Audio upload pipeline not yet built.

---

## Teacher Summary Agent (planned)

Owns teacher-facing progress summaries.

**Planned inputs:** assigned student profiles, lesson progress, placement history, recurring mistakes, pronunciation data.

**Planned outputs:** student summary card per student, suggested next class focus, flagged patterns.

**Current state:** Teacher dashboard shows hardcoded next actions. Not connected to Claude.

---

## Agent Implementation Pattern

All agents follow the same pattern established in `src/agents/placement.js`:

```javascript
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("node:fs");
const path = require("node:path");

const client = new Anthropic();

// Load KB files at module startup (cached in memory)
const systemPrompt = `...` + loadKb("relevant-file.md");

async function runXxxAgent({ ...inputs }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",   // or opus/sonnet for complex tasks
    max_tokens: 512,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: buildUserMessage(inputs) }],
  });

  // Always strip markdown fences before JSON.parse
  const raw = response.content[0].text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(raw);
}

module.exports = { runXxxAgent };
```

Rules:
- Use `cache_control: { type: "ephemeral" }` on the system prompt whenever it contains KB content
- Always return structured JSON — define the schema in the system prompt
- Strip markdown fences before parsing (Claude Haiku sometimes wraps JSON in fences)
- Expose only what routes need — keep DB access in `storage/`, not in agents
