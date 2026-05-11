const pages = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll("[data-route]")];
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector(".nav-links");
const loginForm = document.querySelector("#loginForm");
const courseGrid = document.querySelector("#courseGrid");
const lessonGrid = document.querySelector("#lessonGrid");
const studentNavLinks = [...document.querySelectorAll("[data-student-nav]")];
const placementForm = document.querySelector("#placementForm");
const assessmentFeedback = document.querySelector("#assessmentFeedback");
const courseDetailLevel = document.querySelector("#courseDetailLevel");
const courseDetailTitle = document.querySelector("#courseDetailTitle");
const courseDetailDescription = document.querySelector("#courseDetailDescription");
const courseDetailDuration = document.querySelector("#courseDetailDuration");
const courseDetailIncludes = document.querySelector("#courseDetailIncludes");
const studentGreeting = document.querySelector("#studentGreeting");
const studentBriefText = document.querySelector("#studentBriefText");
const practicePhrase = document.querySelector("#practicePhrase");
const newPhraseButton = document.querySelector("#newPhraseButton");
const recordVoiceButton = document.querySelector("#recordVoiceButton");
const voiceFeedback = document.querySelector("#voiceFeedback");
const consentCheck = document.querySelector("#consentCheck");
const audioClassButton = document.querySelector("#audioClassButton");
const videoClassButton = document.querySelector("#videoClassButton");
const stopClassButton = document.querySelector("#stopClassButton");
const classPreview = document.querySelector("#classPreview");
const classFeedback = document.querySelector("#classFeedback");

const courses = [
  {
    slug: "english-conversation",
    title: "English Foundations",
    level: "Beginner",
    duration: "6 weeks",
    color: "#2563eb",
    description:
      "Essential vocabulary, useful phrases, short listening practice, and basic grammar for true beginners.",
    longDescription:
      "A guided English course for students who want a clear start. It builds everyday vocabulary, simple sentence patterns, listening habits, and confidence speaking from day one.",
    includes: [
      "Daily conversation phrases",
      "Basic grammar and sentence building",
      "Vocabulary for routine, family, work, and travel",
      "Short listening and speaking drills",
      "AI Teacher feedback after each practice",
    ],
  },
  {
    slug: "speaking-confidence",
    title: "Speaking Confidence",
    level: "Intermediate",
    duration: "8 weeks",
    color: "#16855f",
    description:
      "Guided conversations, pronunciation correction, and practice answering without translating word by word.",
    longDescription:
      "A conversation-first course for students who understand some English but need speed, clarity, and confidence in real interactions.",
    includes: [
      "Roleplays for work, meetings, travel, and small talk",
      "Pronunciation targets based on recurring mistakes",
      "Speaking prompts with follow-up questions",
      "Vocabulary review from real conversations",
      "Fluency feedback from the AI Teacher",
    ],
  },
  {
    slug: "real-life-english",
    title: "Real Life English",
    level: "Practical",
    duration: "10 weeks",
    color: "#e25645",
    description:
      "Real situations: work, travel, meetings, small talk, interviews, and classes with AI feedback.",
    longDescription:
      "A practical English course focused on real daily use. Each student gets individual guidance from a dedicated AI Teacher that learns their speaking, writing, vocabulary, and study patterns.",
    includes: [
      "Real-world lessons for everyday communication",
      "Speaking, reading, writing, listening, and vocabulary practice",
      "Dedicated AI Teacher guidance for each student",
      "Personalized review based on mistakes and progress",
      "Optional class recording analysis with consent",
    ],
  },
];

