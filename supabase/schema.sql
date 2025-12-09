-- PourDecisions Database Schema
-- Run this in your Supabase SQL Editor (supabase.com -> Your Project -> SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tastings table
create table if not exists public.tastings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  data jsonb not null
);

-- Create index for faster user queries
create index if not exists tastings_user_id_idx on public.tastings(user_id);
create index if not exists tastings_created_at_idx on public.tastings(created_at desc);

-- Enable Row Level Security (RLS)
alter table public.tastings enable row level security;

-- Policy: Users can only see their own tastings
create policy "Users can view own tastings"
  on public.tastings
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own tastings
create policy "Users can insert own tastings"
  on public.tastings
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own tastings
create policy "Users can update own tastings"
  on public.tastings
  for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own tastings
create policy "Users can delete own tastings"
  on public.tastings
  for delete
  using (auth.uid() = user_id);

-- Create profiles table (optional, for user display names)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policy: Users can view all profiles (for displaying names)
create policy "Profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Policy: Users can update own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Function to create profile on signup
-- Only allows specific email addresses to sign up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  allowed_emails text[] := ARRAY[
    'trent.d.currie@gmail.com',
    'trentdcurrie@gmail.com'
  ];
begin
  -- Check if email is in allowed list
  if new.email = ANY(allowed_emails) then
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'avatar_url'
    );
    return new;
  else
    -- Reject unauthorized signups
    raise exception 'Unauthorized email address';
  end if;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
