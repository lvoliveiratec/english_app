# English Knowledge Base

This folder contains the first version of the English knowledge base for the FluentPath English AI Teacher Agent.

The KB is written as human-readable source material first. Later, these files can be chunked, embedded, permissioned, and retrieved through RAG.

## Files

### Teaching and Learning
- `cefr-level-guide.md`: level expectations from A1 to C2.
- `grammar-syllabus.md`: grammar topics by level.
- `pronunciation-guide.md`: sounds, stress, rhythm, and pronunciation feedback.
- `vocabulary-themes.md`: vocabulary domains and practice targets.
- `writing-spelling-guide.md`: spelling, punctuation, writing, and correction patterns.
- `speaking-assessment-rubric.md`: speaking evaluation criteria.
- `correction-policy.md`: how the AI Teacher Agent should correct students.
- `lesson-patterns.md`: reusable lesson and practice formats.

### Placement Assessment
- `assessment-grammar.md`: gap-fill grammar questions and scoring guide by CEFR level (A1–B2).
- `assessment-vocabulary.md`: vocabulary ranges, question formats, and word lists by level.
- `assessment-reading.md`: sample texts and comprehension questions for A1–B2 reading placement.
- `assessment-listening.md`: transcript cloze, dictogloss, and dialogue comprehension methods for text-based listening assessment.

## RAG Rules

- Global English knowledge can be shared across students.
- Student memories must be stored separately from this global KB.
- Student-specific transcripts, mistakes, and pronunciation history must never be mixed into the global KB.
- Retrieval should include source file, section title, level, skill, and target objective.
- The AI Teacher Agent should cite internal source IDs in logs, but not expose technical IDs to students.
