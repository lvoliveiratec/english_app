# Diagrams

These diagrams use Mermaid syntax.

## High-Level System

```mermaid
flowchart LR
  Visitor[Visitor] --> Web[Web App]
  Student[Student] --> Web
  Teacher[Teacher] --> Web
  Admin[Admin] --> Web

  Web --> API[Backend API]
  API --> DB[(Postgres)]
  API --> Memory[In-Memory Fallback]
  API -. future .-> Storage[(Object Storage)]
  API -. future .-> RAG[RAG Retrieval Layer]
  API -. future .-> AI[AI Orchestration]

  DB --> Users[Users And Profiles]
  DB --> Assignments[Teacher Assignments And Invites]
  DB --> AdminData[Admin Data]
  DB --> Attempts[Pronunciation Attempts]
  DB --> Progress[Lesson Progress]

  Storage -. future .-> Workers[Media Workers]
  Workers -. future .-> Transcripts[Transcripts And Metrics]
  Transcripts -. future .-> DB
  Transcripts -. future .-> RAG

  RAG -. future .-> EnglishKB[English KB]
  RAG -. future .-> CurriculumKB[Curriculum KB]
  RAG -. future .-> StudentMemory[Student Memory]
  RAG -. future .-> TeacherMaterials[Teacher Materials]

  AI -. future .-> Coach[AI Coach]
  AI -. future .-> TeacherAgent[AI Teacher Agent]
```

## Public To Student Flow

```mermaid
flowchart TD
  Home[Home Page] --> Courses[Courses Page]
  Home --> Method[AI Coach Method Page]
  Courses --> CourseDetail[Course Detail Page]
  CourseDetail --> Login[Login Page]
  Method --> Login
  Home --> Login
  Login --> Signup[Create Account]
  TeacherInvite[Teacher Invite Link] --> Signup
  Signup --> Dashboard[Student Dashboard]
  Signup --> Assignment{Invite?}
  Assignment -->|yes| TeacherAssignment[Create Teacher Assignment]
  Assignment -->|no| PendingAssignment[Pending Admin Assignment]
  Login --> Dashboard
  Dashboard --> Baseline[Placement Baseline]
  Dashboard --> Pronunciation[Read Out Loud Practice]
  Dashboard --> Lessons[Lessons Page]
  Dashboard --> Account[Account Settings]
  Pronunciation --> Attempt[Pronunciation Attempt Record]
  Lessons --> Feedback[AI Teacher Feedback]
  Feedback --> Memory[Student Learning Signals]
  Memory --> Dashboard
```

## Backend API Structure

```mermaid
flowchart TD
  Server[server.js] --> Router[src/server/routes/index.js]
  Router --> Auth[auth routes]
  Router --> Account[account routes]
  Router --> Admin[admin routes]
  Router --> Teacher[teacher routes]
  Router --> Pronunciation[pronunciation routes]
  Router --> Static[static file serving]

  Auth --> Storage[src/storage]
  Account --> Storage
  Admin --> Storage
  Teacher --> Storage
  Pronunciation --> Storage

  Storage --> Pg[PostgreSQL adapter]
  Storage --> Mem[Memory adapter]
  Pg --> Schema[db/schema.sql]
  Schema --> Users[users and profiles]
  Schema --> Addresses[addresses]
  Schema --> Plans[plans and payments]
  Schema --> Attempts[pronunciation_attempts]
  Schema --> Assignments[teacher_student_assignments]
  Schema --> Invites[teacher_invites]
```

## Admin Flow

```mermaid
flowchart TD
  AdminLogin[Admin Login] --> AdminDashboard[Admin Dashboard]
  AdminDashboard --> Summary[Operational Summary]
  AdminDashboard --> Students[Create Or Edit Students]
  AdminDashboard --> Teachers[Create Or Edit Teachers]
  AdminDashboard --> Assign[Assign Or Reassign Students]
  AdminDashboard --> Plans[Create Or Edit Plans]
  AdminDashboard --> Courses[Create Or Edit Courses]

  Summary --> DB[(Postgres Or Memory)]
  Students --> DB
  Teachers --> DB
  Assign --> DB
  Plans --> DB
  Courses --> DB
```

## Teacher Flow

```mermaid
flowchart TD
  TeacherLogin[Teacher Login] --> TeacherDashboard[Teacher Dashboard]
  TeacherDashboard --> Summary[Assigned Student Summary]
  TeacherDashboard --> Invite[Teacher Invite Link]
  TeacherDashboard --> Actions[Suggested Teacher Actions]

  Invite --> Signup[Student Signup With Invite Code]
  Signup --> Assignment[Active Teacher Student Assignment]
  Assignment --> DB[(Postgres Or Memory)]
  Summary --> DB
```

## AI Teacher Context Flow

```mermaid
flowchart LR
  StudentAction[Student Action] --> API[Backend API]
  API --> Profile[Student Profile]
  API --> Progress[Progress Data]
  API --> Analysis[Speech/Writing Analysis]
  API --> RAG[RAG Retrieval Layer]

  RAG --> EnglishKB[English KB]
  RAG --> Curriculum[Curriculum]
  RAG --> StudentMemory[Student Memory]
  RAG --> TeacherNotes[Teacher Notes]

  Profile --> Context[Authorized Context Packet]
  Progress --> Context
  Analysis --> Context
  RAG --> Context

  Context --> AITeacher[AI Teacher Agent]
  AITeacher --> Response[Student Feedback]
  AITeacher --> Signals[Learning Signals]
  Signals --> DB[(Postgres)]
  Response --> Student[Student]
```

## Media Processing Flow

```mermaid
flowchart TD
  Practice[Read Out Loud Recording] --> LocalAudio[Raw Audio In Browser]
  LocalAudio --> Attempt[Pronunciation Attempt Metadata]
  Attempt --> DB[(Postgres)]
  Attempt --> Status[recorded_locally]

  Consent[Future Consent Captured] --> Upload[Future Signed Upload]
  Upload --> RawMedia[(Object Storage)]
  RawMedia --> Job[Processing Job]
  Job --> Normalize[Normalize Audio/Video]
  Normalize --> Transcribe[Transcription]
  Normalize --> Pronunciation[Pronunciation Metrics]
  Normalize --> Derivatives[Thumbnails/Waveforms/Compressed Media]
  Transcribe --> Metadata[(Database Metadata)]
  Pronunciation --> Metadata
  Derivatives --> ProcessedStorage[(Processed Media Storage)]
  Metadata --> RAGIndex[RAG Index When Allowed]
```

## Repository Structure

```mermaid
flowchart TD
  Repo[english_app] --> Architecture[architecture]
  Repo --> Docs[docs]
  Repo --> KB[kb]
  Repo --> Agents[agents]
  Repo --> Frontend[Current Frontend]
  Repo --> Backend[Node Backend]
  Repo --> Database[Database]
  Repo --> Docker[Docker]

  Frontend --> HTML[index.html]
  Frontend --> CSS[styles.css]
  Frontend --> JS[app.js]
  Backend --> Server[server.js]
  Backend --> ServerModules[src/server]
  Backend --> StorageAdapters[src/storage]
  Database --> Schema[db/schema.sql]
  Database --> Seed[scripts/seed.js]
  Docker --> Compose[docker-compose.yml]
  Docker --> Dockerfile[Dockerfile]

  KB --> EnglishKB[english]
  Docs --> Process[process log]
  Docs --> Roadmap[roadmap]
  Docs --> AgentDocs[agent roles]
  Architecture --> Diagrams[diagrams]
```
