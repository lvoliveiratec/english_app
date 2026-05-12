const { createId, createToken, hashPassword, verifyPassword } = require("../security");

function nowIso() {
  return new Date().toISOString();
}

function createDemoState() {
  const studentId = createId("usr");
  const teacherId = createId("usr");
  const adminId = createId("usr");

  return {
    users: [
      {
        id: studentId,
        email: "lucas@example.com",
        passwordHash: hashPassword("english123"),
        role: "student",
        displayName: "Lucas",
        phone: "+1 555 0100",
        createdAt: nowIso(),
      },
      {
        id: teacherId,
        email: "teacher@example.com",
        passwordHash: hashPassword("teacher123"),
        role: "teacher",
        displayName: "Ana Teacher",
        createdAt: nowIso(),
      },
      {
        id: adminId,
        email: "admin@example.com",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        displayName: "Admin",
        createdAt: nowIso(),
      },
    ],
    studentProfiles: [
      {
        userId: studentId,
        fullName: "Lucas",
        age: "",
        nativeLanguage: "Portuguese",
        level: "Beginner",
        goal: "Daily conversation",
        confidence: "Comfortable with simple phrases",
        studyTime: "20 minutes a day",
        interests: ["Movies and series", "Work and business"],
        favoriteMedia: "Business videos and short series.",
        hobbies: "Technology and language practice.",
        foodAndDrinks: "Coffee and pizza.",
        sports: "Gym",
        motivation: "Improve English for real conversations.",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    teacherProfiles: [{ userId: teacherId, fullName: "Ana Teacher", status: "active" }],
    adminProfiles: [{ userId: adminId, fullName: "Admin", status: "active" }],
    addresses: [
      {
        userId: studentId,
        label: "primary",
        line1: "123 Main Street",
        line2: "",
        city: "Calgary",
        region: "AB",
        postalCode: "T2P 1J9",
        country: "Canada",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    sessions: [],
    lessonProgress: [
      {
        studentId,
        skill: "Pronunciation",
        status: "in_progress",
        completion: 64,
        difficulty: "word endings",
        recommendation: "Practice final consonants and short conversation answers.",
        updatedAt: nowIso(),
      },
    ],
    pronunciationAttempts: [],
    payments: [{ userId: studentId, status: "paid", amountCents: 5900, paidAt: nowIso() }],
    plans: [
      {
        id: createId("plan"),
        name: "Monthly English",
        priceCents: 5900,
        billingCycle: "monthly",
        description: "Standard monthly plan for individual students.",
        status: "active",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    courses: [
      {
        id: createId("course"),
        title: "English Foundations",
        level: "Beginner",
        duration: "6 weeks",
        description: "Essential vocabulary, phrases, and grammar for beginners.",
        status: "published",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
  };
}

class MemoryStorage {
  constructor() {
    this.kind = "memory";
    this.state = createDemoState();
  }

  async health() {
    return { ok: true, storage: this.kind };
  }

  async createStudentAccount({ email, password, profile }) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = this.state.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      const error = new Error("Email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const userId = createId("usr");
    const now = nowIso();
    const user = {
      id: userId,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: "student",
      displayName: profile.fullName.split(" ")[0] || profile.fullName,
      phone: profile.phone || "",
      createdAt: now,
    };
    const studentProfile = {
      userId,
      ...profile,
      createdAt: now,
      updatedAt: now,
    };

    this.state.users.push(user);
    this.state.studentProfiles.push(studentProfile);
    this.upsertAddress(userId, profile.address || {});

    return this.toSessionPayload(user, studentProfile);
  }

  async login({ email, password }) {
    const user = this.state.users.find((item) => item.email === email.toLowerCase());

    if (!user || !verifyPassword(password, user.passwordHash)) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const profile = this.getProfileForUser(user);
    return this.toSessionPayload(user, profile);
  }

  async createSession(userId) {
    const token = createToken();
    this.state.sessions.push({ token, userId, createdAt: nowIso() });
    return token;
  }

  async getSession(token) {
    const session = this.state.sessions.find((item) => item.token === token);

    if (!session) {
      return null;
    }

    const user = this.state.users.find((item) => item.id === session.userId);

    if (!user) {
      return null;
    }

    return this.toSessionPayload(user, this.getProfileForUser(user));
  }

  async deleteSession(token) {
    this.state.sessions = this.state.sessions.filter((item) => item.token !== token);
  }

  async updateAccount(userId, data) {
    const user = this.state.users.find((item) => item.id === userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.email = data.email?.toLowerCase() || user.email;
    user.phone = data.phone || "";
    user.displayName = data.fullName?.split(" ")[0] || user.displayName;

    const profile = this.getProfileForUser(user);

    if (profile?.fullName && data.fullName) {
      profile.fullName = data.fullName;
      profile.updatedAt = nowIso();
    }

    this.upsertAddress(userId, data.address || {});
    return this.toSessionPayload(user, this.getProfileForUser(user));
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = this.state.users.find((item) => item.id === userId);

    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      const error = new Error("Current password is incorrect.");
      error.statusCode = 401;
      throw error;
    }

    user.passwordHash = hashPassword(newPassword);
    return { ok: true };
  }

  async getAdminSummary() {
    const students = this.state.users.filter((user) => user.role === "student");
    const teachers = this.state.users.filter((user) => user.role === "teacher");
    const admins = this.state.users.filter((user) => user.role === "admin");
    const paidRevenue = this.state.payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + payment.amountCents, 0);

    return {
      storage: this.kind,
      totals: {
        students: students.length,
        teachers: teachers.length,
        admins: admins.length,
        activeStudents: students.length,
        pendingPayments: this.state.payments.filter((payment) => payment.status === "pending")
          .length,
        monthlyRevenueCents: paidRevenue,
      },
      studentProgress: students.map((student) => {
        const profile = this.state.studentProfiles.find((item) => item.userId === student.id);
        const progress = this.state.lessonProgress.find((item) => item.studentId === student.id);

        return {
          studentName: profile?.fullName || student.displayName,
          level: profile?.level || "Unknown",
          goal: profile?.goal || "Unknown",
          completion: progress?.completion || 0,
          difficulty: progress?.difficulty || "Needs first lesson data",
          recommendation: progress?.recommendation || "Complete placement and first lesson.",
        };
      }),
      recentActivity: [
        "Student profile created",
        "Pronunciation practice available",
        "Consent workflow pending backend storage",
      ],
    };
  }

  async createPronunciationAttempt(studentId, data) {
    const attempt = {
      id: createId("attempt"),
      studentId,
      phrase: data.phrase,
      durationSeconds: data.durationSeconds || 0,
      localSizeBytes: data.localSizeBytes || 0,
      audioStorageUrl: "",
      transcript: "",
      processingStatus: "recorded_locally",
      createdAt: nowIso(),
    };

    this.state.pronunciationAttempts.push(attempt);
    return attempt;
  }

  async getAdminResources() {
    return {
      students: this.state.users
        .filter((user) => user.role === "student")
        .map((user) => {
          const profile = this.state.studentProfiles.find((item) => item.userId === user.id);
          return {
            id: user.id,
            email: user.email,
            fullName: profile?.fullName || user.displayName,
            level: profile?.level || "",
            goal: profile?.goal || "",
            status: "active",
          };
        }),
      teachers: this.state.users
        .filter((user) => user.role === "teacher")
        .map((user) => {
          const profile = this.state.teacherProfiles.find((item) => item.userId === user.id);
          return {
            id: user.id,
            email: user.email,
            fullName: profile?.fullName || user.displayName,
            specialty: profile?.specialty || "",
            status: profile?.status || "active",
          };
        }),
      plans: this.state.plans,
      courses: this.state.courses,
    };
  }

  async createAdminStudent(data) {
    const payload = await this.createStudentAccount({
      email: data.email,
      password: data.password || "english123",
      profile: {
        fullName: data.fullName,
        age: "",
        nativeLanguage: data.nativeLanguage || "Portuguese",
        level: data.level || "Beginner",
        goal: data.goal || "Daily conversation",
        confidence: data.confidence || "",
        studyTime: data.studyTime || "",
        interests: [],
        favoriteMedia: "",
        hobbies: "",
        foodAndDrinks: "",
        sports: "",
        motivation: data.notes || "",
      },
    });
    return payload.user;
  }

  async updateAdminStudent(id, data) {
    const user = this.state.users.find((item) => item.id === id && item.role === "student");
    const profile = this.state.studentProfiles.find((item) => item.userId === id);

    if (!user || !profile) {
      const error = new Error("Student not found.");
      error.statusCode = 404;
      throw error;
    }

    user.email = data.email?.toLowerCase() || user.email;
    user.displayName = data.fullName?.split(" ")[0] || user.displayName;
    profile.fullName = data.fullName || profile.fullName;
    profile.nativeLanguage = data.nativeLanguage || profile.nativeLanguage;
    profile.level = data.level || profile.level;
    profile.goal = data.goal || profile.goal;
    profile.motivation = data.notes || profile.motivation;
    profile.updatedAt = nowIso();

    return { id: user.id, email: user.email, fullName: profile.fullName };
  }

  async createAdminTeacher(data) {
    const normalizedEmail = data.email.toLowerCase();

    if (this.state.users.some((user) => user.email === normalizedEmail)) {
      const error = new Error("Email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const userId = createId("usr");
    const user = {
      id: userId,
      email: normalizedEmail,
      passwordHash: hashPassword(data.password || "teacher123"),
      role: "teacher",
      displayName: data.fullName.split(" ")[0] || data.fullName,
      createdAt: nowIso(),
    };
    const profile = {
      userId,
      fullName: data.fullName,
      specialty: data.specialty || "",
      status: data.status || "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    this.state.users.push(user);
    this.state.teacherProfiles.push(profile);
    return { id: user.id, email: user.email, fullName: profile.fullName };
  }

  async updateAdminTeacher(id, data) {
    const user = this.state.users.find((item) => item.id === id && item.role === "teacher");
    const profile = this.state.teacherProfiles.find((item) => item.userId === id);

    if (!user || !profile) {
      const error = new Error("Teacher not found.");
      error.statusCode = 404;
      throw error;
    }

    user.email = data.email?.toLowerCase() || user.email;
    user.displayName = data.fullName?.split(" ")[0] || user.displayName;
    profile.fullName = data.fullName || profile.fullName;
    profile.specialty = data.specialty || profile.specialty || "";
    profile.status = data.status || profile.status;
    profile.updatedAt = nowIso();

    return { id: user.id, email: user.email, fullName: profile.fullName };
  }

  async createAdminPlan(data) {
    const plan = {
      id: createId("plan"),
      name: data.name,
      priceCents: data.priceCents || 0,
      billingCycle: data.billingCycle || "monthly",
      description: data.description || "",
      status: data.status || "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.state.plans.push(plan);
    return plan;
  }

  async updateAdminPlan(id, data) {
    const plan = this.state.plans.find((item) => item.id === id);

    if (!plan) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }

    Object.assign(plan, {
      name: data.name || plan.name,
      priceCents: Number.isFinite(data.priceCents) ? data.priceCents : plan.priceCents,
      billingCycle: data.billingCycle || plan.billingCycle,
      description: data.description || plan.description,
      status: data.status || plan.status,
      updatedAt: nowIso(),
    });
    return plan;
  }

  async createAdminCourse(data) {
    const course = {
      id: createId("course"),
      title: data.title,
      level: data.level || "",
      duration: data.duration || "",
      description: data.description || "",
      status: data.status || "draft",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.state.courses.push(course);
    return course;
  }

  async updateAdminCourse(id, data) {
    const course = this.state.courses.find((item) => item.id === id);

    if (!course) {
      const error = new Error("Course not found.");
      error.statusCode = 404;
      throw error;
    }

    Object.assign(course, {
      title: data.title || course.title,
      level: data.level || course.level,
      duration: data.duration || course.duration,
      description: data.description || course.description,
      status: data.status || course.status,
      updatedAt: nowIso(),
    });
    return course;
  }

  getProfileForUser(user) {
    if (user.role === "student") {
      return this.state.studentProfiles.find((profile) => profile.userId === user.id) || null;
    }

    if (user.role === "teacher") {
      return this.state.teacherProfiles.find((profile) => profile.userId === user.id) || null;
    }

    return this.state.adminProfiles.find((profile) => profile.userId === user.id) || null;
  }

  getAddressForUser(userId) {
    return this.state.addresses.find((address) => address.userId === userId) || null;
  }

  upsertAddress(userId, address) {
    const existing = this.getAddressForUser(userId);
    const next = {
      userId,
      label: "primary",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      region: address.region || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      updatedAt: nowIso(),
    };

    if (existing) {
      Object.assign(existing, next);
      return existing;
    }

    this.state.addresses.push({ ...next, createdAt: nowIso() });
    return next;
  }

  toSessionPayload(user, profile) {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        phone: user.phone || "",
      },
      profile,
      address: this.getAddressForUser(user.id),
    };
  }
}

module.exports = {
  MemoryStorage,
};
