const pages = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll("[data-route]")];
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector(".nav-links");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const signupFeedback = document.querySelector("#signupFeedback");
const loginFeedback = document.querySelector("#loginFeedback");
const loginNavLink = document.querySelector("#loginNavLink");
const logoutButton = document.querySelector("#logoutButton");
const adminNavLink = document.querySelector("#adminNavLink");
const accountNavLink = document.querySelector("#accountNavLink");
const courseGrid = document.querySelector("#courseGrid");
const lessonGrid = document.querySelector("#lessonGrid");
const studentNavLinks = [...document.querySelectorAll("[data-student-nav]")];
const homeCoachGreeting = document.querySelector("#homeCoachGreeting");
const homeCoachSummary = document.querySelector("#homeCoachSummary");
const placementForm = document.querySelector("#placementForm");
const assessmentFeedback = document.querySelector("#assessmentFeedback");
const courseDetailLevel = document.querySelector("#courseDetailLevel");
const courseDetailTitle = document.querySelector("#courseDetailTitle");
const courseDetailDescription = document.querySelector("#courseDetailDescription");
const courseDetailDuration = document.querySelector("#courseDetailDuration");
const courseDetailIncludes = document.querySelector("#courseDetailIncludes");
const studentGreeting = document.querySelector("#studentGreeting");
const studentBriefText = document.querySelector("#studentBriefText");
const fluencyValue = document.querySelector("#fluencyValue");
const fluencyMeter = document.querySelector("#fluencyMeter");
const listeningValue = document.querySelector("#listeningValue");
const listeningMeter = document.querySelector("#listeningMeter");
const pronunciationValue = document.querySelector("#pronunciationValue");
const pronunciationMeter = document.querySelector("#pronunciationMeter");
const progressNote = document.querySelector("#progressNote");
const practicePhrase = document.querySelector("#practicePhrase");
const phraseMeaning = document.querySelector("#phraseMeaning");
const phraseForm = document.querySelector("#phraseForm");
const phraseTip = document.querySelector("#phraseTip");
const newPhraseButton = document.querySelector("#newPhraseButton");
const recordVoiceButton = document.querySelector("#recordVoiceButton");
const voiceFeedback = document.querySelector("#voiceFeedback");
const consentCheck = document.querySelector("#consentCheck");
const audioClassButton = document.querySelector("#audioClassButton");
const videoClassButton = document.querySelector("#videoClassButton");
const stopClassButton = document.querySelector("#stopClassButton");
const classPreview = document.querySelector("#classPreview");
const classFeedback = document.querySelector("#classFeedback");
const refreshAdminButton = document.querySelector("#refreshAdminButton");
const adminStudentsCount = document.querySelector("#adminStudentsCount");
const adminTeachersCount = document.querySelector("#adminTeachersCount");
const adminAdminsCount = document.querySelector("#adminAdminsCount");
const adminRevenue = document.querySelector("#adminRevenue");
const adminStorageBadge = document.querySelector("#adminStorageBadge");
const adminPersistenceNote = document.querySelector("#adminPersistenceNote");
const adminProgressRows = document.querySelector("#adminProgressRows");
const adminPendingPayments = document.querySelector("#adminPendingPayments");
const adminActiveStudents = document.querySelector("#adminActiveStudents");
const adminActivityList = document.querySelector("#adminActivityList");
const adminStudentForm = document.querySelector("#adminStudentForm");
const adminTeacherForm = document.querySelector("#adminTeacherForm");
const adminPlanForm = document.querySelector("#adminPlanForm");
const adminCourseForm = document.querySelector("#adminCourseForm");
const adminStudentRows = document.querySelector("#adminStudentRows");
const adminTeacherRows = document.querySelector("#adminTeacherRows");
const adminPlanRows = document.querySelector("#adminPlanRows");
const adminCourseRows = document.querySelector("#adminCourseRows");
const adminStudentFeedback = document.querySelector("#adminStudentFeedback");
const adminTeacherFeedback = document.querySelector("#adminTeacherFeedback");
const adminPlanFeedback = document.querySelector("#adminPlanFeedback");
const adminCourseFeedback = document.querySelector("#adminCourseFeedback");
const accountForm = document.querySelector("#accountForm");
const passwordForm = document.querySelector("#passwordForm");
const accountFeedback = document.querySelector("#accountFeedback");
const passwordFeedback = document.querySelector("#passwordFeedback");

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
  {
    text: "I thought the world was comfortable enough for a short conversation.",
    meaning: "A natural sentence for saying something felt easy or acceptable in the past.",
    form: "Past verb + adjective phrase + enough for + noun phrase.",
    tip: "Contrast thought, world, and comfortable. Finish the final consonants clearly.",
  },
  {
    text: "Could you repeat the question before I answer?",
    meaning: "A polite request to hear something again before responding.",
    form: "Could you + base verb + object + before + subject + verb.",
    tip: "Keep could you linked together and make question rise slightly at the end.",
  },
  {
    text: "I usually practice pronunciation after my English lesson.",
    meaning: "A routine sentence about study habits after class.",
    form: "Subject + frequency adverb + base verb + object + time phrase.",
    tip: "Stress usually, practice, pronunciation, and lesson. Keep after short.",
  },
  {
    text: "The teacher noticed that my confidence is improving.",
    meaning: "A way to say someone observed progress over time.",
    form: "Subject + past verb + that-clause with present continuous.",
    tip: "Make noticed two syllables and keep confidence clear: CON-fi-dence.",
  },
  {
    text: "I want to speak clearly during real conversations.",
    meaning: "A direct sentence for expressing a speaking goal.",
    form: "Subject + want to + base verb + adverb + during + noun phrase.",
    tip: "Link want to naturally, then stress speak clearly and real conversations.",
  },
];

