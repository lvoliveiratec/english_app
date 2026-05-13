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
  -> Teacher Invite Link
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

Teacher invite links use `?invite=CODE#signup`. When the invite code is valid, signup creates an active teacher/student assignment.

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

## Teacher Assignment Flow

```text
Create Account Without Invite
  -> student profile assignment_status = pending_assignment
  -> Admin Dashboard
  -> assign student to teacher
  -> Teacher Dashboard includes student
```

```text
Create Account With Teacher Invite
  -> validate invite code
  -> create student profile
  -> create active teacher_student_assignments row
  -> Teacher Dashboard includes student
```

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

## Teacher Flow

```text
Teacher Dashboard
  -> view assigned students
  -> view progress summary
  -> view recurring mistakes
  -> share invite link
  -> assign lessons
  -> review authorized class notes/transcripts
```
