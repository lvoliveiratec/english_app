function normalizeStudentProfile(profile = {}) {
  return {
    fullName: profile.fullName?.toString().trim() || "Student",
    phone: profile.phone?.toString().trim() || "",
    age: profile.age?.toString().trim() || "",
    nativeLanguage: profile.nativeLanguage?.toString().trim() || "",
    level: profile.level?.toString() || "I am not sure yet",
    goal: profile.goal?.toString() || "Daily conversation",
    confidence: profile.confidence?.toString() || "",
    studyTime: profile.studyTime?.toString() || "",
    interests: Array.isArray(profile.interests)
      ? profile.interests.map((item) => item.toString())
      : [],
    favoriteMedia: profile.favoriteMedia?.toString().trim() || "",
    hobbies: profile.hobbies?.toString().trim() || "",
    foodAndDrinks: profile.foodAndDrinks?.toString().trim() || "",
    sports: profile.sports?.toString().trim() || "",
    motivation: profile.motivation?.toString().trim() || "",
    address: normalizeAddress(profile.address),
  };
}

function normalizeAddress(address = {}) {
  return {
    line1: address.line1?.toString().trim() || "",
    line2: address.line2?.toString().trim() || "",
    city: address.city?.toString().trim() || "",
    region: address.region?.toString().trim() || "",
    postalCode: address.postalCode?.toString().trim() || "",
    country: address.country?.toString().trim() || "",
  };
}

function normalizeAccount(body = {}) {
  return {
    fullName: body.fullName?.toString().trim() || "Student",
    email: body.email?.toString().trim() || "",
    phone: body.phone?.toString().trim() || "",
    address: normalizeAddress(body.address),
  };
}

function normalizePasswordChange(body = {}) {
  return {
    currentPassword: body.currentPassword?.toString() || "",
    newPassword: body.newPassword?.toString() || "",
  };
}

function normalizePronunciationAttempt(body = {}) {
  return {
    phrase: body.phrase?.toString().trim() || "",
    durationSeconds: Math.max(0, Math.round(Number(body.durationSeconds) || 0)),
    localSizeBytes: Math.max(0, Math.round(Number(body.localSizeBytes) || 0)),
  };
}

function normalizeAdminStudent(body = {}) {
  return {
    fullName: body.fullName?.toString().trim() || "Student",
    email: body.email?.toString().trim() || "",
    password: body.password?.toString() || "",
    nativeLanguage: body.nativeLanguage?.toString().trim() || "Portuguese",
    level: body.level?.toString() || "Beginner",
    goal: body.goal?.toString() || "Daily conversation",
    notes: body.notes?.toString().trim() || "",
  };
}

function normalizeAdminTeacher(body = {}) {
  return {
    fullName: body.fullName?.toString().trim() || "Teacher",
    email: body.email?.toString().trim() || "",
    password: body.password?.toString() || "",
    specialty: body.specialty?.toString().trim() || "",
    status: body.status?.toString() || "active",
  };
}

function normalizeAdminPlan(body = {}) {
  return {
    name: body.name?.toString().trim() || "Plan",
    priceCents: Math.max(0, Math.round(Number(body.priceCents) || 0)),
    billingCycle: body.billingCycle?.toString() || "monthly",
    description: body.description?.toString().trim() || "",
    status: body.status?.toString() || "active",
  };
}

function normalizeAdminCourse(body = {}) {
  return {
    title: body.title?.toString().trim() || "Course",
    level: body.level?.toString() || "",
    duration: body.duration?.toString().trim() || "",
    description: body.description?.toString().trim() || "",
    status: body.status?.toString() || "draft",
  };
}

module.exports = {
  normalizeAdminCourse,
  normalizeAdminPlan,
  normalizeAdminStudent,
  normalizeAdminTeacher,
  normalizeAccount,
  normalizeAddress,
  normalizePasswordChange,
  normalizePronunciationAttempt,
  normalizeStudentProfile,
};