function readStoredStudentProfile() {
  try {
    return JSON.parse(localStorage.getItem("fluentpath:studentProfile")) || null;
  } catch (error) {
    return null;
  }
}

function readStoredPlacement() {
  try {
    return JSON.parse(localStorage.getItem("fluentpath:placement")) || null;
  } catch (error) {
    return null;
  }
}

function readStoredAddress() {
  try {
    return JSON.parse(localStorage.getItem("fluentpath:address")) || null;
  } catch (error) {
    return null;
  }
}

const state = {
  studentProfile: readStoredStudentProfile(),
  placement: readStoredPlacement(),
  userName: localStorage.getItem("fluentpath:user") || "Student",
  userEmail: localStorage.getItem("fluentpath:email") || "",
  userPhone: localStorage.getItem("fluentpath:phone") || "",
  address: readStoredAddress(),
  userRole:
    localStorage.getItem("fluentpath:role") ||
    (localStorage.getItem("fluentpath:signedIn") === "true" ? "student" : ""),
  isSignedIn: localStorage.getItem("fluentpath:signedIn") === "true",
  mediaRecorder: null,
  mediaStream: null,
  chunks: [],
};

const adminState = {
  students: [],
  teachers: [],
  plans: [],
  courses: [],
};

const protectedRoutes = ["dashboard", "lessons", "admin", "account"];

function isAdmin() {
  return state.isSignedIn && state.userRole === "admin";
}

function getSafeRoute(routeName) {
  const routeExists = pages.some((page) => page.id === routeName);
  const requestedRoute = routeExists ? routeName : "home";

  if (protectedRoutes.includes(requestedRoute) && !state.isSignedIn) {
    return "login";
  }

  if (requestedRoute === "admin" && !isAdmin()) {
    return "dashboard";
  }

  return requestedRoute;
}

function setRoute(routeName) {
  const safeRoute = getSafeRoute(routeName);

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

  if (safeRoute === "admin") {
    renderAdminSummary();
  }

  if (safeRoute === "account") {
    fillAccountForm();
  }

  if (safeRoute === "dashboard") {
    prefillPlacementForm();
  }
}

function navigateTo(routeName) {
  if (window.location.hash === `#${routeName}`) {
    setRoute(routeName);
    return;
  }

  window.location.hash = routeName;
}

