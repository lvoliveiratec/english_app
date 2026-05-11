const pages = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll("[data-route]")];
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector(".nav-links");
const loginForm = document.querySelector("#loginForm");
const courseGrid = document.querySelector("#courseGrid");
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
    title: "English Foundations",
    level: "Beginner",
    duration: "6 weeks",
    color: "#2563eb",
    description:
      "Essential vocabulary, useful phrases, short listening practice, and basic grammar for true beginners.",
  },
  {
    title: "Speaking Confidence",
    level: "Intermediate",
    duration: "8 weeks",
    color: "#16855f",
    description:
      "Guided conversations, pronunciation correction, and practice answering without translating word by word.",
  },
  {
    title: "Real Life English",
    level: "Practical",
    duration: "10 weeks",
    color: "#e25645",
    description:
      "Real situations: work, travel, meetings, small talk, interviews, and classes with AI feedback.",
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
          </div>
        </article>
      `,
    )
    .join("");
}

function refreshStudentCopy() {
  studentGreeting.textContent = `Hi, ${state.userName}.`;
  studentBriefText.textContent = `Good to see you here, ${state.userName}. Yesterday you studied for 28 minutes and completed 3 activities. Today the focus is pronunciation, listening, and confidence in short conversations.`;
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
  localStorage.setItem("fluentpath:user", state.userName);
  refreshStudentCopy();
  window.location.hash = "coach";
});

newPhraseButton.addEventListener("click", choosePhrase);
recordVoiceButton.addEventListener("click", recordVoiceSample);
audioClassButton.addEventListener("click", () => startClassRecording("audio"));
videoClassButton.addEventListener("click", () => startClassRecording("video"));
stopClassButton.addEventListener("click", stopClassRecording);

renderCourses();
refreshStudentCopy();
handleRouteChange();
