
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. USER PROGRESS
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text default 'default-course',
  lesson_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- 3. USER SKILLS
create table public.user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id text not null,
  xp int default 0,
  level int default 1,
  updated_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- 4. USER COMMUNITIES
create table public.user_communities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  community_id text not null,
  joined_at timestamptz default now(),
  unique(user_id, community_id)
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_skills enable row level security;
alter table public.user_communities enable row level security;

-- Policies (Permissive for Phase 14)
-- Profiles: Public Read, Self Update
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);

-- Progress: Self Read/Write
create policy "Users can read own progress" 
  on user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress" 
  on user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" 
  on user_progress for update using (auth.uid() = user_id);

-- Skills: Self Read/Write (Maybe public read later for logic, but strictly self for now)
-- Actually, for leaderboards (future), public read will be needed. 
-- For now, let's allow public read for skills to support "Comparison" features if we implement backend friend sync later.
create policy "Skills are viewable by everyone" 
  on user_skills for select using (true);

create policy "Users can update own skills" 
  on user_skills for insert with check (auth.uid() = user_id);

create policy "Users can update own skills row" 
  on user_skills for update using (auth.uid() = user_id);

-- Triggers for Profile Creation on Signup
-- (Optional but recommended: Automatically create profile entry)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