function handleRouteChange() {
  const requestedRoute = window.location.hash.replace("#", "") || "home";
  const safeRoute = getSafeRoute(requestedRoute);

  if (safeRoute !== requestedRoute) {
    navigateTo(safeRoute);
    return;
  }

  setRoute(safeRoute);
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

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const contentType = response.headers.get("Content-Type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

function applySessionPayload(payload) {
  const user = payload.user || {};
  const profile = payload.profile
    ? {
        ...payload.profile,
        email: user.email || payload.profile.email || "",
        phone: user.phone || payload.profile.phone || "",
      }
    : null;

  const address = payload.address || profile?.address || null;

  if (profile) {
    profile.address = address;
  }

  state.userName = user.displayName || profile?.fullName?.split(" ")[0] || "Student";
  state.userEmail = user.email || profile?.email || "";
  state.userPhone = user.phone || profile?.phone || "";
  state.userRole = user.role || "student";
  state.studentProfile = state.userRole === "student" ? profile : null;
  state.address = address;
  state.placement = readStoredPlacement();
  state.isSignedIn = true;

  localStorage.setItem("fluentpath:user", state.userName);
  localStorage.setItem("fluentpath:email", state.userEmail);
  localStorage.setItem("fluentpath:phone", state.userPhone);
  localStorage.setItem("fluentpath:role", state.userRole);
  localStorage.setItem("fluentpath:signedIn", "true");

  if (profile) {
    localStorage.setItem("fluentpath:studentProfile", JSON.stringify(profile));
  }

  if (state.address) {
    localStorage.setItem("fluentpath:address", JSON.stringify(state.address));
  }
}

function getBaselineMetrics(level, goal) {
  const baselines = {
    Beginner: { fluency: 12, listening: 18, pronunciation: 10 },
    Elementary: { fluency: 28, listening: 34, pronunciation: 25 },
    Intermediate: { fluency: 52, listening: 58, pronunciation: 48 },
    "Upper Intermediate": { fluency: 70, listening: 76, pronunciation: 66 },
    Advanced: { fluency: 84, listening: 88, pronunciation: 82 },
  };
  const metrics = { ...(baselines[level] || baselines.Beginner) };

  if (goal === "Pronunciation") {
    metrics.pronunciation = Math.min(metrics.pronunciation + 5, 100);
  }

  return metrics;
}

function updateProgressItem(valueElement, meterElement, score) {
  if (Number.isFinite(score)) {
    valueElement.textContent = `${score}%`;
    meterElement.value = score;
    return;
  }

  valueElement.textContent = "Not assessed";
  meterElement.value = 0;
}

function renderProgressMetrics() {
  const metrics = state.placement?.metrics;

  updateProgressItem(fluencyValue, fluencyMeter, metrics?.fluency);
  updateProgressItem(listeningValue, listeningMeter, metrics?.listening);
  updateProgressItem(pronunciationValue, pronunciationMeter, metrics?.pronunciation);

  progressNote.textContent = metrics
    ? "Initial baseline estimated from placement answers. Real scores will come from lessons, speaking attempts, and listening activities."
    : "No score yet. Complete the placement to create an initial baseline.";
}

function refreshSessionCopy() {
  const profile = state.studentProfile;
  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const firstInterest = interests[0]?.toLowerCase();
  const profileGoal = profile?.goal?.toLowerCase() || "daily conversation";
  const profileLevel = profile?.level || "your current level";

  if (state.isSignedIn) {
    homeCoachGreeting.textContent = `Hi, ${state.userName}. Good to see you here!`;
    homeCoachSummary.innerHTML = profile
      ? `Your AI Teacher will start with ${profileLevel} English, focus on ${profileGoal}, and use topics like <strong>${firstInterest || "your interests"}</strong> to make practice feel more natural.`
      : "Yesterday you improved your past-tense answers. Today we will practice real conversation, review <strong>thought</strong>, and build a short answer you can use at work.";
  } else {
    homeCoachGreeting.textContent = "Your AI Teacher is ready to help.";
    homeCoachSummary.textContent =
      "Sign in to unlock a private learning dashboard with pronunciation practice, progress summaries, and personalized lesson guidance.";
  }

  studentGreeting.textContent = `Hi, ${state.userName}.`;
  studentBriefText.textContent = profile
    ? `Good to see you here, ${state.userName}. Your profile says your level is ${profileLevel}, your main goal is ${profileGoal}, and you enjoy ${interests.join(", ") || "personalized topics"}. Today the AI Teacher will use those signals to shape your first practice.`
    : `Good to see you here, ${state.userName}. Yesterday you studied for 28 minutes and completed 3 activities. Today the focus is pronunciation, listening, and confidence in short conversations.`;
  studentNavLinks.forEach((link) => {
    link.hidden = !state.isSignedIn;
  });
  loginNavLink.hidden = state.isSignedIn;
  logoutButton.hidden = !state.isSignedIn;
  adminNavLink.hidden = !isAdmin();
  accountNavLink.hidden = !state.isSignedIn;
  renderProgressMetrics();
}

function prefillPlacementForm() {
  if (!placementForm || state.placement) {
    return;
  }

  const profile = state.studentProfile || {};
  setSelectValue(placementForm.elements.level, profile.level || "");
  setSelectValue(placementForm.elements.goal, profile.goal || "");
}

function buildAddress(formData) {
  return {
    line1: formData.get("addressLine1")?.toString().trim() || "",
    line2: formData.get("addressLine2")?.toString().trim() || "",
    city: formData.get("city")?.toString().trim() || "",
    region: formData.get("region")?.toString().trim() || "",
    postalCode: formData.get("postalCode")?.toString().trim() || "",
    country: formData.get("country")?.toString().trim() || "",
  };
}

function buildStudentProfile(formData) {
  return {
    fullName: formData.get("fullName")?.toString().trim() || "Student",
    email: formData.get("email")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    age: formData.get("age")?.toString().trim() || "",
    nativeLanguage: formData.get("nativeLanguage")?.toString().trim() || "",
    level: formData.get("level")?.toString() || "I am not sure yet",
    goal: formData.get("goal")?.toString() || "Daily conversation",
    confidence: formData.get("confidence")?.toString() || "",
    studyTime: formData.get("studyTime")?.toString() || "",
    interests: formData.getAll("interests").map((item) => item.toString()),
    favoriteMedia: formData.get("favoriteMedia")?.toString().trim() || "",
    hobbies: formData.get("hobbies")?.toString().trim() || "",
    foodAndDrinks: formData.get("foodAndDrinks")?.toString().trim() || "",
    sports: formData.get("sports")?.toString().trim() || "",
    motivation: formData.get("motivation")?.toString().trim() || "",
    address: buildAddress(formData),
    createdAt: new Date().toISOString(),
  };
}

function readAccountForm() {
  const formData = new FormData(accountForm);

  return {
    fullName: formData.get("fullName")?.toString().trim() || "Student",
    email: formData.get("email")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    address: buildAddress(formData),
  };
}

function fillAccountForm() {
  if (!accountForm) {
    return;
  }

  const profile = state.studentProfile || {};
  const address = state.address || profile.address || {};

  accountForm.elements.fullName.value = profile.fullName || state.userName || "";
  accountForm.elements.email.value = state.userEmail || profile.email || "";
  accountForm.elements.phone.value = state.userPhone || profile.phone || "";
  accountForm.elements.country.value = address.country || "";
  accountForm.elements.addressLine1.value = address.line1 || "";
  accountForm.elements.addressLine2.value = address.line2 || "";
  accountForm.elements.city.value = address.city || "";
  accountForm.elements.region.value = address.region || "";
  accountForm.elements.postalCode.value = address.postalCode || "";
}

function applyLocalAccountUpdate(data) {
  state.userName = data.fullName.split(" ")[0] || data.fullName || state.userName;
  state.userEmail = data.email;
  state.userPhone = data.phone;
  state.address = data.address;

  if (state.studentProfile) {
    state.studentProfile = {
      ...state.studentProfile,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    localStorage.setItem("fluentpath:studentProfile", JSON.stringify(state.studentProfile));
  }

  localStorage.setItem("fluentpath:user", state.userName);
  localStorage.setItem("fluentpath:email", state.userEmail);
  localStorage.setItem("fluentpath:phone", state.userPhone);
  localStorage.setItem("fluentpath:address", JSON.stringify(state.address));
}

function shouldUseLocalFallback(error) {
  return window.location.protocol === "file:";
}

async function signOut() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
  } catch (error) {
    // The static-file fallback can still sign out locally without a backend.
  }

  state.userName = "Student";
  state.userRole = "";
  state.userEmail = "";
  state.userPhone = "";
  state.studentProfile = null;
  state.address = null;
  state.placement = null;
  state.isSignedIn = false;
  localStorage.removeItem("fluentpath:user");
  localStorage.removeItem("fluentpath:email");
  localStorage.removeItem("fluentpath:phone");
  localStorage.removeItem("fluentpath:role");
  localStorage.removeItem("fluentpath:signedIn");
  localStorage.removeItem("fluentpath:studentProfile");
  localStorage.removeItem("fluentpath:address");
  localStorage.removeItem("fluentpath:placement");
  refreshSessionCopy();
  navigateTo("home");
}

function formatCurrency(cents) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format((cents || 0) / 100);
}

