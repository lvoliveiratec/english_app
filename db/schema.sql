create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('student', 'teacher', 'admin')),
  display_name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users add column if not exists phone text;

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null default 'primary',
  line1 text,
  line2 text,
  city text,
  region text,
  postal_code text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, label)
);

create table if not exists student_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  full_name text not null,
  age integer,
  native_language text,
  level text not null,
  goal text not null,
  confidence text,
  study_time text,
  interests text[] not null default '{}',
  favorite_media text,
  hobbies text,
  food_and_drinks text,
  sports text,
  motivation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  full_name text not null,
  specialty text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table teacher_profiles add column if not exists specialty text;

create table if not exists admin_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  full_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  duration text,
  description text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table courses add column if not exists description text;
alter table courses add column if not exists status text not null default 'draft';
alter table courses add column if not exists updated_at timestamptz not null default now();

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents integer not null default 0,
  billing_cycle text not null default 'monthly',
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete set null,
  skill text not null,
  title text not null,
  estimated_minutes integer,
  created_at timestamptz not null default now()
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  skill text not null,
  status text not null default 'not_started',
  completion integer not null default 0 check (completion >= 0 and completion <= 100),
  difficulty text,
  recommendation text,
  updated_at timestamptz not null default now()
);

create table if not exists pronunciation_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  phrase text not null,
  duration_seconds integer,
  local_size_bytes integer,
  audio_storage_url text,
  transcript text,
  processing_status text not null default 'recorded_locally',
  created_at timestamptz not null default now()
);

create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  teacher_id uuid references users(id) on delete set null,
  purpose text not null,
  consent_text text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists media_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  teacher_id uuid references users(id) on delete set null,
  consent_id uuid references consent_records(id) on delete restrict,
  media_type text not null check (media_type in ('audio', 'video')),
  storage_url text,
  processing_status text not null default 'pending_upload',
  retention_until timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists ai_feedback (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  summary text not null,
  recommendations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_cents integer not null default 0,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
