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
}

module.exports = {
  PostgresStorage,
};
