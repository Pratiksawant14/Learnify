-- Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  avatar text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses Table
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  roadmap_json jsonb,
  owner_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lessons Table
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  video_id text,
  start_time float,
  end_time float,
  transcript_text text,
  order_index integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Progress Table
create table public.progress (
  user_id uuid references public.profiles(id) not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  xp_awarded integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, lesson_id)
);

-- Skills Table
create table public.skills (
  user_id uuid references public.profiles(id) not null,
  skill_name text not null,
  xp integer default 0,
  level integer default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, skill_name)
);

-- User Courses (Enrollment/Saved)
create table public.user_courses (
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.progress enable row level security;
alter table public.skills enable row level security;
alter table public.user_courses enable row level security;

-- Basic Policies (example: public read, auth write)
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

create policy "Courses are viewable by everyone." on public.courses for select using ( true );
create policy "Users can create courses." on public.courses for insert with check ( auth.uid() = owner_id );

-- (For MVP, these are basic. Can be tightened later.)
