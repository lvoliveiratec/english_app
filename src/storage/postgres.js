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

  async createStudentAccount({ email, password, profile }) {
    const client = await this.pool.connect();

    try {
      await client.query("begin");
      const passwordHash = hashPassword(password);
      const displayName = profile.fullName.split(" ")[0] || profile.fullName;
      const userResult = await client.query(
        `
          insert into users (email, password_hash, role, display_name)
          values ($1, $2, 'student', $3)
          returning id, email, role, display_name
        `,
        [email.toLowerCase(), passwordHash, displayName],
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
            motivation
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        ],
      );

      await client.query("commit");

      return {
        user: this.mapUser(user),
        profile: this.mapStudentProfile(profileResult.rows[0]),
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
      "select id, email, role, display_name, password_hash from users where email = $1",
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
        select users.id, users.email, users.role, users.display_name
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
    };
  }

  async deleteSession(token) {
    await this.pool.query("delete from sessions where token = $1", [token]);
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
        studentName: row.student_name,
        level: row.level,
        goal: row.goal,
        completion: row.completion,
        difficulty: row.difficulty,
        recommendation: row.recommendation,
      })),
      recentActivity: [
        "Backend summary loaded",
        "Student profile records available",
        "Consent workflow pending implementation",
      ],
    };
  }

  async getAdminResources() {
    const [students, teachers, plans, courses] = await Promise.all([
      this.pool.query(
        `
          select users.id, users.email, student_profiles.full_name, student_profiles.level,
            student_profiles.goal, 'active' as status
          from users
          join student_profiles on student_profiles.user_id = users.id
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
      return result.rows[0] || null;
    }

    const result = await this.pool.query("select * from admin_profiles where user_id = $1", [
      user.id,
    ]);
    return result.rows[0] || null;
  }

  mapUser(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.display_name || user.displayName,
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
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
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
}

module.exports = {
  PostgresStorage,
};
