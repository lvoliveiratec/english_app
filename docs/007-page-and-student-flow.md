# Page And Student Flow

This document records the first product-level page structure for FluentPath English.

## Public Pages

### Home

Purpose:

- Explain what the site/app is.
- Show the main promise: real English learning with a personal AI Teacher.
- Present outcomes, features, and student reviews.
- Send visitors to courses, AI method, or login.

### Courses

Purpose:

- Show available courses.
- Let visitors click a course and open a dedicated course detail page.
- Explain level, duration, focus, and what is included.

### Course Detail

Purpose:

- Explain how a specific course works.
- Describe the course focus, such as real-life conversation, daily English, work, interviews, pronunciation, or beginner foundations.
- Explain that each student gets personalized guidance from a dedicated AI Teacher.

### AI Coach

Purpose:

- Explain the AI method.
- Separate the AI Coach from the AI Teacher:
  - AI Coach: planning, motivation, progress, daily direction.
  - AI Teacher: instruction, correction, speech feedback, writing feedback, and practice generation.

### Login

Purpose:

- Let the student enter the app.
- Let the student create a local demo account.
- Hide student-only pages until the student is signed in.
- Show `Logout` after sign in.
- Use backend auth endpoints when the app is served through Node.
- Keep local fallback behavior only when opened directly as a static file.
- Future versions will include real authentication and identity validation.

### Create Account

Purpose:

- Capture the first student profile before the first lesson.
- Collect personal details such as name, email, phone, age, native language, and address.
- Collect English-learning signals: current level, main goal, speaking confidence, and study availability.
- Collect interests that help the AI Teacher personalize examples and speaking prompts:
  - Movies and series
  - Music
  - Sports
  - Cooking
  - Travel
  - Games
  - Books
  - Work and business
- Collect free-text context: favorite media, hobbies, foods/drinks, sports, and motivation.
- Save the profile through the backend when available, with local fallback for static previews.
- Support teacher invite links. When a signup link includes a valid invite code, the new student is assigned to that teacher automatically.

Important current rule:

- The password field is not stored in the local profile.
- Students who sign up without a teacher invite start as `pending_assignment` and can be routed by an admin.

## Student Pages After Login

### Dashboard

Purpose:

- Give the student the first post-login experience.
- Show progress, daily focus, and the first AI Teacher message.
- Use saved student profile details to personalize the first AI Teacher summary.
- Include placement baseline confirmation based on the signup profile.
- Allow recording for pronunciation and class media demos.

Progress behavior:

- A new account starts with `Not assessed` for fluency, listening, and pronunciation.
- Confirming the placement baseline creates an initial estimate from the profile level and goal.
- The baseline is not a real measured score.
- Real scores should later come from lessons, speaking attempts, listening checks, writing checks, and teacher/AI feedback.

### Placement Baseline

Purpose:

- Let the student confirm or adjust the starting point already captured during signup.
- Use current level, main goal, and optional extra writing context to create an initial baseline.
- Future versions should also include speaking, vocabulary, listening, and reading checks.

### Pronunciation Practice

Purpose:

- Show a read-out-loud phrase with meaning, form, and pronunciation focus.
- Record a short local audio attempt.
- Create a backend pronunciation attempt record with student ID, phrase, timestamp, size estimate, and processing status.
- Keep raw audio in the browser until authorized upload storage, consent, retention, and transcription are implemented.

### Lessons

Purpose:

- Organize student practice by skill:
  - Vocabulary
  - Speaking
  - Reading
  - Writing
  - Listening
  - Pronunciation
- Let the AI Teacher recommend lessons based on student progress and recurring mistakes.

### Account

Purpose:

- Let signed-in users update name, email, phone, and address.
- Let signed-in users change their password through the backend.
- Keep contact and address maintenance separate from the initial learning questionnaire.
- Store address data in the backend `addresses` table when PostgreSQL is configured.

## Administrative Pages

### Admin Dashboard

Purpose:

- Give administrators a first operational view of the school/app.
- Show total students, teachers, administrators, active students, pending payments, and monthly revenue.
- Show student progress, current level, goal, difficulty, and recommendation.
- Show recent operational activity.
- Register and update students.
- Register and update teachers.
- Assign or reassign students to teachers.
- Create and update plans/prices.
- Create and update courses.
- Prepare space for future payment management, consent review, retention policy, and deletion workflows.

Current access:

- The client only shows Admin navigation for users with role `admin`.
- Admin APIs require an authenticated admin session.
- In-memory development storage includes `admin@example.com` / `admin123`.
- Production still needs fuller admin permission scopes and audit logging.

## Teacher Pages

### Teacher Dashboard

Purpose:

- Give teachers a first operational view of their assigned students.
- Show assigned student count, students needing attention, pending summaries, and active students.
- Show student level, goal, current progress, difficulty, and recommended next action.
- Show suggested teaching actions from the future Teacher Summary Agent surface.
- Provide a teacher invite link. Students who sign up through that link are automatically assigned to that teacher.

Current access:

- The client only shows Teacher navigation for users with role `teacher`.
- Teacher APIs require an authenticated teacher session.
- Teacher student visibility is based on active rows in `teacher_student_assignments`.

## Assignment Flow

### Normal Signup

```text
Student opens Create Account
  -> creates account
  -> student_profiles.assignment_status = pending_assignment
  -> Admin dashboard can assign the student to a teacher
```

### Teacher Invite Signup

```text
Teacher shares invite link
  -> student opens ?invite=CODE#signup
  -> backend validates teacher_invites.code
  -> student account is created
  -> teacher_student_assignments row is created
  -> student_profiles.assignment_status = assigned
```

### Admin Manual Assignment

```text
Admin Dashboard
  -> Teacher assignment panel
  -> choose student
  -> choose teacher
  -> add notes
  -> save active assignment
```

When an admin reassigns a student, previous active assignments for that student are marked inactive and the new teacher becomes the active teacher.

## Next Product Steps

- Store placement/baseline data server-side.
- Add a real onboarding/placement assessment flow connected to the student profile.
- Add lesson player screens for each skill.
- Connect dashboard and lessons to backend data.
- Connect AI Teacher responses to RAG and student memory.
- Add payment, consent, retention, and deletion workflows to Admin.
