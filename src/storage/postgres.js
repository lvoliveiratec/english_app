const { Pool } = require("pg");
const { createToken, hashPassword, verifyPassword } = require("../security");

class PostgresStorage {
  constructor(connectionString) {
    this.kind = "postgres";
    this.pool = new Pool({ connectionString });
  }

  async health() {
    await this.pool.query("select 1");
    return { ok: true, storage: this.kind };
  }

  async createStudentAccount({ email, password, profile, inviteCode = "" }) {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const invite = inviteCode ? await this.getValidInvite(client, inviteCode) : null;
      const passwordHash = hashPassword(password);
      const displayName = profile.fullName.split(" ")[0] || profile.fullName;
      const userResult = await client.query(
        `
          insert into users (email, password_hash, role, display_name, phone)
          values ($1, $2, 'student', $3, $4)
          returning id, email, role, display_name, phone
        `,
        [email.toLowerCase(), passwordHash, displayName, profile.phone || ""],
      );
      const user = userResult.rows[0];
      const profileResult = await client.query(
        `
          insert into student_profiles (
            user_id,
            full_name,
            age,
            native_language,
            level,
            goal,
            confidence,
            study_time,
            interests,
            favorite_media,
            hobbies,
            food_and_drinks,
            sports,
            motivation,
            assignment_status
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          returning *
        `,
        [
          user.id,
          profile.fullName,
          profile.age ? Number(profile.age) : null,
          profile.nativeLanguage,
          profile.level,
          profile.goal,
          profile.confidence,
          profile.studyTime,
          profile.interests,
          profile.favoriteMedia,
          profile.hobbies,
          profile.foodAndDrinks,
          profile.sports,
          profile.motivation,
          invite ? "assigned" : "pending_assignment",
        ],
      );
      await this.upsertAddress(client, user.id, profile.address || {});

      if (invite) {
        await this.assignStudentToTeacher(client, {
          teacherId: invite.teacher_id,
          studentId: user.id,
          source: "invite",
          notes: "Assigned automatically through teacher invite link.",
        });
        await client.query(
          "update teacher_invites set used_count = used_count + 1, updated_at = now() where id = $1",
          [invite.id],
        );
      }

      await client.query("commit");

      return {
        user: this.mapUser(user),
        profile: this.mapStudentProfile(profileResult.rows[0]),
        address: await this.getAddressForUser(user.id, client),
      };
    } catch (error) {
      await client.query("rollback");

      if (error.code === "23505") {
        error.statusCode = 409;
        error.message = "Email already exists.";
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async login({ email, password }) {
    const result = await this.pool.query(
      "select id, email, role, display_name, phone, password_hash from users where email = $1",
      [email.toLowerCase()],
    );
    const user = result.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    return {
      user: this.mapUser(user),
      profile: await this.getProfileForUser(user),
      address: await this.getAddressForUser(user.id),
    };
  }

  async createSession(userId) {
    const token = createToken();
    await this.pool.query("insert into sessions (token, user_id) values ($1, $2)", [token, userId]);
    return token;
  }

  async getSession(token) {
    const result = await this.pool.query(
      `
        select users.id, users.email, users.role, users.display_name, users.phone
        from sessions
        join users on users.id = sessions.user_id
        where sessions.token = $1
      `,
      [token],
    );
    const user = result.rows[0];

    if (!user) {
      return null;
    }

    return {
      user: this.mapUser(user),
      profile: await this.getProfileForUser(user),
      address: await this.getAddressForUser(user.id),
    };
  }

  async deleteSession(token) {
    await this.pool.query("delete from sessions where token = $1", [token]);
  }

  async updateAccount(userId, data) {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const userResult = await client.query(
        `
          update users
          set email = $1, phone = $2, display_name = $3, updated_at = now()
          where id = $4
          returning id, email, role, display_name, phone
        `,
        [data.email.toLowerCase(), data.phone || "", data.fullName.split(" ")[0] || data.fullName, userId],
      );

      if (!userResult.rows[0]) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      if (userResult.rows[0].role === "student") {
        await client.query(
          "update student_profiles set full_name = $1, updated_at = now() where user_id = $2",
          [data.fullName, userId],
        );
      }

      await this.upsertAddress(client, userId, data.address || {});
      await client.query("commit");

      const user = userResult.rows[0];
      return {
        user: this.mapUser(user),
        profile: await this.getProfileForUser(user),
        address: await this.getAddressForUser(user.id),
      };
    } catch (error) {
      await client.query("rollback");

      if (error.code === "23505") {
        error.statusCode = 409;
        error.message = "Email already exists.";
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const result = await this.pool.query("select password_hash from users where id = $1", [userId]);
    const user = result.rows[0];

    if (!user || !verifyPassword(currentPassword, user.password_hash)) {
      const error = new Error("Current password is incorrect.");
      error.statusCode = 401;
      throw error;
    }

    await this.pool.query("update users set password_hash = $1, updated_at = now() where id = $2", [
      hashPassword(newPassword),
      userId,
    ]);
    return { ok: true };
  }

  async getAdminSummary() {
    const totalsResult = await this.pool.query(
      `
        select
          count(*) filter (where role = 'student')::int as students,
          count(*) filter (where role = 'teacher')::int as teachers,
          count(*) filter (where role = 'admin')::int as admins
        from users
      `,
    );
    const progressResult = await this.pool.query(
      `
        select
          student_profiles.user_id as student_id,
          student_profiles.full_name as student_name,
          student_profiles.level,
          student_profiles.goal,
          coalesce(max(lesson_progress.completion), 0)::int as completion,
          coalesce(max(lesson_progress.difficulty), 'Needs first lesson data') as difficulty,
          coalesce(max(lesson_progress.recommendation), 'Complete placement and first lesson.') as recommendation
        from student_profiles
        left join lesson_progress on lesson_progress.student_id = student_profiles.user_id
        group by student_profiles.user_id, student_profiles.full_name, student_profiles.level, student_profiles.goal
        order by student_profiles.updated_at desc
        limit 5
      `,
    );
    const paymentResult = await this.pool.query(
      `
        select
          coalesce(sum(amount_cents) filter (where status = 'paid'), 0)::int as monthly_revenue_cents,
          count(*) filter (where status = 'pending')::int as pending_payments
        from payments
      `,
    );

    const pendingSuggestionsResult = await this.pool.query(
      `select sp.user_id as student_id, sp.full_name as student_name,
              sp.level as current_level, sp.suggested_level
       from student_profiles sp
       where sp.level_review_status = 'pending' and sp.suggested_level is not null`,
    );

    const totals = totalsResult.rows[0];
    const payments = paymentResult.rows[0];

    return {
      storage: this.kind,
      totals: {
        students: totals.students,
        teachers: totals.teachers,
        admins: totals.admins,
        activeStudents: totals.students,
        pendingPayments: payments.pending_payments,
        monthlyRevenueCents: payments.monthly_revenue_cents,
      },
      studentProgress: progressResult.rows.map((row) => ({
        studentId: row.student_id,
        studentName: row.student_name,
        level: row.level,
        goal: row.goal,
        completion: row.completion,
        difficulty: row.difficulty,
        recommendation: row.recommendation,
      })),
      pendingLevelSuggestions: pendingSuggestionsResult.rows.map((row) => ({
        studentId: row.student_id,
        studentName: row.student_name,
        currentLevel: row.current_level,
        suggestedLevel: row.suggested_level,
      })),
      recentActivity: [
        "Backend summary loaded",
        "Student profile records available",
        "Consent workflow pending implementation",
      ],
    };
  }

  async createPronunciationAttempt(studentId, data) {
    const result = await this.pool.query(
      `
        insert into pronunciation_attempts (
          student_id, phrase, duration_seconds, local_size_bytes, processing_status
        )
        values ($1, $2, $3, $4, 'recorded_locally')
        returning id, student_id, phrase, duration_seconds, local_size_bytes,
          audio_storage_url, transcript, processing_status, created_at
      `,
      [
        studentId,
        data.phrase,
        data.durationSeconds || 0,
        data.localSizeBytes || 0,
      ],
    );

    return this.mapPronunciationAttempt(result.rows[0]);
  }

  async getTeacherSummary(teacherId) {
    const profileResult = await this.pool.query(
      `
        select users.id, users.email, users.display_name, teacher_profiles.full_name,
          teacher_profiles.specialty, teacher_profiles.status
        from users
        left join teacher_profiles on teacher_profiles.user_id = users.id
        where users.id = $1 and users.role = 'teacher'
      `,
      [teacherId],
    );
    const teacher = profileResult.rows[0];

    if (!teacher) {
      const error = new Error("Teacher not found.");
      error.statusCode = 404;
      throw error;
    }

    const studentsResult = await this.pool.query(
      `
        select
          teacher_student_assignments.student_id,
          student_profiles.full_name as student_name,
          student_profiles.level,
          student_profiles.goal,
          teacher_student_assignments.notes,
          coalesce(max(lesson_progress.completion), 0)::int as completion,
          coalesce(max(lesson_progress.difficulty), 'Needs first lesson data') as difficulty,
          coalesce(max(lesson_progress.recommendation), 'Complete placement and first lesson.') as recommendation
        from teacher_student_assignments
        join users students on students.id = teacher_student_assignments.student_id
          and students.role = 'student'
        join student_profiles on student_profiles.user_id = students.id
        left join lesson_progress on lesson_progress.student_id = students.id
        where teacher_student_assignments.teacher_id = $1
          and teacher_student_assignments.status = 'active'
        group by teacher_student_assignments.student_id, student_profiles.full_name,
          student_profiles.level, student_profiles.goal, teacher_student_assignments.notes,
          student_profiles.updated_at
        order by student_profiles.updated_at desc
      `,
      [teacherId],
    );
    const assignedStudents = studentsResult.rows.map((row) => ({
      studentId: row.student_id,
      studentName: row.student_name,
      level: row.level,
      goal: row.goal,
      completion: row.completion,
      difficulty: row.difficulty,
      recommendation: row.recommendation,
      notes: row.notes || "",
    }));
    const studentsNeedingAttention = assignedStudents.filter((student) => student.completion < 70);

    const suggestionsResult = await this.pool.query(
      `select sp.user_id as student_id, sp.full_name as student_name,
              sp.level as current_level, sp.suggested_level
       from student_profiles sp
       join teacher_student_assignments tsa on tsa.student_id = sp.user_id
       where tsa.teacher_id = $1 and tsa.status = 'active'
         and sp.level_review_status = 'pending' and sp.suggested_level is not null`,
      [teacherId],
    );
    const levelSuggestions = suggestionsResult.rows.map((row) => ({
      studentId: row.student_id,
      studentName: row.student_name,
      currentLevel: row.current_level,
      suggestedLevel: row.suggested_level,
    }));

    return {
      storage: this.kind,
      teacher: {
        id: teacher.id,
        email: teacher.email,
        fullName: teacher.full_name || teacher.display_name,
        specialty: teacher.specialty || "General English",
        status: teacher.status || "active",
      },
      invite: await this.getOrCreateTeacherInvite(teacherId),
      totals: {
        assignedStudents: assignedStudents.length,
        activeStudents: assignedStudents.length,
        studentsNeedingAttention: studentsNeedingAttention.length,
        pendingSummaries: studentsNeedingAttention.length,
      },
      assignedStudents,
      levelSuggestions,
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
    const [students, teachers, assignments, plans, courses] = await Promise.all([
      this.pool.query(
        `
          select users.id, users.email, student_profiles.full_name, student_profiles.level,
            student_profiles.goal, student_profiles.assignment_status, 'active' as status,
            teacher_student_assignments.teacher_id, teacher_profiles.full_name as teacher_name
          from users
          join student_profiles on student_profiles.user_id = users.id
          left join teacher_student_assignments on teacher_student_assignments.student_id = users.id
            and teacher_student_assignments.status = 'active'
          left join teacher_profiles on teacher_profiles.user_id = teacher_student_assignments.teacher_id
          where users.role = 'student'
          order by student_profiles.updated_at desc
        `,
      ),
      this.pool.query(
        `
          select users.id, users.email, teacher_profiles.full_name, teacher_profiles.specialty,
            teacher_profiles.status
          from users
          join teacher_profiles on teacher_profiles.user_id = users.id
          where users.role = 'teacher'
          order by teacher_profiles.updated_at desc
        `,
      ),
      this.pool.query(
        `
          select teacher_student_assignments.id, teacher_student_assignments.student_id,
            student_profiles.full_name as student_name, teacher_student_assignments.teacher_id,
            teacher_profiles.full_name as teacher_name, teacher_student_assignments.source,
            teacher_student_assignments.notes
          from teacher_student_assignments
          join student_profiles on student_profiles.user_id = teacher_student_assignments.student_id
          join teacher_profiles on teacher_profiles.user_id = teacher_student_assignments.teacher_id
          where teacher_student_assignments.status = 'active'
          order by teacher_student_assignments.updated_at desc
        `,
      ),
      this.pool.query(
        `
          select id, name, price_cents, billing_cycle, description, status
          from plans
          order by updated_at desc
        `,
      ),
      this.pool.query(
        `
          select id, title, level, duration, description, status
          from courses
          order by updated_at desc
        `,
      ),
    ]);

    return {
      students: students.rows.map((row) => ({
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        level: row.level,
        goal: row.goal,
        assignmentStatus: row.assignment_status,
        teacherId: row.teacher_id || "",
        teacherName: row.teacher_name || "",
        status: row.status,
      })),
      teachers: teachers.rows.map((row) => ({
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        specialty: row.specialty || "",
        status: row.status,
      })),
      plans: plans.rows.map((row) => ({
        id: row.id,
        name: row.name,
        priceCents: row.price_cents,
        billingCycle: row.billing_cycle,
        description: row.description || "",
        status: row.status,
      })),
      courses: courses.rows.map((row) => ({
        id: row.id,
        title: row.title,
        level: row.level || "",
        duration: row.duration || "",
        description: row.description || "",
        status: row.status,
      })),
      assignments: assignments.rows.map((row) => ({
        id: row.id,
        studentId: row.student_id,
        studentName: row.student_name,
        teacherId: row.teacher_id,
        teacherName: row.teacher_name,
        source: row.source || "manual",
        notes: row.notes || "",
      })),
    };
  }

  async createAdminAssignment(data, adminId) {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const student = await client.query("select id, display_name from users where id = $1 and role = 'student'", [
        data.studentId,
      ]);
      const teacher = await client.query("select id, display_name from users where id = $1 and role = 'teacher'", [
        data.teacherId,
      ]);

      if (!student.rows[0] || !teacher.rows[0]) {
        const error = new Error("Student and teacher are required.");
        error.statusCode = 400;
        throw error;
      }

      const assignment = await this.assignStudentToTeacher(client, {
        teacherId: data.teacherId,
        studentId: data.studentId,
        assignedByAdminId: adminId,
        source: "manual",
        notes: data.notes || "Assigned by admin.",
      });
      await client.query("commit");

      return assignment;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
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
    await this.pool.query(
      "update users set email = $1, display_name = $2, updated_at = now() where id = $3 and role = 'student'",
      [data.email.toLowerCase(), data.fullName.split(" ")[0] || data.fullName, id],
    );
    const result = await this.pool.query(
      `
        update student_profiles
        set full_name = $1, native_language = $2, level = $3, goal = $4, motivation = $5,
          updated_at = now()
        where user_id = $6
        returning user_id, full_name
      `,
      [data.fullName, data.nativeLanguage, data.level, data.goal, data.notes || "", id],
    );

    if (!result.rows[0]) {
      const error = new Error("Student not found.");
      error.statusCode = 404;
      throw error;
    }

    return { id, fullName: result.rows[0].full_name };
  }

  async createAdminTeacher(data) {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const userResult = await client.query(
        `
          insert into users (email, password_hash, role, display_name)
          values ($1, $2, 'teacher', $3)
          returning id, email, role, display_name
        `,
        [
          data.email.toLowerCase(),
          hashPassword(data.password || "teacher123"),
          data.fullName.split(" ")[0] || data.fullName,
        ],
      );
      await client.query(
        `
          insert into teacher_profiles (user_id, full_name, specialty, status)
          values ($1, $2, $3, $4)
        `,
        [userResult.rows[0].id, data.fullName, data.specialty || "", data.status || "active"],
      );
      await this.getOrCreateTeacherInvite(userResult.rows[0].id, client);
      await client.query("commit");
      return this.mapUser(userResult.rows[0]);
    } catch (error) {
      await client.query("rollback");

      if (error.code === "23505") {
        error.statusCode = 409;
        error.message = "Email already exists.";
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async updateAdminTeacher(id, data) {
    await this.pool.query(
      "update users set email = $1, display_name = $2, updated_at = now() where id = $3 and role = 'teacher'",
      [data.email.toLowerCase(), data.fullName.split(" ")[0] || data.fullName, id],
    );
    const result = await this.pool.query(
      `
        update teacher_profiles
        set full_name = $1, specialty = $2, status = $3, updated_at = now()
        where user_id = $4
        returning user_id, full_name
      `,
      [data.fullName, data.specialty || "", data.status || "active", id],
    );

    if (!result.rows[0]) {
      const error = new Error("Teacher not found.");
      error.statusCode = 404;
      throw error;
    }

    return { id, fullName: result.rows[0].full_name };
  }

  async createAdminPlan(data) {
    const result = await this.pool.query(
      `
        insert into plans (name, price_cents, billing_cycle, description, status)
        values ($1, $2, $3, $4, $5)
        returning id, name, price_cents, billing_cycle, description, status
      `,
      [
        data.name,
        data.priceCents || 0,
        data.billingCycle || "monthly",
        data.description || "",
        data.status || "active",
      ],
    );
    return this.mapPlan(result.rows[0]);
  }

  async updateAdminPlan(id, data) {
    const result = await this.pool.query(
      `
        update plans
        set name = $1, price_cents = $2, billing_cycle = $3, description = $4, status = $5,
          updated_at = now()
        where id = $6
        returning id, name, price_cents, billing_cycle, description, status
      `,
      [data.name, data.priceCents || 0, data.billingCycle, data.description || "", data.status, id],
    );

    if (!result.rows[0]) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }

    return this.mapPlan(result.rows[0]);
  }

  async createAdminCourse(data) {
    const result = await this.pool.query(
      `
        insert into courses (title, level, duration, description, status)
        values ($1, $2, $3, $4, $5)
        returning id, title, level, duration, description, status
      `,
      [data.title, data.level || "", data.duration || "", data.description || "", data.status || "draft"],
    );
    return this.mapCourse(result.rows[0]);
  }

  async updateAdminCourse(id, data) {
    const result = await this.pool.query(
      `
        update courses
        set title = $1, level = $2, duration = $3, description = $4, status = $5,
          updated_at = now()
        where id = $6
        returning id, title, level, duration, description, status
      `,
      [data.title, data.level || "", data.duration || "", data.description || "", data.status, id],
    );

    if (!result.rows[0]) {
      const error = new Error("Course not found.");
      error.statusCode = 404;
      throw error;
    }

    return this.mapCourse(result.rows[0]);
  }

  async getProfileForUser(user) {
    if (user.role === "student") {
      const result = await this.pool.query("select * from student_profiles where user_id = $1", [
        user.id,
      ]);
      return result.rows[0] ? this.mapStudentProfile(result.rows[0]) : null;
    }

    if (user.role === "teacher") {
      const result = await this.pool.query("select * from teacher_profiles where user_id = $1", [
        user.id,
      ]);
      return result.rows[0] ? this.mapTeacherProfile(result.rows[0]) : null;
    }

    const result = await this.pool.query("select * from admin_profiles where user_id = $1", [
      user.id,
    ]);
    return result.rows[0] ? this.mapAdminProfile(result.rows[0]) : null;
  }

  async getValidInvite(client, code) {
    const normalizedCode = code.toString().trim().toUpperCase();
    const result = await client.query(
      `
        select teacher_invites.*, users.role
        from teacher_invites
        join users on users.id = teacher_invites.teacher_id
        where teacher_invites.code = $1
          and teacher_invites.status = 'active'
          and users.role = 'teacher'
          and (teacher_invites.expires_at is null or teacher_invites.expires_at > now())
          and (teacher_invites.max_uses is null or teacher_invites.used_count < teacher_invites.max_uses)
      `,
      [normalizedCode],
    );

    if (!result.rows[0]) {
      const error = new Error("Invite link is invalid or inactive.");
      error.statusCode = 400;
      throw error;
    }

    return result.rows[0];
  }

  async getTeacherInviteByCode(code) {
    let invite;

    try {
      invite = await this.getValidInvite(this.pool, code);
    } catch (error) {
      return null;
    }

    const result = await this.pool.query(
      `
        select teacher_profiles.full_name, teacher_profiles.specialty
        from teacher_profiles
        where teacher_profiles.user_id = $1
      `,
      [invite.teacher_id],
    );
    const profile = result.rows[0] || {};

    return {
      code: invite.code,
      teacher: {
        id: invite.teacher_id,
        fullName: profile.full_name || "Teacher",
        specialty: profile.specialty || "General English",
      },
    };
  }

  async getOrCreateTeacherInvite(teacherId, client = this.pool) {
    const existing = await client.query(
      `
        select code, status, used_count, max_uses, expires_at
        from teacher_invites
        where teacher_id = $1 and status = 'active'
        order by created_at asc
        limit 1
      `,
      [teacherId],
    );

    if (existing.rows[0]) {
      return this.mapTeacherInvite(existing.rows[0]);
    }

    const profileResult = await client.query("select full_name from teacher_profiles where user_id = $1", [
      teacherId,
    ]);
    const base = (profileResult.rows[0]?.full_name || "TEACHER")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24);
    const code = `${base || "TEACHER"}-${createToken().slice(0, 6).toUpperCase()}`;
    const created = await client.query(
      `
        insert into teacher_invites (teacher_id, code, status)
        values ($1, $2, 'active')
        returning code, status, used_count, max_uses, expires_at
      `,
      [teacherId, code],
    );

    return this.mapTeacherInvite(created.rows[0]);
  }

  async assignStudentToTeacher(
    client,
    { teacherId, studentId, assignedByAdminId = null, source = "manual", notes = "" },
  ) {
    await client.query(
      `
        update teacher_student_assignments
        set status = 'inactive', updated_at = now()
        where student_id = $1 and teacher_id <> $2 and status = 'active'
      `,
      [studentId, teacherId],
    );
    const result = await client.query(
      `
        insert into teacher_student_assignments (
          teacher_id, student_id, status, source, assigned_by_admin_id, notes
        )
        values ($1, $2, 'active', $3, $4, $5)
        on conflict (teacher_id, student_id)
        do update set status = 'active', source = excluded.source,
          assigned_by_admin_id = excluded.assigned_by_admin_id,
          notes = excluded.notes, updated_at = now()
        returning id, student_id, teacher_id, source, notes
      `,
      [teacherId, studentId, source, assignedByAdminId, notes],
    );
    await client.query(
      "update student_profiles set assignment_status = 'assigned', updated_at = now() where user_id = $1",
      [studentId],
    );
    const names = await client.query(
      `
        select student_profiles.full_name as student_name, teacher_profiles.full_name as teacher_name
        from student_profiles
        cross join teacher_profiles
        where student_profiles.user_id = $1 and teacher_profiles.user_id = $2
      `,
      [studentId, teacherId],
    );

    return {
      id: result.rows[0].id,
      studentId: result.rows[0].student_id,
      studentName: names.rows[0]?.student_name || "Student",
      teacherId: result.rows[0].teacher_id,
      teacherName: names.rows[0]?.teacher_name || "Teacher",
      source: result.rows[0].source || "manual",
      notes: result.rows[0].notes || "",
    };
  }

  async getAddressForUser(userId, client = this.pool) {
    const result = await client.query("select * from addresses where user_id = $1 and label = 'primary'", [
      userId,
    ]);
    return result.rows[0] ? this.mapAddress(result.rows[0]) : null;
  }

  async upsertAddress(client, userId, address) {
    await client.query(
      `
        insert into addresses (user_id, label, line1, line2, city, region, postal_code, country)
        values ($1, 'primary', $2, $3, $4, $5, $6, $7)
        on conflict (user_id, label)
        do update set
          line1 = excluded.line1,
          line2 = excluded.line2,
          city = excluded.city,
          region = excluded.region,
          postal_code = excluded.postal_code,
          country = excluded.country,
          updated_at = now()
      `,
      [
        userId,
        address.line1 || "",
        address.line2 || "",
        address.city || "",
        address.region || "",
        address.postalCode || "",
        address.country || "",
      ],
    );
  }

  mapUser(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.display_name || user.displayName,
      phone: user.phone || "",
    };
  }

  mapStudentProfile(profile) {
    return {
      userId: profile.user_id,
      fullName: profile.full_name,
      age: profile.age?.toString() || "",
      nativeLanguage: profile.native_language,
      level: profile.level,
      goal: profile.goal,
      confidence: profile.confidence,
      studyTime: profile.study_time,
      interests: profile.interests || [],
      favoriteMedia: profile.favorite_media || "",
      hobbies: profile.hobbies || "",
      foodAndDrinks: profile.food_and_drinks || "",
      sports: profile.sports || "",
      motivation: profile.motivation || "",
      assignmentStatus: profile.assignment_status || "pending_assignment",
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  mapTeacherProfile(profile) {
    return {
      userId: profile.user_id,
      fullName: profile.full_name,
      specialty: profile.specialty || "",
      status: profile.status || "active",
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  mapAdminProfile(profile) {
    return {
      userId: profile.user_id,
      fullName: profile.full_name,
      status: profile.status || "active",
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  mapTeacherInvite(invite) {
    return {
      code: invite.code,
      status: invite.status,
      usedCount: invite.used_count || 0,
      maxUses: invite.max_uses,
      expiresAt: invite.expires_at,
    };
  }

  mapPlan(plan) {
    return {
      id: plan.id,
      name: plan.name,
      priceCents: plan.price_cents,
      billingCycle: plan.billing_cycle,
      description: plan.description || "",
      status: plan.status,
    };
  }

  mapCourse(course) {
    return {
      id: course.id,
      title: course.title,
      level: course.level || "",
      duration: course.duration || "",
      description: course.description || "",
      status: course.status,
    };
  }

  mapPronunciationAttempt(attempt) {
    return {
      id: attempt.id,
      studentId: attempt.student_id,
      phrase: attempt.phrase,
      durationSeconds: attempt.duration_seconds || 0,
      localSizeBytes: attempt.local_size_bytes || 0,
      audioStorageUrl: attempt.audio_storage_url || "",
      transcript: attempt.transcript || "",
      processingStatus: attempt.processing_status,
      createdAt: attempt.created_at,
    };
  }

  async createLevelSuggestion(studentId, { currentLevel, suggestedLevel, reason }) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query(
        `update student_profiles
         set suggested_level = $1, level_review_status = 'pending', updated_at = now()
         where user_id = $2`,
        [suggestedLevel, studentId],
      );
      await client.query(
        `insert into ai_feedback (student_id, source_type, summary, recommendations)
         values ($1, 'level_suggestion', $2, $3)`,
        [studentId, reason, [`current:${currentLevel}`, `suggested:${suggestedLevel}`]],
      );
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async reviewLevelSuggestion(studentId, action) {
    if (action === "approve") {
      await this.pool.query(
        `update student_profiles
         set level = suggested_level, suggested_level = null, level_review_status = 'approved', updated_at = now()
         where user_id = $1 and suggested_level is not null`,
        [studentId],
      );
    } else {
      await this.pool.query(
        `update student_profiles
         set suggested_level = null, level_review_status = 'dismissed', updated_at = now()
         where user_id = $1`,
        [studentId],
      );
    }
  }

  async savePlacement(studentId, { feedback, level, priorities, score, questions, answers }) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const sourceData = questions && answers ? JSON.stringify({ questions, answers, level }) : null;
      await client.query(
        `insert into ai_feedback (student_id, source_type, summary, recommendations, score, source_data)
         values ($1, 'placement', $2, $3, $4, $5)`,
        [studentId, feedback, priorities, score ?? null, sourceData],
      );
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async getPlacementById(placementId, studentId) {
    const result = await this.pool.query(
      `select af.id, af.summary as feedback, af.recommendations as priorities,
              af.score, af.source_data, af.created_at
       from ai_feedback af
       where af.id = $1 and af.student_id = $2 and af.source_type = 'placement'`,
      [placementId, studentId],
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    let sourceData = null;
    try { if (row.source_data) sourceData = JSON.parse(row.source_data); } catch {}
    return {
      id: row.id,
      feedback: row.feedback,
      priorities: row.priorities || [],
      score: row.score,
      level: sourceData?.level || null,
      questions: sourceData?.questions || [],
      answers: sourceData?.answers || {},
      createdAt: row.created_at,
    };
  }

  async getAllPlacements(studentId) {
    const result = await this.pool.query(
      `select af.id, af.summary as feedback, af.recommendations as priorities,
              af.score, af.source_data, af.created_at
       from ai_feedback af
       where af.student_id = $1 and af.source_type = 'placement'
       order by af.created_at desc`,
      [studentId],
    );
    return result.rows.map((row) => {
      let level = null;
      try { if (row.source_data) level = JSON.parse(row.source_data)?.level; } catch {}
      return {
        id: row.id,
        feedback: row.feedback,
        priorities: row.priorities || [],
        score: row.score,
        level,
        createdAt: row.created_at,
      };
    });
  }

  async getLatestPlacement(studentId) {
    const result = await this.pool.query(
      `select af.summary as feedback, af.recommendations as priorities,
              sp.level, af.score, af.created_at
       from ai_feedback af
       join student_profiles sp on sp.user_id = $1
       where af.student_id = $1 and af.source_type = 'placement'
       order by af.created_at desc
       limit 1`,
      [studentId],
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      feedback: row.feedback,
      level: row.level,
      priorities: row.priorities || [],
      score: row.score,
      createdAt: row.created_at,
    };
  }

  async createLessonRecording({ studentId, audioPath, audioMime, fileSizeBytes }) {
    const result = await this.pool.query(
      `insert into lesson_recordings (student_id, audio_path, audio_mime, file_size_bytes, processing_status)
       values ($1, $2, $3, $4, 'uploaded')
       returning id, student_id, audio_path, audio_mime, file_size_bytes, processing_status, created_at`,
      [studentId, audioPath, audioMime, fileSizeBytes],
    );
    return this.mapRecording(result.rows[0]);
  }

  async getLessonRecording(recordingId) {
    const result = await this.pool.query(
      `select id, student_id, teacher_id, audio_path, audio_mime, duration_seconds,
              file_size_bytes, transcript, processing_status, analysis_json, created_at
       from lesson_recordings where id = $1`,
      [recordingId],
    );
    return result.rows[0] ? this.mapRecording(result.rows[0]) : null;
  }

  async updateLessonRecording(recordingId, { processingStatus, transcript, analysisJson } = {}) {
    const updates = ["updated_at = now()"];
    const params = [recordingId];

    if (processingStatus !== undefined) {
      params.push(processingStatus);
      updates.push(`processing_status = $${params.length}`);
    }
    if (transcript !== undefined) {
      params.push(transcript);
      updates.push(`transcript = $${params.length}`);
    }
    if (analysisJson !== undefined) {
      params.push(analysisJson);
      updates.push(`analysis_json = $${params.length}`);
    }

    await this.pool.query(
      `update lesson_recordings set ${updates.join(", ")} where id = $1`,
      params,
    );
  }

  async saveRecordingAnalysis(recordingId, studentId, analysis) {
    await this.updateLessonRecording(recordingId, { analysisJson: JSON.stringify(analysis) });
    const summary = [
      analysis.summary || "",
      analysis.progressNote ? `Progress: ${analysis.progressNote}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const recommendations = [
      ...(analysis.practiceRecommendations || []),
      ...(analysis.mainTopics || []).map((t) => `Topic covered: ${t}`),
      ...(analysis.newVocabulary || []).map((w) => `New word: ${w}`),
    ];

    await this.pool.query(
      `insert into ai_feedback (student_id, source_type, source_id, summary, recommendations)
       values ($1, 'lesson_recording', $2, $3, $4)`,
      [studentId, recordingId, summary, recommendations],
    );

    if (analysis.studentMistakes?.length > 0) {
      const mistakeSummary = analysis.studentMistakes
        .map((m) => `${m.type}: "${m.example}" → "${m.correction}"`)
        .join("; ");
      await this.pool.query(
        `insert into ai_feedback (student_id, source_type, source_id, summary, recommendations)
         values ($1, 'lesson_mistakes', $2, $3, $4)`,
        [studentId, recordingId, mistakeSummary, analysis.teacherFocus || []],
      );
    }
  }

  async getTeacherForStudent(studentId) {
    const result = await this.pool.query(
      `select u.id, tp.full_name, tp.specialty
       from teacher_student_assignments tsa
       join users u on u.id = tsa.teacher_id
       join teacher_profiles tp on tp.user_id = tsa.teacher_id
       where tsa.student_id = $1 and tsa.status = 'active'
       limit 1`,
      [studentId],
    );
    return result.rows[0] || null;
  }

  async getLatestLessonAnalysis(studentId) {
    const result = await this.pool.query(
      `select af.summary, af.recommendations, af.created_at, lr.audio_mime, lr.duration_seconds
       from ai_feedback af
       join lesson_recordings lr on lr.id = af.source_id
       where af.student_id = $1 and af.source_type = 'lesson_recording'
       order by af.created_at desc
       limit 1`,
      [studentId],
    );
    return result.rows[0] || null;
  }

  mapRecording(row) {
    let analysis = null;
    try {
      if (row.analysis_json) analysis = JSON.parse(row.analysis_json);
    } catch {}
    return {
      id: row.id,
      studentId: row.student_id,
      teacherId: row.teacher_id || null,
      audioPath: row.audio_path,
      audioMime: row.audio_mime,
      durationSeconds: row.duration_seconds || null,
      fileSizeBytes: row.file_size_bytes || null,
      transcript: row.transcript || null,
      processingStatus: row.processing_status,
      analysis,
      createdAt: row.created_at,
    };
  }

  mapAddress(address) {
    return {
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      region: address.region || "",
      postalCode: address.postal_code || "",
      country: address.country || "",
    };
  }

  async sendStudentNotification(studentId, { message, sentById }) {
    const result = await this.pool.query(
      `insert into student_notifications (student_id, sent_by_id, message)
       values ($1, $2, $3)
       returning id, student_id, message, read_at, created_at`,
      [studentId, sentById || null, message],
    );
    return result.rows[0];
  }

  async getStudentNotifications(studentId) {
    const result = await this.pool.query(
      `select id, message, read_at, created_at
       from student_notifications
       where student_id = $1
       order by created_at desc
       limit 20`,
      [studentId],
    );
    return result.rows.map((r) => ({
      id: r.id,
      message: r.message,
      readAt: r.read_at,
      createdAt: r.created_at,
    }));
  }

  async markNotificationRead(notificationId, studentId) {
    await this.pool.query(
      `update student_notifications set read_at = now()
       where id = $1 and student_id = $2 and read_at is null`,
      [notificationId, studentId],
    );
  }
}

module.exports = {
  PostgresStorage,
};