const lessons = [
  {
    skill: "Vocabulary",
    title: "Words for daily routines",
    time: "12 min",
    description: "Review useful verbs, build short sentences, and save words for spaced review.",
  },
  {
    skill: "Speaking",
    title: "Answer without translating",
    time: "15 min",
    description: "Practice short answers with follow-up questions from the AI Teacher.",
  },
  {
    skill: "Reading",
    title: "A short workplace message",
    time: "10 min",
    description: "Read a realistic message and answer comprehension questions.",
  },
  {
    skill: "Writing",
    title: "Introduce your work",
    time: "14 min",
    description: "Write a short paragraph and receive spelling, grammar, and clarity feedback.",
  },
  {
    skill: "Listening",
    title: "Slow conversation practice",
    time: "11 min",
    description: "Listen for key words, repeat phrases, and check understanding.",
  },
  {
    skill: "Pronunciation",
    title: "Thought, world, comfortable",
    time: "8 min",
    description: "Train difficult sounds, word stress, and sentence rhythm.",
  },
];

const phrases = [
  "I thought the world was comfortable enough for a short conversation.",
  "Could you repeat the question before I answer?",
  "I usually practice pronunciation after my English lesson.",
  "The teacher noticed that my confidence is improving.",
  "I want to speak clearly during real conversations.",
];

const state = {
  userName: localStorage.getItem("fluentpath:user") || "Lucas",
  isSignedIn: localStorage.getItem("fluentpath:signedIn") === "true",
  mediaRecorder: null,
  mediaStream: null,
  chunks: [],
};

function setRoute(routeName) {
  const safeRoute = pages.some((page) => page.id === routeName) ? routeName : "home";

  pages.forEach((page) => {
    page.classList.toggle("active", page.id === safeRoute);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === safeRoute);
  });

  nav.classList.remove("open");
  document.title = `FluentPath English | ${safeRoute}`;

  if (safeRoute === "course") {
    renderCourseDetail();
  }
}

function handleRouteChange() {
  setRoute(window.location.hash.replace("#", "") || "home");
}

