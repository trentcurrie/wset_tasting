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
  is_admin boolean default false not null,
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

-- Create allowed_emails table for invite management
create table if not exists public.allowed_emails (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  added_by uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

-- Enable RLS on allowed_emails
alter table public.allowed_emails enable row level security;

-- Policy: Only admins can view allowed_emails
create policy "Admins can view allowed_emails"
  on public.allowed_emails
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Policy: Only admins can insert allowed_emails
create policy "Admins can insert allowed_emails"
  on public.allowed_emails
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Policy: Only admins can delete allowed_emails
create policy "Admins can delete allowed_emails"
  on public.allowed_emails
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Seed initial allowed emails (your emails)
insert into public.allowed_emails (email) values
  ('trent.d.currie@gmail.com'),
  ('trentdcurrie@gmail.com')
on conflict (email) do nothing;

-- Function to create profile on signup
-- Checks allowed_emails table instead of hardcoded array
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_allowed boolean;
  is_first_admin boolean;
begin
  -- Check if email is in allowed_emails table
  select exists(
    select 1 from public.allowed_emails where email = new.email
  ) into is_allowed;

  if is_allowed then
    -- Check if this is one of the original admin emails
    is_first_admin := new.email in ('trent.d.currie@gmail.com', 'trentdcurrie@gmail.com');
    
    insert into public.profiles (id, email, full_name, avatar_url, is_admin)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'avatar_url',
      is_first_admin
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
