-- Add a new allowed email to the allowed_emails table
-- Replace 'new.email@example.com' with the actual email you want to add

-- Simple method: Insert into allowed_emails table
insert into public.allowed_emails (email) values
  ('new.email@example.com')
on conflict (email) do nothing;

-- Or add multiple at once:
-- insert into public.allowed_emails (email) values
--   ('friend1@example.com'),
--   ('friend2@example.com'),
--   ('friend3@example.com')
-- on conflict (email) do nothing;

-- View all allowed emails:
-- select * from public.allowed_emails order by created_at desc;

-- Remove an email:
-- delete from public.allowed_emails where email = 'remove@example.com';