function escapeHtml(value) {
  return value
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLocalAdminSummary() {
  const profile = readStoredStudentProfile();
  const studentProgress = profile
    ? [
        {
          studentName: profile.fullName,
          level: profile.level,
          goal: profile.goal,
          completion: 12,
          difficulty: "Needs first backend-backed lesson data",
          recommendation: "Complete the first lesson and placement checks.",
        },
      ]
    : [];

  return {
    storage: "local",
    totals: {
      students: profile ? 1 : 0,
      teachers: 0,
      admins: isAdmin() ? 1 : 0,
      activeStudents: profile ? 1 : 0,
      pendingPayments: 0,
      monthlyRevenueCents: 0,
    },
    studentProgress,
    recentActivity: ["Local admin preview loaded", "PostgreSQL backend is ready to connect"],
  };
}

async function renderAdminSummary() {
  try {
    const summary = await apiRequest("/api/admin/summary");
    updateAdminSummary(summary);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      updateAdminError(error);
      return;
    }

    updateAdminSummary(getLocalAdminSummary());
  }

  await renderAdminResources();
}

function updateAdminError(error) {
  adminStudentsCount.textContent = "-";
  adminTeachersCount.textContent = "-";
  adminAdminsCount.textContent = "-";
  adminRevenue.textContent = "-";
  adminPendingPayments.textContent = "-";
  adminActiveStudents.textContent = "-";
  adminStorageBadge.textContent = "API error";
  adminPersistenceNote.textContent = `Could not load admin data from the backend: ${error.message}`;
  adminProgressRows.innerHTML = `<tr><td colspan="6">Backend admin data is unavailable. Sign in again or check the server connection.</td></tr>`;
  adminActivityList.innerHTML = "<li>Admin API request failed.</li>";
  updateAdminResources({ students: [], teachers: [], plans: [], courses: [] });
}

