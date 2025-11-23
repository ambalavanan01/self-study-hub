# Supabase Storage Buckets & Policies Guide

This guide provides complete instructions for setting up all storage buckets and their security policies for the StudyTrack application.

## Overview

StudyTrack uses Supabase Storage for the **Files Module** to store study materials, notes, assignments, and documents.

---

## Storage Bucket Setup

### 1. Create the Files Bucket

1. Go to your Supabase Dashboard
2. Click **"Storage"** in the left sidebar
3. Click **"Create a new bucket"**
4. Configure the bucket:
   - **Name**: `files`
   - **Public bucket**: ☑️ Checked (allows public URL access)
   - **File size limit**: 10 MB (or adjust as needed)
   - **Allowed MIME types**: Leave empty (allow all types)
5. Click **"Create bucket"**

---

## Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies to control who can access files.

### Method 1: Using SQL Editor (Recommended)

1. Go to **"SQL Editor"** in your Supabase dashboard
2. Click **"New query"**
3. **Copy and paste ALL the SQL code below**
4. Click **"Run"**

```sql
-- ============================================
-- STORAGE POLICIES FOR FILES BUCKET
-- ============================================

-- 1. SELECT Policy: Allow users to view/download their own files
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. INSERT Policy: Allow users to upload files to their own folder
CREATE POLICY "Users can upload files to their folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. UPDATE Policy: Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. DELETE Policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Method 2: Using the Dashboard UI

If you prefer to create policies via the UI:

1. Go to **"Storage"** → Click on the **"files"** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Create each policy manually using the settings below:

#### Policy 1: SELECT (View/Download)
- **Policy name**: `Users can view their own files`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 2: INSERT (Upload)
- **Policy name**: `Users can upload files to their folder`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
  ```sql
  bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 3: UPDATE (Modify)
- **Policy name**: `Users can update their own files`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text
  ```
- **WITH CHECK expression**:
  ```sql
  bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 4: DELETE (Remove)
- **Policy name**: `Users can delete their own files`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

---

## Understanding the Policies

### File Storage Structure
Files are stored with this path structure:
```
files/
  └── {user_id}/
      ├── file1.pdf
      ├── file2.jpg
      └── file3.docx
```

### Policy Logic Explained

**`(storage.foldername(name))[1]`** - Extracts the first folder name from the file path (the user ID)

**`auth.uid()::text`** - Gets the current authenticated user's ID as text

**The condition ensures**: Users can only access files in folders matching their own user ID

### Policy Types

- **SELECT**: Controls who can view/download files
- **INSERT**: Controls who can upload new files
- **UPDATE**: Controls who can modify existing files (including metadata)
- **DELETE**: Controls who can delete files

---

## Verification Steps

### 1. Check Bucket Creation
1. Go to **Storage** → You should see the `files` bucket
2. Click on it → It should be empty initially

### 2. Verify Policies
1. Click on the `files` bucket → **Policies** tab
2. You should see **4 policies** listed:
   - Users can view their own files (SELECT)
   - Users can upload files to their folder (INSERT)
   - Users can update their own files (UPDATE)
   - Users can delete their own files (DELETE)

### 3. Test File Upload
1. Run your app: `npm run dev`
2. Sign up / Log in
3. Navigate to **Files** page
4. Try uploading a file
5. Check Supabase Storage → `files` → Your user ID folder should contain the file

---

## Troubleshooting

### Error: "new row violates row-level security policy"
- **Cause**: Policies are not set up correctly
- **Solution**: Re-run the SQL policies from Method 1 above

### Error: "Policy already exists"
- **Cause**: You're trying to create a policy that already exists
- **Solution**: 
  1. Go to Storage → files → Policies
  2. Delete existing policies
  3. Re-run the SQL code

### Files not uploading
- **Check**:
  1. Bucket name is exactly `files`
  2. Bucket is set to public
  3. All 4 policies are created
  4. You're logged in to the app

### Can't see uploaded files
- **Check**:
  1. SELECT policy is enabled
  2. File path includes your user ID
  3. Refresh the Files page

---

## Advanced Configuration (Optional)

### Increase File Size Limit

By default, Supabase allows uploads up to 50MB. To change:

1. Go to **Storage** → **Settings**
2. Adjust **Maximum file size**
3. Click **Save**

### Restrict File Types

To allow only specific file types (e.g., PDFs, images):

1. Edit the bucket settings
2. In **Allowed MIME types**, add:
   ```
   application/pdf
   image/jpeg
   image/png
   application/vnd.openxmlformats-officedocument.wordprocessingml.document
   ```

### Enable Automatic Image Optimization

For image files, enable transformation:

1. Go to **Storage** → **files** → **Settings**
2. Enable **Image transformations**
3. This allows resizing and optimization on-the-fly

---

## Complete Setup Checklist

- [ ] Created `files` bucket (public)
- [ ] Created SELECT policy
- [ ] Created INSERT policy
- [ ] Created UPDATE policy
- [ ] Created DELETE policy
- [ ] Tested file upload via the app
- [ ] Verified files appear in Supabase Storage
- [ ] Tested file download
- [ ] Tested file deletion

---

## Summary

You now have a fully configured storage system for StudyTrack! The security policies ensure:
- ✅ Users can only access their own files
- ✅ Files are organized by user ID
- ✅ All CRUD operations are protected
- ✅ Public URLs work for file access

**Next**: Continue with the main [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide to complete your database setup.
