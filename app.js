const pages = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll("[data-route]")];
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector(".nav-links");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const signupFeedback = document.querySelector("#signupFeedback");
const signupInviteBanner = document.querySelector("#signupInviteBanner");
const signupInviteTitle = document.querySelector("#signupInviteTitle");
const signupInviteText = document.querySelector("#signupInviteText");
const signupInviteCode = document.querySelector("#signupInviteCode");
const loginFeedback = document.querySelector("#loginFeedback");
const loginNavLink = document.querySelector("#loginNavLink");
const logoutButton = document.querySelector("#logoutButton");
const adminNavLink = document.querySelector("#adminNavLink");
const teacherNavLink = document.querySelector("#teacherNavLink");
const accountNavLink = document.querySelector("#accountNavLink");
const courseGrid = document.querySelector("#courseGrid");
const lessonGrid = document.querySelector("#lessonGrid");
const studentNavLinks = [...document.querySelectorAll("[data-student-nav]")];
const homeCoachGreeting = document.querySelector("#homeCoachGreeting");
const homeCoachSummary = document.querySelector("#homeCoachSummary");
const assessmentFeedback = document.querySelector("#assessmentFeedback");
const placementResult = document.querySelector("#placementResult");
const placementEmpty = document.querySelector("#placementEmpty");
const placementTestSection = document.querySelector("#placementTestSection");
const placementTestStatus = document.querySelector("#placementTestStatus");
const placementTestForm = document.querySelector("#placementTestForm");
const placementQuestions = document.querySelector("#placementQuestions");
const placementTestError = document.querySelector("#placementTestError");
const placementPriorities = document.querySelector("#placementPriorities");
const startPlacementButton = document.querySelector("#startPlacementButton");
const retakePlacementButton = document.querySelector("#retakePlacementButton");
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
const uploadRecordingSection = document.querySelector("#uploadRecordingSection");
const uploadRecordingButton = document.querySelector("#uploadRecordingButton");
const lessonAnalysisPanel = document.querySelector("#lessonAnalysisPanel");
const lessonAnalysisStatus = document.querySelector("#lessonAnalysisStatus");
const lessonAnalysisResult = document.querySelector("#lessonAnalysisResult");
const lessonAnalysisSummary = document.querySelector("#lessonAnalysisSummary");
const lessonMistakesSection = document.querySelector("#lessonMistakesSection");
const lessonMistakesList = document.querySelector("#lessonMistakesList");
const lessonVocabSection = document.querySelector("#lessonVocabSection");
const lessonVocabList = document.querySelector("#lessonVocabList");
const lessonRecommendationsSection = document.querySelector("#lessonRecommendationsSection");
const lessonRecommendationsList = document.querySelector("#lessonRecommendationsList");
const refreshAdminButton = document.querySelector("#refreshAdminButton");
const refreshTeacherButton = document.querySelector("#refreshTeacherButton");
const teacherGreeting = document.querySelector("#teacherGreeting");
const teacherBriefText = document.querySelector("#teacherBriefText");
const teacherAssignedCount = document.querySelector("#teacherAssignedCount");
const teacherAttentionCount = document.querySelector("#teacherAttentionCount");
const teacherPendingSummaries = document.querySelector("#teacherPendingSummaries");
const teacherActiveClasses = document.querySelector("#teacherActiveClasses");
const teacherStorageBadge = document.querySelector("#teacherStorageBadge");
const teacherPersistenceNote = document.querySelector("#teacherPersistenceNote");
const teacherStudentRows = document.querySelector("#teacherStudentRows");
const teacherActionList = document.querySelector("#teacherActionList");
const teacherInviteLink = document.querySelector("#teacherInviteLink");
const copyTeacherInviteButton = document.querySelector("#copyTeacherInviteButton");
const teacherInviteFeedback = document.querySelector("#teacherInviteFeedback");
const levelSuggestionsPanel = document.querySelector("#levelSuggestionsPanel");
const levelSuggestionRows = document.querySelector("#levelSuggestionRows");
const levelSuggestionFeedback = document.querySelector("#levelSuggestionFeedback");
const placementHeading = document.querySelector("#placementHeading");
const adminLevelSuggestionsPanel = document.querySelector("#adminLevelSuggestionsPanel");
const adminLevelSuggestionRows = document.querySelector("#adminLevelSuggestionRows");
const adminLevelSuggestionFeedback = document.querySelector("#adminLevelSuggestionFeedback");
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
const adminAssignmentForm = document.querySelector("#adminAssignmentForm");
const adminStudentRows = document.querySelector("#adminStudentRows");
const adminTeacherRows = document.querySelector("#adminTeacherRows");
const adminPlanRows = document.querySelector("#adminPlanRows");
const adminCourseRows = document.querySelector("#adminCourseRows");
const adminAssignmentRows = document.querySelector("#adminAssignmentRows");
const adminStudentFeedback = document.querySelector("#adminStudentFeedback");
const adminTeacherFeedback = document.querySelector("#adminTeacherFeedback");
const adminPlanFeedback = document.querySelector("#adminPlanFeedback");
const adminCourseFeedback = document.querySelector("#adminCourseFeedback");
const adminAssignmentFeedback = document.querySelector("#adminAssignmentFeedback");
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