function updateAdminSummary(summary) {
  const storageLabels = {
    postgres: "PostgreSQL",
    memory: "Memory session",
    local: "Local browser",
  };
  const storageNotes = {
    postgres: "Data is being read from PostgreSQL and should persist after server restarts.",
    memory:
      "Data is stored only in this Node server process. It will be lost when the server restarts.",
    local:
      "The backend API is not available, so this is a local browser preview. It can overwrite the single local student profile.",
  };

  adminStudentsCount.textContent = summary.totals.students;
  adminTeachersCount.textContent = summary.totals.teachers;
  adminAdminsCount.textContent = summary.totals.admins;
  adminRevenue.textContent = formatCurrency(summary.totals.monthlyRevenueCents);
  adminPendingPayments.textContent = summary.totals.pendingPayments;
  adminActiveStudents.textContent = summary.totals.activeStudents;
  adminStorageBadge.textContent = storageLabels[summary.storage] || "Unknown";
  adminPersistenceNote.textContent =
    storageNotes[summary.storage] || "Persistence mode could not be detected.";

  adminProgressRows.innerHTML = summary.studentProgress.length
    ? summary.studentProgress
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.studentName)}</td>
              <td>${escapeHtml(item.level)}</td>
              <td>${escapeHtml(item.goal)}</td>
              <td>${escapeHtml(item.completion)}%</td>
              <td>${escapeHtml(item.difficulty)}</td>
              <td>${escapeHtml(item.recommendation)}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="6">No student progress yet.</td></tr>`;

  adminActivityList.innerHTML = summary.recentActivity
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function getLocalAdminResources() {
  const profile = readStoredStudentProfile();

  return {
    students: profile
      ? [
          {
            id: "local-student",
            email: profile.email || "student@example.com",
            fullName: profile.fullName,
            level: profile.level,
            goal: profile.goal,
            status: "active",
          },
        ]
      : [],
    teachers: [],
    plans: [],
    courses: [],
  };
}

async function renderAdminResources() {
  try {
    const resources = await apiRequest("/api/admin/resources");
    updateAdminResources(resources);
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      updateAdminResources(getLocalAdminResources());
    }
  }
}

function updateAdminResources(resources) {
  adminState.students = resources.students || [];
  adminState.teachers = resources.teachers || [];
  adminState.plans = resources.plans || [];
  adminState.courses = resources.courses || [];

  adminStudentRows.innerHTML = renderRows(
    adminState.students,
    "students",
    (item) => [item.fullName, item.email, item.level, item.goal],
    5,
  );
  adminTeacherRows.innerHTML = renderRows(
    adminState.teachers,
    "teachers",
    (item) => [item.fullName, item.email, item.specialty || "-", item.status],
    5,
  );
  adminPlanRows.innerHTML = renderRows(
    adminState.plans,
    "plans",
    (item) => [item.name, formatCurrency(item.priceCents), item.billingCycle, item.status],
    5,
  );
  adminCourseRows.innerHTML = renderRows(
    adminState.courses,
    "courses",
    (item) => [item.title, item.level || "-", item.duration || "-", item.status],
    5,
  );
}

function renderRows(items, type, getCells, colSpan) {
  if (!items.length) {
    return `<tr><td colspan="${colSpan}">No records yet.</td></tr>`;
  }

  return items
    .map(
      (item) => `
        <tr>
          ${getCells(item)
            .map((cell) => `<td>${escapeHtml(cell)}</td>`)
            .join("")}
          <td>
            <button class="admin-edit-button" type="button" data-admin-edit="${type}" data-id="${escapeHtml(item.id)}">
              Edit
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function setSelectValue(select, value) {
  const optionExists = [...select.options].some((option) => option.value === value);

  if (optionExists) {
    select.value = value;
  }
}