function renderCourses() {
  courseGrid.innerHTML = courses
    .map(
      (course) => `
        <article class="course-card">
          <div class="course-art" style="--course-color: ${course.color}"></div>
          <div class="course-content">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
              <span class="pill">${course.level}</span>
              <span class="pill">${course.duration}</span>
            </div>
            <a class="course-link" href="#course" data-course-slug="${course.slug}">View course</a>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderLessons() {
  lessonGrid.innerHTML = lessons
    .map(
      (lesson) => `
        <article class="lesson-card">
          <span class="pill">${lesson.skill}</span>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
          <div class="lesson-footer">
            <strong>${lesson.time}</strong>
            <button class="secondary-action" type="button">Start</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCourseDetail() {
  const selectedSlug = sessionStorage.getItem("fluentpath:selectedCourse") || courses[0].slug;
  const course = courses.find((item) => item.slug === selectedSlug) || courses[0];

  courseDetailLevel.textContent = `${course.level} course`;
  courseDetailTitle.textContent = course.title;
  courseDetailDescription.textContent = course.longDescription;
  courseDetailDuration.textContent = course.duration;
  courseDetailIncludes.innerHTML = course.includes.map((item) => `<li>${item}</li>`).join("");
}

function refreshStudentCopy() {
  studentGreeting.textContent = `Hi, ${state.userName}.`;
  studentBriefText.textContent = `Good to see you here, ${state.userName}. Yesterday you studied for 28 minutes and completed 3 activities. Today the focus is pronunciation, listening, and confidence in short conversations.`;
  studentNavLinks.forEach((link) => {
    link.hidden = !state.isSignedIn;
  });
}

function choosePhrase() {
  const currentPhrase = practicePhrase.textContent.trim();
  const available = phrases.filter((phrase) => phrase !== currentPhrase);
  const next = available[Math.floor(Math.random() * available.length)];
  practicePhrase.textContent = next;
  voiceFeedback.textContent = "New phrase ready. Record your attempt whenever you want.";
}

async function recordVoiceSample() {
  if (!navigator.mediaDevices?.getUserMedia) {
    voiceFeedback.textContent = "Your browser did not allow audio recording for this prototype.";
    return;
  }

  try {
    recordVoiceButton.disabled = true;
    recordVoiceButton.textContent = "Recording...";
    voiceFeedback.textContent = "Recording for 5 seconds. Say the phrase calmly.";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.start();
    window.setTimeout(() => recorder.stop(), 5000);

    recorder.addEventListener("stop", () => {
      stream.getTracks().forEach((track) => track.stop());
      recordVoiceButton.disabled = false;
      recordVoiceButton.textContent = "Record voice";
      voiceFeedback.textContent =
        "Demo feedback: strong speaking energy. Next drill: stretch the sound in 'world' and finish the ending of 'thought' more clearly.";
    });
  } catch (error) {
    recordVoiceButton.disabled = false;
    recordVoiceButton.textContent = "Record voice";
    voiceFeedback.textContent = "I could not access the microphone. Check your browser permissions.";
  }
}

async function startClassRecording(kind) {
  if (!consentCheck.checked) {
    classFeedback.textContent = "Check the consent box before starting the class recording.";
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    classFeedback.textContent = "Your browser did not allow media recording for this prototype.";
    return;
  }

  try {
    const constraints =
      kind === "video" ? { audio: true, video: true } : { audio: true, video: false };

    state.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    state.mediaRecorder = new MediaRecorder(state.mediaStream);
    state.chunks = [];

    state.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        state.chunks.push(event.data);
      }
    });

    state.mediaRecorder.addEventListener("stop", () => {
      const type = kind === "video" ? "video/webm" : "audio/webm";
      const blob = new Blob(state.chunks, { type });
      const minutes = Math.max(1, Math.round(blob.size / 85000));

      classFeedback.textContent = `Recording finished. Local demo ready for analysis: about ${minutes} min of captured material.`;
      classPreview.classList.remove("active");
      classPreview.srcObject = null;
      state.mediaStream.getTracks().forEach((track) => track.stop());
      state.mediaStream = null;
      state.mediaRecorder = null;
      stopClassButton.disabled = true;
      audioClassButton.disabled = false;
      videoClassButton.disabled = false;
    });

    if (kind === "video") {
      classPreview.srcObject = state.mediaStream;
      classPreview.classList.add("active");
      await classPreview.play();
    }

    state.mediaRecorder.start();
    stopClassButton.disabled = false;
    audioClassButton.disabled = true;
    videoClassButton.disabled = true;
    classFeedback.textContent =
      kind === "video"
        ? "Recording class video. Stop when finished."
        : "Recording class audio. Stop when finished.";
  } catch (error) {
    classFeedback.textContent =
      "I could not start the recording. Check camera, microphone, and browser permissions.";
  }
}

function stopClassRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
}

menuButton.addEventListener("click", () => nav.classList.toggle("open"));
window.addEventListener("hashchange", handleRouteChange);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  state.userName = formData.get("name")?.toString().trim() || "Student";
  state.isSignedIn = true;
  localStorage.setItem("fluentpath:user", state.userName);
  localStorage.setItem("fluentpath:signedIn", "true");
  refreshStudentCopy();
  window.location.hash = "dashboard";
});

courseGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-course-slug]");

  if (!link) {
    return;
  }

  event.preventDefault();
  sessionStorage.setItem("fluentpath:selectedCourse", link.dataset.courseSlug);
  window.location.hash = "course";
});

placementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(placementForm);
  const level = formData.get("level");
  const goal = formData.get("goal");

  localStorage.setItem(
    "fluentpath:placement",
    JSON.stringify({
      level,
      goal,
      writing: formData.get("writing")?.toString().trim() || "",
      completedAt: new Date().toISOString(),
    }),
  );

  assessmentFeedback.textContent = `Saved. Your AI Teacher will start with ${level} material focused on ${goal.toString().toLowerCase()}.`;
});

newPhraseButton.addEventListener("click", choosePhrase);
recordVoiceButton.addEventListener("click", recordVoiceSample);
audioClassButton.addEventListener("click", () => startClassRecording("audio"));
videoClassButton.addEventListener("click", () => startClassRecording("video"));
stopClassButton.addEventListener("click", stopClassRecording);

renderCourses();
renderLessons();
refreshStudentCopy();
handleRouteChange();
