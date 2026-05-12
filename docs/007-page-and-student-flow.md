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
- Keep local fallback behavior when opened as a static file.
- Future versions will include real authentication and identity validation.

### Create Account

Purpose:

- Capture the first student profile before the first lesson.
- Collect personal details such as name, email, age, and native language.
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
- Save the demo profile locally until a real backend/database exists.

Important current rule:

- The password field is not stored in the local profile.

## Student Pages After Login

### Dashboard

Purpose:

- Give the student the first post-login experience.
- Show progress, daily focus, and the first AI Teacher message.
- Use saved student profile details to personalize the first AI Teacher summary.
- Include the initial placement questionnaire.
- Allow recording for pronunciation and class media demos.

Progress behavior:

- A new account starts with `Not assessed` for fluency, listening, and pronunciation.
- Completing the placement creates an initial baseline estimate from the declared level and goal.
- The baseline is not a real measured score.
- Real scores should later come from lessons, speaking attempts, listening checks, writing checks, and teacher/AI feedback.

### Initial Assessment

Purpose:

- Help the AI Teacher understand the student's starting point.
- Capture current level, main goal, and a writing sample.
- Future versions should also include speaking, vocabulary, listening, and reading checks.

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

## Administrative Pages

### Admin Dashboard

Purpose:

- Give administrators a first operational view of the school/app.
- Show total students, teachers, administrators, active students, pending payments, and monthly revenue.
- Show student progress, current level, goal, difficulty, and recommendation.
- Show recent operational activity.
- Register and update students.
- Register and update teachers.
- Create and update plans/prices.
- Create and update courses.
- Prepare space for future payment management, consent review, retention policy, and deletion workflows.

Current access:

- The client only shows Admin navigation for users with role `admin`.
- Admin APIs require an authenticated admin session.
- In-memory development storage includes `admin@example.com` / `admin123`.
- Production still needs fuller admin permission scopes and audit logging.

## Next Product Steps

- Create the backend foundation for real users, roles, sessions, and profiles.
- Add database storage for the student profile currently held in `localStorage`.
- Add backend-backed login, logout, and signup.
- Add a real onboarding/placement assessment flow connected to the student profile.
- Add lesson player screens for each skill.
- Expand teacher/admin roles after the user/profile foundation is stable.
- Connect dashboard and lessons to backend data.
- Connect AI Teacher responses to RAG and student memory.