function resetAdminForm(form) {
  form.reset();
  form.elements.id.value = "";
}

function fillAdminForm(type, id) {
  const maps = {
    students: {
      form: adminStudentForm,
      items: adminState.students,
      fill(item, form) {
        form.elements.fullName.value = item.fullName || "";
        form.elements.email.value = item.email || "";
        form.elements.password.value = "";
        form.elements.nativeLanguage.value = item.nativeLanguage || "Portuguese";
        setSelectValue(form.elements.level, item.level || "Beginner");
        setSelectValue(form.elements.goal, item.goal || "Daily conversation");
        form.elements.notes.value = item.notes || "";
      },
    },
    teachers: {
      form: adminTeacherForm,
      items: adminState.teachers,
      fill(item, form) {
        form.elements.fullName.value = item.fullName || "";
        form.elements.email.value = item.email || "";
        form.elements.password.value = "";
        form.elements.specialty.value = item.specialty || "";
        setSelectValue(form.elements.status, item.status || "active");
      },
    },
    plans: {
      form: adminPlanForm,
      items: adminState.plans,
      fill(item, form) {
        form.elements.name.value = item.name || "";
        form.elements.price.value = ((item.priceCents || 0) / 100).toFixed(2);
        setSelectValue(form.elements.billingCycle, item.billingCycle || "monthly");
        setSelectValue(form.elements.status, item.status || "active");
        form.elements.description.value = item.description || "";
      },
    },
    courses: {
      form: adminCourseForm,
      items: adminState.courses,
      fill(item, form) {
        form.elements.title.value = item.title || "";
        form.elements.level.value = item.level || "";
        form.elements.duration.value = item.duration || "";
        setSelectValue(form.elements.status, item.status || "draft");
        form.elements.description.value = item.description || "";
      },
    },
  };
  const config = maps[type];
  const item = config?.items.find((candidate) => candidate.id === id);

  if (!config || !item) {
    return;
  }

  config.form.elements.id.value = item.id;
  config.fill(item, config.form);
}

