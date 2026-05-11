# Student Flow

## Visitor Flow

```text
Home
  -> Courses
    -> Course Detail
      -> Login
  -> AI Coach Method
    -> Login
  -> Login
```

## Login Flow

```text
Login
  -> validate identity
  -> load student profile
  -> load learning context
  -> Student Dashboard
```

The current prototype uses demonstration login only. It stores the student name and signed-in state in `localStorage`.

## First Student Session

```text
Student Dashboard
  -> AI Teacher greeting
  -> first assessment questionnaire
  -> speaking or writing sample
  -> recommended lesson
  -> lessons page
```

## Initial Assessment Goals

The first assessment should help determine:

- Current English level.
- Learning goal.
- Speaking confidence.
- Writing ability.
- Vocabulary range.
- Pronunciation patterns.
- Preferred practice type.
- Study schedule.

## Lesson Flow

```text
Lessons
  -> select skill
  -> complete activity
  -> AI Teacher feedback
  -> save learning signals
  -> recommend next activity
```

Skills:

- Vocabulary.
- Speaking.
- Reading.
- Writing.
- Listening.
- Pronunciation.

## Future Teacher Flow

```text
Teacher Dashboard
  -> select student
  -> view progress summary
  -> view recurring mistakes
  -> assign lessons
  -> review authorized class notes/transcripts
```
