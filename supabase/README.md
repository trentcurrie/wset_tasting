# Managing Allowed Emails in Supabase

This guide explains how to add new allowed emails to your PourDecisions app.

## Method 1: Admin Panel (Recommended)

If you have admin access, you can manage allowed emails directly from the app:

1. Sign in with your admin account
2. Click the **Admin** button in the sidebar
3. Enter an email address and click **Add**
4. The email will be added to the allowlist immediately

## Method 2: Supabase Dashboard

1. Go to your Supabase project dashboard at https://supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `add_allowed_email.sql`
5. **Edit the email address** to add your new email
6. Click **Run** (or press Cmd/Ctrl + Enter)

Example of adding a new email:
```sql
insert into public.allowed_emails (email) values
  ('newemail@example.com')
on conflict (email) do nothing;
```

## Database Structure

The allowed emails system uses two tables:

### `allowed_emails` table
- Stores all allowed email addresses
- Has RLS policies so only admins can manage it
- Used by `handle_new_user()` trigger during signup

### `profiles` table
- Includes `is_admin` column (boolean)
- Admins can access the Admin panel in the app

## Notes

- Changes take effect immediately
- Existing users are not affected
- Only new signups are validated
- The allowed list is stored in the `allowed_emails` table
