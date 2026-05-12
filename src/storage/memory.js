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
    payments: [{ userId: studentId, status: "paid", amountCents: 5900, paidAt: nowIso() }],
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

  getProfileForUser(user) {
    if (user.role === "student") {
      return this.state.studentProfiles.find((profile) => profile.userId === user.id) || null;
    }

    if (user.role === "teacher") {
      return this.state.teacherProfiles.find((profile) => profile.userId === user.id) || null;
    }

    return this.state.adminProfiles.find((profile) => profile.userId === user.id) || null;
  }

  toSessionPayload(user, profile) {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      profile,
    };
  }
}

module.exports = {
  MemoryStorage,
};