function readAdminForm(form, type) {
  const formData = new FormData(form);
  const base = Object.fromEntries(formData.entries());

  if (type === "plans") {
    return {
      ...base,
      priceCents: Math.round(Number(base.price || 0) * 100),
    };
  }

  return base;
}

async function saveAdminRecord(form, type, feedbackElement) {
  const id = form.elements.id.value;
  const method = id ? "PUT" : "POST";
  const path = id ? `/api/admin/${type}/${encodeURIComponent(id)}` : `/api/admin/${type}`;
  const body = readAdminForm(form, type);

  try {
    await apiRequest(path, {
      method,
      body: JSON.stringify(body),
    });
    feedbackElement.textContent = id ? "Record updated." : "Record created.";
    resetAdminForm(form);
    await renderAdminSummary();
  } catch (error) {
    feedbackElement.textContent = error.message;
  }
}

function renderPracticePhrase(phrase) {
  practicePhrase.textContent = phrase.text;
  phraseMeaning.textContent = phrase.meaning;
  phraseForm.textContent = phrase.form;
  phraseTip.textContent = phrase.tip;
}

function choosePhrase() {
  const currentPhrase = practicePhrase.textContent.trim();
  const available = phrases.filter((phrase) => phrase.text !== currentPhrase);
  const next = available[Math.floor(Math.random() * available.length)];
  renderPracticePhrase(next);
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
    state.chunks = [];

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        state.chunks.push(event.data);
      }
    });

    recorder.start();
    window.setTimeout(() => recorder.stop(), 5000);

    recorder.addEventListener("stop", async () => {
      stream.getTracks().forEach((track) => track.stop());
      recordVoiceButton.disabled = false;
      recordVoiceButton.textContent = "Record voice";
      const blob = new Blob(state.chunks, { type: "audio/webm" });
      const durationSeconds = 5;
      state.chunks = [];

      try {
        const attempt = await apiRequest("/api/pronunciation-attempts", {
          method: "POST",
          body: JSON.stringify({
            phrase: practicePhrase.textContent.trim(),
            durationSeconds,
            localSizeBytes: blob.size,
          }),
        });
        voiceFeedback.textContent = `Attempt saved as ${attempt.id}. Audio stays in this browser until upload storage is added; transcription is pending.`;
      } catch (error) {
        voiceFeedback.textContent = shouldUseLocalFallback(error)
          ? "Demo feedback: audio stayed only in this browser. Backend storage is needed to create an attempt ID and transcription job."
          : `The audio was recorded locally, but the attempt was not saved: ${error.message}`;
      }
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
logoutButton.addEventListener("click", signOut);
refreshAdminButton.addEventListener("click", renderAdminSummary);
window.addEventListener("hashchange", handleRouteChange);

document.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-admin-edit]");

  if (editButton) {
    fillAdminForm(editButton.dataset.adminEdit, editButton.dataset.id);
    return;
  }

  const resetButton = event.target.closest("[data-reset-admin-form]");

  if (resetButton) {
    resetAdminForm(document.querySelector(`#${resetButton.dataset.resetAdminForm}`));
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    const payload = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    applySessionPayload(payload);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      loginFeedback.textContent = error.message;
      return;
    }

    state.userName = readStoredStudentProfile()?.fullName?.split(" ")[0] || "Student";
    state.userEmail = email;
    state.userPhone = "";
    state.userRole = email === "admin@example.com" ? "admin" : "student";
    state.studentProfile = readStoredStudentProfile();
    state.address = readStoredAddress();
    state.placement = readStoredPlacement();
    state.isSignedIn = true;
    localStorage.setItem("fluentpath:user", state.userName);
    localStorage.setItem("fluentpath:email", state.userEmail);
    localStorage.setItem("fluentpath:phone", state.userPhone);
    localStorage.setItem("fluentpath:role", state.userRole);
    localStorage.setItem("fluentpath:signedIn", "true");
  }

  loginFeedback.textContent = "Signed in.";
  refreshSessionCopy();
  navigateTo(isAdmin() ? "admin" : "dashboard");
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const profile = buildStudentProfile(formData);
  const password = formData.get("password")?.toString() || "";

  try {
    const payload = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: profile.email,
        password,
        profile,
      }),
    });
    applySessionPayload(payload);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      signupFeedback.textContent = error.message;
      return;
    }

    state.studentProfile = profile;
    state.userName = profile.fullName.split(" ")[0] || "Student";
    state.userEmail = profile.email;
    state.userPhone = profile.phone;
    state.userRole = "student";
    state.address = profile.address;
    state.placement = null;
    state.isSignedIn = true;
    localStorage.setItem("fluentpath:studentProfile", JSON.stringify(profile));
    localStorage.setItem("fluentpath:user", state.userName);
    localStorage.setItem("fluentpath:email", state.userEmail);
    localStorage.setItem("fluentpath:phone", state.userPhone);
    localStorage.setItem("fluentpath:address", JSON.stringify(state.address));
    localStorage.setItem("fluentpath:role", state.userRole);
    localStorage.setItem("fluentpath:signedIn", "true");
  }

  if (!localStorage.getItem("fluentpath:studentProfile")) {
    localStorage.setItem("fluentpath:studentProfile", JSON.stringify(profile));
  }
  state.placement = null;
  localStorage.removeItem("fluentpath:placement");

  signupFeedback.textContent =
    "Student profile saved. The AI Teacher can now use these details to personalize the first lesson.";
  refreshSessionCopy();
  navigateTo("dashboard");
});

courseGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-course-slug]");

  if (!link) {
    return;
  }

  event.preventDefault();
  sessionStorage.setItem("fluentpath:selectedCourse", link.dataset.courseSlug);
  navigateTo("course");
});

placementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(placementForm);
  const level = formData.get("level");
  const goal = formData.get("goal");
  const placement = {
    level,
    goal,
    writing: formData.get("writing")?.toString().trim() || "",
    metrics: getBaselineMetrics(level, goal),
    completedAt: new Date().toISOString(),
  };

  state.placement = placement;
  localStorage.setItem("fluentpath:placement", JSON.stringify(placement));
  renderProgressMetrics();

  assessmentFeedback.textContent = `Saved. Your AI Teacher will start with ${level} material focused on ${goal.toString().toLowerCase()}. The dashboard now shows an initial baseline estimate, not a measured score yet.`;
});

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const account = readAccountForm();

  try {
    const payload = await apiRequest("/api/account", {
      method: "PUT",
      body: JSON.stringify(account),
    });
    applySessionPayload(payload);
    accountFeedback.textContent = "Account updated.";
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      accountFeedback.textContent = error.message;
      return;
    }

    applyLocalAccountUpdate(account);
    accountFeedback.textContent = "Account updated locally. Start the backend to persist it.";
  }

  refreshSessionCopy();
  fillAccountForm();
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(passwordForm);

  try {
    await apiRequest("/api/account/password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword")?.toString() || "",
        newPassword: formData.get("newPassword")?.toString() || "",
      }),
    });
    passwordForm.reset();
    passwordFeedback.textContent = "Password updated.";
  } catch (error) {
    passwordFeedback.textContent = shouldUseLocalFallback(error)
      ? "Password changes require the backend API."
      : error.message;
  }
});

adminStudentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminRecord(adminStudentForm, "students", adminStudentFeedback);
});

adminTeacherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminRecord(adminTeacherForm, "teachers", adminTeacherFeedback);
});

adminPlanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminRecord(adminPlanForm, "plans", adminPlanFeedback);
});

adminCourseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminRecord(adminCourseForm, "courses", adminCourseFeedback);
});

newPhraseButton.addEventListener("click", choosePhrase);
recordVoiceButton.addEventListener("click", recordVoiceSample);
audioClassButton.addEventListener("click", () => startClassRecording("audio"));
videoClassButton.addEventListener("click", () => startClassRecording("video"));
stopClassButton.addEventListener("click", stopClassRecording);

renderCourses();
renderLessons();
renderPracticePhrase(phrases[0]);
refreshSessionCopy();
handleRouteChange();