function readStoredTeacherProfile() {
  try {
    return JSON.parse(localStorage.getItem("fluentpath:teacherProfile")) || null;
  } catch (error) {
    return null;
  }
}

function readStoredInviteCode() {
  return sessionStorage.getItem("fluentpath:inviteCode") || "";
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
  teacherProfile: readStoredTeacherProfile(),
  inviteCode: readStoredInviteCode(),
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
  assignments: [],
  plans: [],
  courses: [],
};

const protectedRoutes = ["dashboard", "lessons", "admin", "account", "teacher"];
const studentOnlyRoutes = ["dashboard", "lessons"];

function isStudent() {
  return state.isSignedIn && state.userRole === "student";
}

function isAdmin() {
  return state.isSignedIn && state.userRole === "admin";
}

function isTeacher() {
  return state.isSignedIn && state.userRole === "teacher";
}

function getDefaultRouteForRole() {
  if (isAdmin()) {
    return "admin";
  }

  if (isTeacher()) {
    return "teacher";
  }

  if (isStudent()) {
    return "dashboard";
  }

  return "home";
}

function getSafeRoute(routeName) {
  const routeExists = pages.some((page) => page.id === routeName);
  const requestedRoute = routeExists ? routeName : "home";

  if (protectedRoutes.includes(requestedRoute) && !state.isSignedIn) {
    return "login";
  }

  if (studentOnlyRoutes.includes(requestedRoute) && !isStudent()) {
    return getDefaultRouteForRole();
  }

  if (requestedRoute === "admin" && !isAdmin()) {
    return getDefaultRouteForRole();
  }

  if (requestedRoute === "teacher" && !isTeacher()) {
    return getDefaultRouteForRole();
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

  if (safeRoute === "teacher") {
    renderTeacherSummary();
  }

  if (safeRoute === "account") {
    fillAccountForm();
  }

  if (safeRoute === "signup") {
    renderSignupInvite();
  }

  if (safeRoute === "dashboard") {
    updatePlacementUI();
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
  captureInviteFromUrl();
  const requestedRoute = window.location.hash.replace("#", "") || "home";
  const safeRoute = getSafeRoute(requestedRoute);

  if (safeRoute !== requestedRoute) {
    navigateTo(safeRoute);
    return;
  }

  setRoute(safeRoute);
}

function normalizeInviteCode(code = "") {
  return code.toString().trim().toUpperCase();
}

function captureInviteFromUrl() {
  const inviteCode = normalizeInviteCode(new URLSearchParams(window.location.search).get("invite") || "");

  if (!inviteCode) {
    return;
  }

  state.inviteCode = inviteCode;
  sessionStorage.setItem("fluentpath:inviteCode", inviteCode);

  if (signupInviteCode) {
    signupInviteCode.value = inviteCode;
  }
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

async function renderSignupInvite() {
  const code = normalizeInviteCode(state.inviteCode || readStoredInviteCode());

  if (!code) {
    signupInviteBanner.hidden = true;
    signupInviteCode.value = "";
    return;
  }

  state.inviteCode = code;
  signupInviteCode.value = code;
  signupInviteBanner.hidden = false;
  signupInviteTitle.textContent = "Joining a teacher workspace";
  signupInviteText.textContent =
    "This account will be assigned to the teacher who shared the invite link.";

  try {
    const invite = await apiRequest(`/api/invites/${encodeURIComponent(code)}`);
    const teacher = invite.teacher || {};
    signupInviteTitle.textContent = `Joining ${teacher.fullName || "your teacher"}'s class`;
    signupInviteText.textContent = `${
      teacher.specialty || "English"
    } teacher. After signup, this student account will be assigned automatically.`;
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      signupInviteText.textContent = error.message;
      return;
    }

    signupInviteTitle.textContent = "Joining Ana Teacher's class";
    signupInviteText.textContent =
      "Pronunciation teacher. After signup, this student account will be assigned automatically.";
  }
}

function buildTeacherInviteUrl(code) {
  const url = new URL(window.location.href);
  url.search = `?invite=${encodeURIComponent(code)}`;
  url.hash = "signup";
  return url.toString();
}

async function fetchAndApplyPlacement() {
  try {
    const [placement, session] = await Promise.all([
      apiRequest("/api/placement"),
      apiRequest("/api/auth/me"),
    ]);

    // Refresh profile so level changes approved by teacher/admin take effect immediately
    if (session?.profile) {
      const updatedProfile = {
        ...state.studentProfile,
        ...session.profile,
        email: session.user?.email || state.userEmail,
        phone: session.user?.phone || state.userPhone,
        address: session.address || state.address,
      };
      state.studentProfile = updatedProfile;
      localStorage.setItem("fluentpath:studentProfile", JSON.stringify(updatedProfile));
      refreshSessionCopy();
    }

    if (placement) {
      state.placement = { ...placement, goal: state.studentProfile?.goal || "" };
      localStorage.setItem("fluentpath:placement", JSON.stringify(state.placement));
      renderProgressMetrics();
      updatePlacementUI();
    }
  } catch {
    // placement fetch is best-effort — localStorage cache is already applied
  }
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
  state.teacherProfile = state.userRole === "teacher" ? profile : null;
  state.address = address;
  state.placement = readStoredPlacement();
  state.isSignedIn = true;

  localStorage.setItem("fluentpath:user", state.userName);
  localStorage.setItem("fluentpath:email", state.userEmail);
  localStorage.setItem("fluentpath:phone", state.userPhone);
  localStorage.setItem("fluentpath:role", state.userRole);
  localStorage.setItem("fluentpath:signedIn", "true");

  if (profile) {
    const profileStorageKey =
      state.userRole === "teacher" ? "fluentpath:teacherProfile" : "fluentpath:studentProfile";
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
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
    if (isTeacher()) {
      homeCoachSummary.textContent =
        "Your teacher workspace is ready with assigned students, progress summaries, and next teaching actions.";
    } else if (isAdmin()) {
      homeCoachSummary.textContent =
        "Your administrative workspace is ready for school operations, people, plans, and courses.";
    } else {
      homeCoachSummary.innerHTML = profile
        ? `Your AI Teacher will start with ${profileLevel} English, focus on ${profileGoal}, and use topics like <strong>${firstInterest || "your interests"}</strong> to make practice feel more natural.`
        : "Yesterday you improved your past-tense answers. Today we will practice real conversation, review <strong>thought</strong>, and build a short answer you can use at work.";
    }
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
    link.hidden = !isStudent();
  });
  loginNavLink.hidden = state.isSignedIn;
  logoutButton.hidden = !state.isSignedIn;
  adminNavLink.hidden = !isAdmin();
  teacherNavLink.hidden = !isTeacher();
  accountNavLink.hidden = !state.isSignedIn;
  renderProgressMetrics();
}

function updatePlacementUI() {
  const placement = state.placement;
  if (placement) {
    placementHeading.textContent = `AI baseline — ${placement.level}`;
    assessmentFeedback.textContent = placement.feedback || "";
    placementPriorities.innerHTML = (placement.priorities || [])
      .map((p) => `<li>${escapeHtml(p)}</li>`)
      .join("");
    placementResult.hidden = false;
    placementEmpty.hidden = true;
    placementTestSection.hidden = true;
  } else {
    placementHeading.textContent = "AI baseline";
    placementResult.hidden = true;
    placementEmpty.hidden = false;
    placementTestSection.hidden = true;
  }
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

function getLocalFallbackRole(email) {
  if (email === "admin@example.com") {
    return "admin";
  }

  if (email === "teacher@example.com") {
    return "teacher";
  }

  return "student";
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
  state.teacherProfile = null;
  state.address = null;
  state.placement = null;
  state.isSignedIn = false;
  localStorage.removeItem("fluentpath:user");
  localStorage.removeItem("fluentpath:email");
  localStorage.removeItem("fluentpath:phone");
  localStorage.removeItem("fluentpath:role");
  localStorage.removeItem("fluentpath:signedIn");
  localStorage.removeItem("fluentpath:studentProfile");
  localStorage.removeItem("fluentpath:teacherProfile");
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

function getLocalTeacherSummary() {
  const storedProfile = readStoredStudentProfile();
  const assignedStudents = [
    {
      studentId: "local-student",
      studentName: storedProfile?.fullName || "Lucas",
      level: storedProfile?.level || "Beginner",
      goal: storedProfile?.goal || "Daily conversation",
      completion: state.placement?.metrics?.fluency || 64,
      difficulty: "word endings",
      recommendation: "Practice final consonants and short conversation answers.",
      notes: "Local preview assignment.",
    },
  ];

  return {
    storage: "local",
    teacher: {
      fullName: state.teacherProfile?.fullName || state.userName || "Teacher",
      specialty: state.teacherProfile?.specialty || "Pronunciation",
      status: state.teacherProfile?.status || "active",
    },
    invite: {
      code: "ANA-TEACHER",
      status: "active",
      usedCount: 0,
      maxUses: null,
      expiresAt: null,
    },
    totals: {
      assignedStudents: assignedStudents.length,
      activeStudents: assignedStudents.length,
      studentsNeedingAttention: assignedStudents.filter((student) => student.completion < 70).length,
      pendingSummaries: assignedStudents.filter((student) => student.completion < 70).length,
    },
    assignedStudents,
    nextActions: [
      "Review students with completion below 70%.",
      "Prepare one short speaking correction for the next class.",
      "Confirm consent before any class recording.",
    ],
  };
}

async function renderTeacherSummary() {
  try {
    const summary = await apiRequest("/api/teacher/summary");
    updateTeacherSummary(summary);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      updateTeacherError(error);
      return;
    }

    updateTeacherSummary(getLocalTeacherSummary());
  }
}

function updateTeacherError(error) {
  teacherGreeting.textContent = `Hi, ${state.userName}.`;
  teacherBriefText.textContent =
    "Teacher data could not be loaded. Sign in again or check the server connection.";
  teacherAssignedCount.textContent = "-";
  teacherAttentionCount.textContent = "-";
  teacherPendingSummaries.textContent = "-";
  teacherActiveClasses.textContent = "-";
  teacherStorageBadge.textContent = "API error";
  teacherPersistenceNote.textContent = `Could not load teacher data from the backend: ${error.message}`;
  teacherStudentRows.innerHTML = `<tr><td colspan="6">Teacher summary is unavailable.</td></tr>`;
  teacherActionList.innerHTML = "<li>Teacher API request failed.</li>";
  teacherInviteLink.value = "";
  teacherInviteFeedback.textContent = "Invite link is unavailable until teacher data loads.";
}

function updateTeacherSummary(summary) {
  const storageLabels = {
    postgres: "PostgreSQL",
    memory: "Memory session",
    local: "Local browser",
  };
  const teacher = summary.teacher || {};

  teacherGreeting.textContent = `Hi, ${teacher.fullName || state.userName}.`;
  teacherBriefText.textContent = `${teacher.specialty || "General English"} teacher, status ${
    teacher.status || "active"
  }. This workspace only shows students assigned to this teacher.`;
  teacherAssignedCount.textContent = summary.totals.assignedStudents;
  teacherAttentionCount.textContent = summary.totals.studentsNeedingAttention;
  teacherPendingSummaries.textContent = summary.totals.pendingSummaries;
  teacherActiveClasses.textContent = summary.totals.activeStudents;
  teacherStorageBadge.textContent = storageLabels[summary.storage] || "Unknown";
  teacherPersistenceNote.textContent =
    summary.storage === "postgres"
      ? "Teacher data is loaded from PostgreSQL with student access limited by assignments."
      : "Teacher data is using prototype storage. PostgreSQL can persist assignments and summaries.";
  const inviteCode = summary.invite?.code || "";
  teacherInviteLink.value = inviteCode ? buildTeacherInviteUrl(inviteCode) : "";
  teacherInviteFeedback.textContent = inviteCode
    ? `Invite code ${inviteCode}. Students who use this link will be assigned to this teacher.`
    : "Invite link is not available for this teacher yet.";

  teacherStudentRows.innerHTML = summary.assignedStudents.length
    ? summary.assignedStudents
        .map(
          (student) => `
            <tr>
              <td>${escapeHtml(student.studentName)}</td>
              <td>${escapeHtml(student.level)}</td>
              <td>${escapeHtml(student.goal)}</td>
              <td>${escapeHtml(student.completion)}%</td>
              <td>${escapeHtml(student.difficulty)}</td>
              <td>${escapeHtml(student.recommendation)}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="6">No students assigned to this teacher yet.</td></tr>`;

  teacherActionList.innerHTML = summary.nextActions
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const suggestions = summary.levelSuggestions || [];
  levelSuggestionsPanel.hidden = suggestions.length === 0;
  levelSuggestionRows.innerHTML = suggestions
    .map(
      (s) => `
        <tr>
          <td>${escapeHtml(s.studentName)}</td>
          <td>${escapeHtml(s.currentLevel)}</td>
          <td>${escapeHtml(s.suggestedLevel)}</td>
          <td><button class="secondary-action" data-review-student="${escapeHtml(s.studentId)}" data-review-action="approve">Approve</button></td>
          <td><button class="secondary-action" data-review-student="${escapeHtml(s.studentId)}" data-review-action="dismiss">Dismiss</button></td>
        </tr>`,
    )
    .join("");
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
  updateAdminResources({ students: [], teachers: [], assignments: [], plans: [], courses: [] });
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

  const adminSuggestions = summary.pendingLevelSuggestions || [];
  adminLevelSuggestionsPanel.hidden = adminSuggestions.length === 0;
  adminLevelSuggestionRows.innerHTML = adminSuggestions
    .map(
      (s) => `
        <tr>
          <td>${escapeHtml(s.studentName)}</td>
          <td>${escapeHtml(s.currentLevel)}</td>
          <td>${escapeHtml(s.suggestedLevel)}</td>
          <td><button class="secondary-action" data-admin-review-student="${escapeHtml(s.studentId)}" data-admin-review-action="approve">Approve</button></td>
          <td><button class="secondary-action" data-admin-review-student="${escapeHtml(s.studentId)}" data-admin-review-action="dismiss">Dismiss</button></td>
        </tr>`,
    )
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
            assignmentStatus: "pending_assignment",
            teacherId: "",
            teacherName: "",
            status: "active",
          },
        ]
      : [],
    teachers: [],
    assignments: [],
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
  adminState.assignments = resources.assignments || [];
  adminState.plans = resources.plans || [];
  adminState.courses = resources.courses || [];
  renderAdminAssignmentOptions();

  adminStudentRows.innerHTML = renderRows(
    adminState.students,
    "students",
    (item) => [
      item.fullName,
      item.email,
      item.level,
      item.goal,
      item.teacherName || "Unassigned",
    ],
    6,
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
  adminAssignmentRows.innerHTML = renderAssignmentRows();
}

function renderAdminAssignmentOptions() {
  const studentOptions = adminState.students
    .map((student) => {
      const status = student.teacherName ? `Assigned to ${student.teacherName}` : "Unassigned";
      return `<option value="${escapeHtml(student.id)}">${escapeHtml(student.fullName)} - ${escapeHtml(status)}</option>`;
    })
    .join("");
  const teacherOptions = adminState.teachers
    .map(
      (teacher) =>
        `<option value="${escapeHtml(teacher.id)}">${escapeHtml(teacher.fullName)} - ${escapeHtml(teacher.specialty || "General English")}</option>`,
    )
    .join("");

  adminAssignmentForm.elements.studentId.innerHTML = `<option value="">Choose a student</option>${studentOptions}`;
  adminAssignmentForm.elements.teacherId.innerHTML = `<option value="">Choose a teacher</option>${teacherOptions}`;
}

function renderAssignmentRows() {
  if (!adminState.assignments.length) {
    return `<tr><td colspan="5">No teacher assignments yet.</td></tr>`;
  }

  return adminState.assignments
    .map(
      (assignment) => `
        <tr>
          <td>${escapeHtml(assignment.studentName)}</td>
          <td>${escapeHtml(assignment.teacherName)}</td>
          <td>${escapeHtml(assignment.source || "manual")}</td>
          <td>${escapeHtml(assignment.notes || "-")}</td>
          <td>
            <button
              class="admin-edit-button"
              type="button"
              data-admin-assignment-student="${escapeHtml(assignment.studentId)}"
              data-admin-assignment-teacher="${escapeHtml(assignment.teacherId)}"
            >
              Reassign
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
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

async function saveAdminAssignment() {
  const formData = new FormData(adminAssignmentForm);
  const body = Object.fromEntries(formData.entries());

  try {
    await apiRequest("/api/admin/assignments", {
      method: "POST",
      body: JSON.stringify(body),
    });
    adminAssignmentFeedback.textContent = "Student assigned to teacher.";
    adminAssignmentForm.reset();
    await renderAdminSummary();
  } catch (error) {
    adminAssignmentFeedback.textContent = error.message;
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

      state.classRecordingBlob = blob;
      classFeedback.textContent = `Recording ready — about ${minutes} min captured. Upload it to analyze the lesson.`;
      uploadRecordingSection.hidden = false;
      lessonAnalysisPanel.hidden = true;

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
refreshTeacherButton.addEventListener("click", renderTeacherSummary);
copyTeacherInviteButton.addEventListener("click", async () => {
  const link = teacherInviteLink.value;

  if (!link) {
    teacherInviteFeedback.textContent = "Invite link is not available yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(link);
    teacherInviteFeedback.textContent = "Invite link copied.";
  } catch (error) {
    teacherInviteLink.select();
    teacherInviteFeedback.textContent = "Invite link selected. Copy it from the field.";
  }
});
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
    return;
  }

  const assignmentButton = event.target.closest("[data-admin-assignment-student]");

  if (assignmentButton) {
    adminAssignmentForm.elements.studentId.value = assignmentButton.dataset.adminAssignmentStudent;
    adminAssignmentForm.elements.teacherId.value = assignmentButton.dataset.adminAssignmentTeacher;
    adminAssignmentForm.elements.notes.focus();
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
    if (payload.user?.role === "student") fetchAndApplyPlacement();
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      loginFeedback.textContent = error.message;
      loginFeedback.classList.add("error");
      return;
    }

    const fallbackRole = getLocalFallbackRole(email);
    const teacherProfile = {
      fullName: "Ana Teacher",
      specialty: "Pronunciation",
      status: "active",
    };

    state.userName =
      fallbackRole === "teacher"
        ? "Ana"
        : readStoredStudentProfile()?.fullName?.split(" ")[0] || "Student";
    state.userEmail = email;
    state.userPhone = "";
    state.userRole = fallbackRole;
    state.studentProfile = fallbackRole === "student" ? readStoredStudentProfile() : null;
    state.teacherProfile = fallbackRole === "teacher" ? teacherProfile : null;
    state.address = fallbackRole === "student" ? readStoredAddress() : null;
    state.placement = readStoredPlacement();
    state.isSignedIn = true;
    localStorage.setItem("fluentpath:user", state.userName);
    localStorage.setItem("fluentpath:email", state.userEmail);
    localStorage.setItem("fluentpath:phone", state.userPhone);
    localStorage.setItem("fluentpath:role", state.userRole);
    localStorage.setItem("fluentpath:signedIn", "true");
    if (state.teacherProfile) {
      localStorage.setItem("fluentpath:teacherProfile", JSON.stringify(state.teacherProfile));
    }
  }

  loginFeedback.textContent = "Signed in.";
  loginFeedback.classList.remove("error");
  refreshSessionCopy();
  navigateTo(getDefaultRouteForRole());
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const profile = buildStudentProfile(formData);
  const password = formData.get("password")?.toString() || "";
  const inviteCode = normalizeInviteCode(formData.get("inviteCode") || state.inviteCode || "");

  try {
    const payload = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: profile.email,
        password,
        profile,
        inviteCode,
      }),
    });
    applySessionPayload(payload);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      signupFeedback.textContent = error.message;
      signupFeedback.classList.add("error");
      return;
    }

    state.studentProfile = profile;
    state.teacherProfile = null;
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
  state.inviteCode = "";
  localStorage.removeItem("fluentpath:placement");
  sessionStorage.removeItem("fluentpath:inviteCode");

  const baseSignupMessage = inviteCode
    ? "Student profile saved and assigned to the teacher from the invite link."
    : "Student profile saved.";
  signupFeedback.textContent = `${baseSignupMessage} Setting up your AI baseline…`;
  refreshSessionCopy();
  navigateTo("dashboard");

  try {
    const result = await apiRequest("/api/placement", {
      method: "POST",
      body: JSON.stringify({ writing: profile.motivation || "" }),
    });
    applyPlacementResult(result);
    signupFeedback.textContent = `${baseSignupMessage} AI baseline ready.`;
  } catch {
    signupFeedback.textContent = baseSignupMessage;
  }
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

function formatPassageHtml(text) {
  const safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let html = safe
    .replace(/\*\*([^*\n]+):\*\*/g, "<strong>$1:</strong>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  // Add line break before each new speaker mid-dialogue
  // Matches: sentence-ending punctuation + space + CapitalWord(s) + colon (plain or bold)
  html = html
    .replace(/([.!?])\s+(<strong>[A-Z][^<:]+:<\/strong>)/g, "$1<br>$2")
    .replace(/([.!?])\s+([A-Z][a-zA-Z ]{1,20}:(?=\s))/g, "$1<br>$2");

  return html;
}

function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_+\s*\(1\)/g, "blank one")
    .replace(/_+\s*\(2\)/g, "blank two")
    .replace(/_+\s*\(3\)/g, "blank three")
    .replace(/_+/g, "blank")
    .replace(/\n+/g, ". ")
    .trim();
}

function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Karen")),
  );
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

let activeRecognition = null;

function startSpeechRecognition(questionId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.querySelector(`[data-speaking-id="${questionId}"]`);
  const display = document.getElementById(`transcript-${questionId}`);
  const input = document.querySelector(`input[name="${questionId}"]`);

  if (!SpeechRecognition) {
    display.textContent = "Speech recognition is not supported in this browser. Please use Chrome or Edge.";
    return;
  }

  if (activeRecognition) {
    activeRecognition.stop();
    activeRecognition = null;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  activeRecognition = recognition;

  btn.textContent = "⏹ Stop";
  btn.classList.add("recording");
  display.textContent = "Listening…";

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((r) => r[0].transcript)
      .join(" ");
    display.textContent = `"${transcript}"`;
    input.value = transcript;
  };

  recognition.onerror = () => {
    display.textContent = "Could not capture speech. Please try again.";
    btn.textContent = "🎤 Try again";
    btn.classList.remove("recording");
    activeRecognition = null;
  };

  recognition.onend = () => {
    btn.textContent = input.value ? "🎤 Record again" : "🎤 Start recording";
    btn.classList.remove("recording");
    activeRecognition = null;
  };

  recognition.start();
}

function renderPlacementQuestion(q) {
  const skillLabel = { grammar: "Grammar", vocabulary: "Vocabulary", reading: "Reading", listening: "Listening", speaking: "Speaking" };

  let passageHtml = "";
  if (q.passage) {
    if (q.skill === "listening") {
      const passageId = `passage-${escapeHtml(q.id)}`;
      passageHtml = `
        <div class="listening-controls">
          <button type="button" class="listen-button" data-passage-id="${passageId}">
            🔊 Listen
          </button>
          <span class="listen-hint">Tap to hear the dialogue aloud</span>
        </div>
        <div class="assessment-passage" id="${passageId}" data-text="${escapeHtml(q.passage)}">${formatPassageHtml(q.passage)}</div>`;
    } else {
      passageHtml = `<div class="assessment-passage">${formatPassageHtml(q.passage)}</div>`;
    }
  }

  let input;
  if (q.skill === "listening" && q.type === "gap_fill" && q.passage) {
    const blankCount = (q.passage.match(/___/g) || []).length;
    if (blankCount > 1) {
      input = Array.from({ length: blankCount }, (_, i) =>
        `<label class="listening-blank-label">
          Blank ${i + 1}
          <input class="assessment-text-input" type="text"
            name="${escapeHtml(q.id)}_b${i + 1}"
            placeholder="Fill in blank ${i + 1}"
            autocomplete="off">
        </label>`,
      ).join("");
    } else {
      input = `<input class="assessment-text-input" type="text" name="${escapeHtml(q.id)}" placeholder="Fill in the blank" autocomplete="off">`;
    }
  } else if (q.skill === "speaking") {
    input = `
      <button type="button" class="record-speak-button" data-speaking-id="${escapeHtml(q.id)}">
        🎤 Start recording
      </button>
      <p class="speaking-transcript" id="transcript-${escapeHtml(q.id)}">
        Press the button, then read the text above clearly.
      </p>
      <input type="hidden" name="${escapeHtml(q.id)}" value="">`;
  } else if (q.type === "multiple_choice" && Array.isArray(q.options)) {
    input = q.options
      .map(
        (opt) =>
          `<label class="radio-option"><input type="radio" name="${escapeHtml(q.id)}" value="${escapeHtml(opt)}"> ${escapeHtml(opt)}</label>`,
      )
      .join("");
  } else {
    input = `<input class="assessment-text-input" type="text" name="${escapeHtml(q.id)}" placeholder="Your answer" autocomplete="off">`;
  }

  return `<div class="assessment-question">
    <span class="question-skill">${escapeHtml(skillLabel[q.skill] || q.skill)}</span>
    ${passageHtml}
    <p class="question-prompt">${escapeHtml(q.prompt)}</p>
    ${input}
  </div>`;
}

function applyPlacementResult(result) {
  state.placement = { ...result, goal: state.studentProfile?.goal || "" };
  localStorage.setItem("fluentpath:placement", JSON.stringify(state.placement));
  renderProgressMetrics();
  updatePlacementUI();
}

async function startPlacementTest() {
  placementEmpty.hidden = true;
  placementResult.hidden = true;
  placementTestSection.hidden = false;
  placementTestForm.hidden = true;
  placementTestStatus.textContent = "Generating your test…";
  placementTestError.hidden = true;

  try {
    const { questions } = await apiRequest("/api/placement/questions");
    state.placementQuestions = questions;
    placementQuestions.innerHTML = questions.map(renderPlacementQuestion).join("");
    placementTestStatus.textContent = `${questions.length} questions — answer all and click Submit.`;
    placementTestForm.hidden = false;
  } catch (error) {
    placementTestStatus.textContent = "Could not load the test. Try again.";
    placementEmpty.hidden = false;
  }
}

startPlacementButton.addEventListener("click", startPlacementTest);
retakePlacementButton.addEventListener("click", startPlacementTest);

placementQuestions.addEventListener("click", (event) => {
  const listenBtn = event.target.closest(".listen-button");
  if (listenBtn) {
    const passage = document.getElementById(listenBtn.dataset.passageId);
    if (passage) speakText(passage.dataset.text);
    return;
  }

  const recordBtn = event.target.closest(".record-speak-button");
  if (recordBtn) {
    startSpeechRecognition(recordBtn.dataset.speakingId);
  }
});

placementTestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  placementTestError.hidden = true;

  const formData = new FormData(placementTestForm);
  const rawAnswers = {};
  for (const [key, value] of formData.entries()) {
    const blankMatch = key.match(/^(.+)_b(\d+)$/);
    if (blankMatch) {
      const baseId = blankMatch[1];
      const idx = Number(blankMatch[2]) - 1;
      if (!rawAnswers[baseId]) rawAnswers[baseId] = [];
      rawAnswers[baseId][idx] = value.toString().trim();
    } else {
      rawAnswers[key] = value.toString().trim();
    }
  }
  const answers = {};
  for (const [key, val] of Object.entries(rawAnswers)) {
    answers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }

  const submitButton = placementTestForm.querySelector("[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Evaluating…";

  try {
    const result = await apiRequest("/api/placement", {
      method: "POST",
      body: JSON.stringify({ questions: state.placementQuestions, answers }),
    });
    applyPlacementResult(result);
  } catch (error) {
    placementTestError.textContent = error.message || "Could not evaluate the test. Try again.";
    placementTestError.hidden = false;
    submitButton.disabled = false;
    submitButton.textContent = "Submit answers";
  }
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

adminAssignmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminAssignment();
});

newPhraseButton.addEventListener("click", choosePhrase);
recordVoiceButton.addEventListener("click", recordVoiceSample);
audioClassButton.addEventListener("click", () => startClassRecording("audio"));
videoClassButton.addEventListener("click", () => startClassRecording("video"));
stopClassButton.addEventListener("click", stopClassRecording);

async function pollRecordingStatus(recordingId, intervalMs = 4000, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      const rec = await apiRequest(`/api/recordings/${recordingId}`);
      if (rec.processingStatus === "analyzed") return rec;
      if (rec.processingStatus === "failed") throw new Error("Analysis failed on the server.");
      const statusLabels = {
        uploaded: "Uploading…",
        transcribing: "Transcribing audio with Whisper…",
        transcribed: "Transcript ready. Analyzing with AI Teacher…",
        analyzing: "AI Teacher is analyzing the lesson…",
      };
      lessonAnalysisStatus.textContent = statusLabels[rec.processingStatus] || "Processing…";
    } catch (error) {
      throw error;
    }
  }
  throw new Error("Analysis is taking longer than expected. Please try again later.");
}

function renderLessonAnalysis(analysis) {
  const parsed = typeof analysis === "string" ? JSON.parse(analysis) : analysis;

  lessonAnalysisSummary.textContent = parsed.summary || "";

  if (parsed.studentMistakes?.length > 0) {
    lessonMistakesList.innerHTML = parsed.studentMistakes
      .map((m) => `<li><strong>${escapeHtml(m.type)}:</strong> "${escapeHtml(m.example)}" → <em>${escapeHtml(m.correction)}</em>${m.note ? ` — ${escapeHtml(m.note)}` : ""}</li>`)
      .join("");
    lessonMistakesSection.hidden = false;
  }

  if (parsed.newVocabulary?.length > 0) {
    lessonVocabList.innerHTML = parsed.newVocabulary
      .map((w) => `<li>${escapeHtml(w)}</li>`)
      .join("");
    lessonVocabSection.hidden = false;
  }

  if (parsed.practiceRecommendations?.length > 0) {
    lessonRecommendationsList.innerHTML = parsed.practiceRecommendations
      .map((r) => `<li>${escapeHtml(r)}</li>`)
      .join("");
    lessonRecommendationsSection.hidden = false;
  }

  lessonAnalysisResult.hidden = false;
}

uploadRecordingButton.addEventListener("click", async () => {
  const blob = state.classRecordingBlob;
  if (!blob) return;

  uploadRecordingButton.disabled = true;
  uploadRecordingSection.hidden = true;
  lessonAnalysisPanel.hidden = false;
  lessonAnalysisResult.hidden = true;
  lessonMistakesSection.hidden = true;
  lessonVocabSection.hidden = true;
  lessonRecommendationsSection.hidden = true;
  lessonAnalysisStatus.textContent = "Uploading audio…";

  try {
    const { recordingId } = await fetch("/api/recordings", {
      method: "POST",
      headers: { "Content-Type": blob.type || "audio/webm" },
      body: blob,
      credentials: "same-origin",
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      return data;
    });

    lessonAnalysisStatus.textContent = "Upload complete. Transcribing audio with Whisper…";

    const analyzed = await pollRecordingStatus(recordingId);

    if (analyzed?.analysis) {
      lessonAnalysisStatus.textContent = "✓ Lesson analyzed by your AI Teacher.";
      renderLessonAnalysis(analyzed.analysis);
    } else {
      lessonAnalysisStatus.textContent = "✓ Lesson processed. Analysis will appear shortly.";
    }

    state.classRecordingBlob = null;
  } catch (error) {
    lessonAnalysisStatus.textContent = `Error: ${error.message}`;
    uploadRecordingButton.disabled = false;
    uploadRecordingSection.hidden = false;
  }
});

adminLevelSuggestionRows.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-review-student]");
  if (!button) return;
  const studentId = button.dataset.adminReviewStudent;
  const action = button.dataset.adminReviewAction;
  try {
    await apiRequest(`/api/admin/level-suggestions/${encodeURIComponent(studentId)}/${action}`, {
      method: "POST",
      body: "{}",
    });
    adminLevelSuggestionFeedback.textContent =
      action === "approve" ? "Level updated." : "Suggestion dismissed.";
    renderAdminSummary();
  } catch (error) {
    adminLevelSuggestionFeedback.textContent = error.message;
  }
});

levelSuggestionRows.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-review-student]");
  if (!button) return;
  const studentId = button.dataset.reviewStudent;
  const action = button.dataset.reviewAction;
  try {
    await apiRequest(`/api/teacher/level-suggestions/${encodeURIComponent(studentId)}/${action}`, {
      method: "POST",
      body: "{}",
    });
    levelSuggestionFeedback.textContent =
      action === "approve" ? "Level updated." : "Suggestion dismissed.";
    renderTeacherSummary();
  } catch (error) {
    levelSuggestionFeedback.textContent = error.message;
  }
});

renderCourses();
renderLessons();
renderPracticePhrase(phrases[0]);
refreshSessionCopy();
handleRouteChange();
