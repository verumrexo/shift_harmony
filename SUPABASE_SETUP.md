# Supabase Setup Guide

To enable multi-device access and persistent storage across devices, this application uses [Supabase](https://supabase.com).

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/log in.
2. Click "New Project".
3. Name your project (e.g., `shift-harmony`).
4. Set a database password and choose a region.
5. Click "Create new project".

## 2. Get API Keys

1. Once the project is created, go to **Settings** -> **API**.
2. Find the `Project URL` and `anon public` key.

## 3. Create the Database Table

1. Go to the **SQL Editor** in the left sidebar.
2. Click "New query" and paste the following SQL:

```sql
-- Create a table to store application state as key-value pairs
CREATE TABLE app_storage (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE app_storage ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone with the anon key to read/write
-- Note: In a production app with users, you'd want stricter policies.
-- For this simple shared app (protected by a client-side PIN), this allows the app to function.
CREATE POLICY "Allow anonymous access" ON app_storage
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. Click **Run**.

## 4. Connect the App

1. Create a `.env` file in the root of your project (copy from `.env.example`).
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Rebuild and deploy your app.
   - For local development: `npm run dev`
   - For deployment: `npm run build && npm run deploy`

## Fallback

If the `.env` variables are missing, the app will automatically fall back to using `localStorage`. However, data will not be synced between devices.
