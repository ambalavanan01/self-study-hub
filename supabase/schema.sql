create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,
  name text,
  college text,
  branch text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles_select" on profiles for select using (auth.uid() = user_id);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update" on profiles for update using (auth.uid() = user_id);

-- SEMESTERS
create table semesters (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  year int,
  term text check (term in ('Fall','Winter')),
  created_at timestamptz default now()
);
alter table semesters enable row level security;
create policy "semesters_all" on semesters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SUBJECTS
create table subjects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  semester_id uuid references semesters(id) on delete cascade,
  subject_name text,
  subject_code text,
  grade text check (grade in ('S','A','B','C','D','E')),
  credit numeric(3,1)
);
alter table subjects enable row level security;
create policy "subjects_all" on subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TIMETABLE ENTRIES
create table timetable_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  day text check (day in ('Monday','Tuesday','Wednesday','Thursday','Friday')),
  type text check (type in ('theory','lab')),
  slot_code text,
  slot_label text,
  subject_name text,
  subject_code text,
  start_time time,
  end_time time,
  credit numeric(3,1)
);
alter table timetable_entries enable row level security;
create policy "timetable_all" on timetable_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- FILES
create table files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  subject_code text,
  file_name text,
  file_url text,
  file_type text,
  size_bytes bigint,
  uploaded_at timestamptz default now()
);
alter table files enable row level security;
create policy "files_all" on files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TASKS
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  subject_code text,
  title text,
  description text,
  due_date date,
  status text check (status in ('todo','in-progress','done')) default 'todo',
  created_at timestamptz default now()
);
alter table tasks enable row level security;
create policy "tasks_all" on tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STUDY SESSIONS
create table study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  duration_minutes int,
  completed_at timestamptz default now()
);
alter table study_sessions enable row level security;
create policy "sessions_all" on study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
