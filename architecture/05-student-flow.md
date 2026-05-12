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
    -> Create Account
```

## Login Flow

```text
Login
  -> validate identity
  -> load student profile
  -> load learning context
  -> Student Dashboard
```

The current prototype uses backend auth when served through Node and keeps a local fallback for static previews. The signup flow also collects phone and address information for the student profile.

## First Student Session

```text
Student Dashboard
  -> AI Teacher greeting
  -> placement baseline confirmation
  -> read-out-loud pronunciation practice
  -> recommended lesson
  -> lessons page
  -> account settings
```

## Account Maintenance

```text
Account
  -> update name, email, phone, and address
  -> update password
  -> persist through authenticated backend routes
```

## Placement Baseline Goals

The signup profile captures the first student context. The dashboard baseline step should confirm or adjust:

- Current English level.
- Learning goal.
- Optional extra writing context.
- First estimated baseline for fluency, listening, and pronunciation.

Future deeper assessment should also measure:

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
