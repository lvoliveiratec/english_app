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
- Future versions will include real authentication and identity validation.

## Student Pages After Login

### Dashboard

Purpose:

- Give the student the first post-login experience.
- Show progress, daily focus, and the first AI Teacher message.
- Include the initial placement questionnaire.
- Allow recording for pronunciation and class media demos.

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

## Next Product Steps

- Convert the static prototype into React + TypeScript.
- Add real routing for course detail pages.
- Add a real onboarding/placement assessment flow.
- Add lesson player screens for each skill.
- Add teacher/admin roles later.
- Connect dashboard and lessons to backend data.
- Connect AI Teacher responses to RAG and student memory.
