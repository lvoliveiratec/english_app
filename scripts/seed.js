const { Pool } = require("pg");
const { hashPassword } = require("../src/security");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required to seed the database.");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function upsertUser(client, { email, password, role, displayName, phone = "" }) {
  const result = await client.query(
    `
      insert into users (email, password_hash, role, display_name, phone)
      values ($1, $2, $3, $4, $5)
      on conflict (email)
      do update set
        password_hash = excluded.password_hash,
        role = excluded.role,
        display_name = excluded.display_name,
        phone = excluded.phone,
        updated_at = now()
      returning id
    `,
    [email, hashPassword(password), role, displayName, phone],
  );

  return result.rows[0].id;
}

async function upsertAddress(client, userId, address) {
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

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("begin");

    const studentId = await upsertUser(client, {
      email: "lucas@example.com",
      password: "english123",
      role: "student",
      displayName: "Lucas",
      phone: "+1 555 0100",
    });
    const teacherId = await upsertUser(client, {
      email: "teacher@example.com",
      password: "teacher123",
      role: "teacher",
      displayName: "Ana Teacher",
    });
    const adminId = await upsertUser(client, {
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      displayName: "Admin",
    });

    await client.query(
      `
        insert into student_profiles (
          user_id, full_name, age, native_language, level, goal, confidence, study_time,
          interests, favorite_media, hobbies, food_and_drinks, sports, motivation,
          assignment_status
        )
        values ($1, 'Lucas', null, 'Portuguese', 'Beginner', 'Daily conversation',
          'Comfortable with simple phrases', '20 minutes a day',
          $2, 'Business videos and short series.', 'Technology and language practice.',
          'Coffee and pizza.', 'Gym', 'Improve English for real conversations.', 'assigned')
        on conflict (user_id)
        do update set
          full_name = excluded.full_name,
          native_language = excluded.native_language,
          level = excluded.level,
          goal = excluded.goal,
          confidence = excluded.confidence,
          study_time = excluded.study_time,
          interests = excluded.interests,
          favorite_media = excluded.favorite_media,
          hobbies = excluded.hobbies,
          food_and_drinks = excluded.food_and_drinks,
          sports = excluded.sports,
          motivation = excluded.motivation,
          assignment_status = 'assigned',
          updated_at = now()
      `,
      [studentId, ["Movies and series", "Work and business"]],
    );
    await upsertAddress(client, studentId, {
      line1: "123 Main Street",
      city: "Calgary",
      region: "AB",
      postalCode: "T2P 1J9",
      country: "Canada",
    });

    await client.query(
      `
        insert into teacher_profiles (user_id, full_name, specialty, status)
        values ($1, 'Ana Teacher', 'Pronunciation', 'active')
        on conflict (user_id)
        do update set full_name = excluded.full_name, specialty = excluded.specialty,
          status = excluded.status, updated_at = now()
      `,
      [teacherId],
    );
    await client.query(
      `
        insert into admin_profiles (user_id, full_name, status)
        values ($1, 'Admin', 'active')
        on conflict (user_id)
        do update set full_name = excluded.full_name, status = excluded.status,
          updated_at = now()
      `,
      [adminId],
    );
    await client.query(
      `
        insert into teacher_student_assignments (teacher_id, student_id, status, source, notes)
        values ($1, $2, 'active', 'seed', 'Demo assignment for teacher dashboard.')
        on conflict (teacher_id, student_id)
        do update set status = excluded.status, source = excluded.source,
          notes = excluded.notes, updated_at = now()
      `,
      [teacherId, studentId],
    );
    await client.query(
      `
        insert into teacher_invites (teacher_id, code, status)
        values ($1, 'ANA-TEACHER', 'active')
        on conflict (code)
        do update set teacher_id = excluded.teacher_id, status = excluded.status, updated_at = now()
      `,
      [teacherId],
    );

    await client.query(
      `
        insert into plans (name, price_cents, billing_cycle, description, status)
        select 'Monthly English', 5900, 'monthly', 'Standard monthly plan for individual students.', 'active'
        where not exists (select 1 from plans where name = 'Monthly English')
      `,
    );
    await client.query(
      `
        insert into courses (title, level, duration, description, status)
        select 'English Foundations', 'Beginner', '6 weeks',
          'Essential vocabulary, phrases, and grammar for beginners.', 'published'
        where not exists (select 1 from courses where title = 'English Foundations')
      `,
    );
    await client.query(
      `
        insert into payments (user_id, status, amount_cents, paid_at)
        select $1, 'paid', 5900, now()
        where not exists (select 1 from payments where user_id = $1 and status = 'paid')
      `,
      [studentId],
    );
    await client.query(
      `
        insert into lesson_progress (
          student_id, skill, status, completion, difficulty, recommendation
        )
        select $1, 'Pronunciation', 'in_progress', 64, 'word endings',
          'Practice final consonants and short conversation answers.'
        where not exists (select 1 from lesson_progress where student_id = $1 and skill = 'Pronunciation')
      `,
      [studentId],
    );

    await client.query("commit");
    console.log("Database seed data applied.");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
