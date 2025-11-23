# Supabase Setup Guide

Follow these steps to set up your Supabase database for the StudyTrack application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: StudyTrack (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click **"Create new project"** and wait for it to initialize (~2 minutes)

## Step 2: Run the SQL Schema

### Option A: Using the SQL Editor (Recommended)

1. In your Supabase dashboard, click on the **"SQL Editor"** tab in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from your project
4. **Copy the entire contents** of the schema.sql file
5. **Paste it** into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
7. You should see a success message: "Success. No rows returned"

### Option B: Using the Table Editor

If you prefer a visual approach:
1. Click on **"Table Editor"** in the left sidebar
2. Click **"New table"** and create each table manually
3. Add columns according to the schema

**Note:** Option A is much faster and less error-prone.

## Step 3: Enable Row Level Security (RLS)

The schema already enables RLS on all tables. Verify this:

1. Go to **"Authentication"** → **"Policies"**
2. You should see policies for each table
3. These policies ensure users can only access their own data

## Step 4: Configure Storage Bucket (for Files Module)

1. Go to **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it: `files`
4. Set it to **Public** (or Private if you prefer)
5. Click **"Create bucket"**

### Set Bucket Policies

1. Click on the `files` bucket
2. Go to **"Policies"**
3. Add these policies:

**Upload Policy:**
```sql
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Download Policy:**
```sql
CREATE POLICY "Users can download their files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Delete Policy:**
```sql
CREATE POLICY "Users can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 5: Get Your API Keys

1. Go to **"Settings"** → **"API"**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
3. Update your `.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 6: Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try signing up with a test account
4. Check if tables are being populated in Supabase → **"Table Editor"**

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire schema.sql file
- Check the SQL Editor for any error messages

### Can't upload files
- Verify the `files` storage bucket exists
- Check that storage policies are set correctly

### Authentication errors
- Confirm your `.env` file has the correct keys
- Restart your dev server after updating `.env`

## Next Steps

Once your database is set up:
1. Test all features (CGPA, Timetable, Files, Tasks, Study Sessions)
2. Customize the schema if needed
3. Deploy your application!

---

**Need Help?** Check the [Supabase Documentation](https://supabase.com/docs) or visit their [Discord community](https://discord.supabase.com).
