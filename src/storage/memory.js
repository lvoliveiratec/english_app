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
        assignmentStatus: "assigned",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    teacherProfiles: [
      { userId: teacherId, fullName: "Ana Teacher", specialty: "Pronunciation", status: "active" },
    ],
    adminProfiles: [{ userId: adminId, fullName: "Admin", status: "active" }],
    teacherStudentAssignments: [
      {
        id: createId("assign"),
        teacherId,
        studentId,
        status: "active",
        source: "seed",
        assignedByAdminId: null,
        notes: "Demo assignment for teacher dashboard.",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    teacherInvites: [
      {
        id: createId("invite"),
        teacherId,
        code: "ANA-TEACHER",
        status: "active",
        maxUses: null,
        usedCount: 0,
        expiresAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
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
    placements: [],
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

  async createStudentAccount({ email, password, profile, inviteCode = "" }) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = this.state.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      const error = new Error("Email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const invite = inviteCode ? this.getValidInvite(inviteCode) : null;
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
      assignmentStatus: invite ? "assigned" : "pending_assignment",
      createdAt: now,
      updatedAt: now,
    };

    this.state.users.push(user);
    this.state.studentProfiles.push(studentProfile);
    this.upsertAddress(userId, profile.address || {});

    if (invite) {
      this.assignStudentToTeacher({
        teacherId: invite.teacherId,
        studentId: userId,
        source: "invite",
        notes: "Assigned automatically through teacher invite link.",
      });
      invite.usedCount += 1;
      invite.updatedAt = now;
    }

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

  async getTeacherSummary(teacherId) {
    const user = this.state.users.find((item) => item.id === teacherId && item.role === "teacher");
    const profile = this.state.teacherProfiles.find((item) => item.userId === teacherId);
    const assignments = this.state.teacherStudentAssignments.filter(
      (item) => item.teacherId === teacherId && item.status === "active",
    );
    const assignedStudents = assignments.map((assignment) => {
      const student = this.state.users.find((item) => item.id === assignment.studentId);
      const studentProfile = this.state.studentProfiles.find(
        (item) => item.userId === assignment.studentId,
      );
      const progress = this.state.lessonProgress.find(
        (item) => item.studentId === assignment.studentId,
      );

      return {
        studentId: assignment.studentId,
        studentName: studentProfile?.fullName || student?.displayName || "Student",
        level: studentProfile?.level || "Unknown",
        goal: studentProfile?.goal || "Unknown",
        completion: progress?.completion || 0,
        difficulty: progress?.difficulty || "Needs first lesson data",
        recommendation: progress?.recommendation || "Complete placement and first lesson.",
        notes: assignment.notes || "",
      };
    });
    const studentsNeedingAttention = assignedStudents.filter((student) => student.completion < 70);

    return {
      storage: this.kind,
      teacher: {
        id: teacherId,
        fullName: profile?.fullName || user?.displayName || "Teacher",
        specialty: profile?.specialty || "General English",
        status: profile?.status || "active",
      },
      invite: this.getOrCreateTeacherInvite(teacherId),
      totals: {
        assignedStudents: assignedStudents.length,
        activeStudents: assignedStudents.length,
        studentsNeedingAttention: studentsNeedingAttention.length,
        pendingSummaries: studentsNeedingAttention.length,
      },
      assignedStudents,
      levelSuggestions: assignedStudents
        .map((s) => {
          const profile = this.state.studentProfiles.find((p) => p.userId === s.studentId);
          if (!profile || profile.levelReviewStatus !== "pending" || !profile.suggestedLevel) return null;
          return { studentId: s.studentId, studentName: s.studentName, currentLevel: profile.level, suggestedLevel: profile.suggestedLevel };
        })
        .filter(Boolean),
      nextActions: assignedStudents.length
        ? [
            "Review students with completion below 70%.",
            "Prepare one short speaking correction for the next class.",
            "Confirm consent before any class recording.",
          ]
        : [
            "Ask an administrator to assign students to this teacher.",
            "Add a teacher-student assignment before showing private learning data.",
          ],
    };
  }

  async getAdminResources() {
    const activeAssignments = this.state.teacherStudentAssignments.filter(
      (assignment) => assignment.status === "active",
    );

    return {
      students: this.state.users
        .filter((user) => user.role === "student")
        .map((user) => {
          const profile = this.state.studentProfiles.find((item) => item.userId === user.id);
          const assignment = activeAssignments.find((item) => item.studentId === user.id);
          const teacherProfile = assignment
            ? this.state.teacherProfiles.find((item) => item.userId === assignment.teacherId)
            : null;

          return {
            id: user.id,
            email: user.email,
            fullName: profile?.fullName || user.displayName,
            level: profile?.level || "",
            goal: profile?.goal || "",
            assignmentStatus: profile?.assignmentStatus || "pending_assignment",
            teacherId: assignment?.teacherId || "",
            teacherName: teacherProfile?.fullName || "",
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
      assignments: activeAssignments.map((assignment) => {
        const studentProfile = this.state.studentProfiles.find(
          (item) => item.userId === assignment.studentId,
        );
        const teacherProfile = this.state.teacherProfiles.find(
          (item) => item.userId === assignment.teacherId,
        );

        return {
          id: assignment.id,
          studentId: assignment.studentId,
          studentName: studentProfile?.fullName || "Student",
          teacherId: assignment.teacherId,
          teacherName: teacherProfile?.fullName || "Teacher",
          source: assignment.source || "manual",
          notes: assignment.notes || "",
        };
      }),
    };
  }

  async createAdminAssignment(data, adminId) {
    const student = this.state.users.find(
      (item) => item.id === data.studentId && item.role === "student",
    );
    const teacher = this.state.users.find(
      (item) => item.id === data.teacherId && item.role === "teacher",
    );

    if (!student || !teacher) {
      const error = new Error("Student and teacher are required.");
      error.statusCode = 400;
      throw error;
    }

    const assignment = this.assignStudentToTeacher({
      teacherId: data.teacherId,
      studentId: data.studentId,
      assignedByAdminId: adminId,
      source: "manual",
      notes: data.notes || "Assigned by admin.",
    });
    const studentProfile = this.state.studentProfiles.find((item) => item.userId === data.studentId);
    const teacherProfile = this.state.teacherProfiles.find((item) => item.userId === data.teacherId);

    return {
      id: assignment.id,
      studentId: data.studentId,
      studentName: studentProfile?.fullName || student.displayName,
      teacherId: data.teacherId,
      teacherName: teacherProfile?.fullName || teacher.displayName,
      source: assignment.source,
      notes: assignment.notes,
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
    this.getOrCreateTeacherInvite(userId);
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

  getValidInvite(code) {
    const normalizedCode = code.toString().trim().toUpperCase();
    const invite = this.state.teacherInvites.find((item) => item.code === normalizedCode);
    const teacher = invite && this.state.users.find((item) => item.id === invite.teacherId);

    if (
      !invite ||
      invite.status !== "active" ||
      teacher?.role !== "teacher" ||
      (invite.expiresAt && new Date(invite.expiresAt) <= new Date()) ||
      (Number.isFinite(invite.maxUses) && invite.usedCount >= invite.maxUses)
    ) {
      const error = new Error("Invite link is invalid or inactive.");
      error.statusCode = 400;
      throw error;
    }

    return invite;
  }

  async getTeacherInviteByCode(code) {
    let invite;

    try {
      invite = this.getValidInvite(code);
    } catch (error) {
      return null;
    }

    const profile = this.state.teacherProfiles.find((item) => item.userId === invite.teacherId);

    return {
      code: invite.code,
      teacher: {
        id: invite.teacherId,
        fullName: profile?.fullName || "Teacher",
        specialty: profile?.specialty || "General English",
      },
    };
  }

  getOrCreateTeacherInvite(teacherId) {
    const existing = this.state.teacherInvites.find(
      (item) => item.teacherId === teacherId && item.status === "active",
    );

    if (existing) {
      return {
        code: existing.code,
        status: existing.status,
        usedCount: existing.usedCount,
        maxUses: existing.maxUses,
        expiresAt: existing.expiresAt,
      };
    }

    const teacher = this.state.teacherProfiles.find((item) => item.userId === teacherId);
    const base = (teacher?.fullName || "TEACHER")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24);
    const invite = {
      id: createId("invite"),
      teacherId,
      code: `${base || "TEACHER"}-${createToken().slice(0, 6).toUpperCase()}`,
      status: "active",
      maxUses: null,
      usedCount: 0,
      expiresAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    this.state.teacherInvites.push(invite);
    return {
      code: invite.code,
      status: invite.status,
      usedCount: invite.usedCount,
      maxUses: invite.maxUses,
      expiresAt: invite.expiresAt,
    };
  }

  assignStudentToTeacher({
    teacherId,
    studentId,
    assignedByAdminId = null,
    source = "manual",
    notes = "",
  }) {
    this.state.teacherStudentAssignments.forEach((assignment) => {
      if (assignment.studentId === studentId && assignment.teacherId !== teacherId) {
        assignment.status = "inactive";
        assignment.updatedAt = nowIso();
      }
    });

    const existing = this.state.teacherStudentAssignments.find(
      (item) => item.teacherId === teacherId && item.studentId === studentId,
    );
    let assignment = existing;

    if (existing) {
      existing.status = "active";
      existing.source = source || existing.source || "manual";
      existing.assignedByAdminId = assignedByAdminId || existing.assignedByAdminId || null;
      existing.notes = notes || existing.notes;
      existing.updatedAt = nowIso();
    } else {
      assignment = {
        id: createId("assign"),
        teacherId,
        studentId,
        status: "active",
        source,
        assignedByAdminId,
        notes,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      this.state.teacherStudentAssignments.push(assignment);
    }

    const profile = this.state.studentProfiles.find((item) => item.userId === studentId);

    if (profile) {
      profile.assignmentStatus = "assigned";
      profile.updatedAt = nowIso();
    }

    return assignment;
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

  async createLevelSuggestion(studentId, { currentLevel, suggestedLevel, reason }) {
    const profile = this.state.studentProfiles.find((item) => item.userId === studentId);
    if (profile) {
      profile.suggestedLevel = suggestedLevel;
      profile.levelReviewStatus = "pending";
    }
  }

  async reviewLevelSuggestion(studentId, action) {
    const profile = this.state.studentProfiles.find((item) => item.userId === studentId);
    if (!profile) return;
    if (action === "approve" && profile.suggestedLevel) {
      profile.level = profile.suggestedLevel;
    }
    profile.suggestedLevel = null;
    profile.levelReviewStatus = action === "approve" ? "approved" : "dismissed";
  }

  async savePlacement(studentId, { feedback, level, priorities, score, questions, answers }) {
    if (!this.state.placements) this.state.placements = [];
    const id = `pl_${Date.now()}`;
    this.state.placements.push({ id, studentId, feedback, level, priorities, score: score ?? null, questions: questions || [], answers: answers || {}, createdAt: nowIso() });
  }

  async getPlacementById(placementId, studentId) {
    const entry = (this.state.placements || []).find((p) => p.id === placementId && p.studentId === studentId);
    if (!entry) return null;
    return { id: entry.id, feedback: entry.feedback, priorities: entry.priorities, score: entry.score, level: entry.level, questions: entry.questions || [], answers: entry.answers || {}, createdAt: entry.createdAt };
  }

  async getAllPlacements(studentId) {
    return [...(this.state.placements || [])]
      .filter((p) => p.studentId === studentId)
      .reverse()
      .map((p) => ({ id: p.id, feedback: p.feedback, priorities: p.priorities, score: p.score, level: p.level, createdAt: p.createdAt }));
  }

  async getLatestPlacement(studentId) {
    const entry = [...this.state.placements]
      .reverse()
      .find((item) => item.studentId === studentId);
    if (!entry) return null;
    return { feedback: entry.feedback, level: entry.level, priorities: entry.priorities, score: entry.score, createdAt: entry.createdAt };
  }

  async createLessonRecording({ studentId, audioPath, audioMime, fileSizeBytes }) {
    const recording = {
      id: `rec_${Date.now()}`,
      studentId,
      teacherId: null,
      audioPath,
      audioMime,
      fileSizeBytes,
      durationSeconds: null,
      transcript: null,
      processingStatus: "uploaded",
      createdAt: nowIso(),
    };
    if (!this.state.lessonRecordings) this.state.lessonRecordings = [];
    this.state.lessonRecordings.push(recording);
    return recording;
  }

  async getLessonRecording(recordingId) {
    return (this.state.lessonRecordings || []).find((r) => r.id === recordingId) || null;
  }

  async updateLessonRecording(recordingId, { processingStatus, transcript } = {}) {
    const rec = (this.state.lessonRecordings || []).find((r) => r.id === recordingId);
    if (!rec) return;
    if (processingStatus !== undefined) rec.processingStatus = processingStatus;
    if (transcript !== undefined) rec.transcript = transcript;
  }

  async saveRecordingAnalysis(recordingId, studentId, analysis) {
    const rec = (this.state.lessonRecordings || []).find((r) => r.id === recordingId);
    if (rec) rec.analysis = analysis;
    if (!this.state.aiFeedback) this.state.aiFeedback = [];
    this.state.aiFeedback.push({
      id: `feedback_${Date.now()}`,
      studentId,
      sourceType: "lesson_recording",
      sourceId: recordingId,
      summary: analysis.summary || "",
      recommendations: analysis.practiceRecommendations || [],
      createdAt: nowIso(),
    });
  }

  async getTeacherForStudent(studentId) {
    const assignment = this.state.teacherStudentAssignments.find(
      (a) => a.studentId === studentId && a.status === "active",
    );
    if (!assignment) return null;
    const profile = this.state.teacherProfiles.find((p) => p.userId === assignment.teacherId);
    return profile ? { id: assignment.teacherId, fullName: profile.fullName, specialty: profile.specialty } : null;
  }

  async getLatestLessonAnalysis(studentId) {
    if (!this.state.aiFeedback) return null;
    return (
      [...this.state.aiFeedback]
        .reverse()
        .find((f) => f.studentId === studentId && f.sourceType === "lesson_recording") || null
    );
  }
}

module.exports = {
  MemoryStorage,
};
