# Pronunciation Agent

## Purpose

The Pronunciation Agent analyzes speaking attempts and produces pronunciation feedback.

## Responsibilities

- Compare transcript/audio-derived metrics against the target phrase.
- Identify likely difficult sounds, stress, rhythm, and word endings.
- Give focused drills.
- Track recurring pronunciation issues.

## Inputs

- Target phrase.
- Pronunciation attempt ID.
- Processing status.
- Student transcript.
- Audio-derived metrics when available.
- Student level.
- Prior pronunciation issues.

## Outputs

- Pronunciation feedback.
- Drill recommendation.
- Recurring issue tags.
- Compact summary for student memory.
- Processing update for the pronunciation attempt.

## Boundaries

- Do not process real audio without consent and retention rules.
- Do not generate precise scores without measured data.
- Prefer derived artifacts over raw media in long-term memory.
- Do not place raw audio directly into RAG; use transcript, metrics, summaries, and issue tags.
