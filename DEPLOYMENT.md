# Deployment Guide for StudyTrack

This guide covers deploying StudyTrack to various platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ Completed Supabase setup (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- ✅ Completed Storage setup (see [STORAGE_SETUP.md](./STORAGE_SETUP.md))
- ✅ Your Supabase Project URL and Anon Key

## Platform-Specific Deployment

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Vite/React apps.

#### Steps:

1. **Push your code to GitHub** (already done! ✅)

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

3. **Import your repository**
   - Click "Add New" → "Project"
   - Select `self-study-hub` repository
   - Click "Import"

4. **Configure build settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**
   
   In the "Environment Variables" section, add:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```
   
   **Important:** Make sure to add these for ALL environments (Production, Preview, Development)

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

7. **Update Supabase URL Whitelist**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Site URL" and "Redirect URLs"

#### Subsequent Deployments
- Just push to GitHub (`git push origin main`)
- Vercel will automatically redeploy! 🚀

---

### Option 2: Netlify

1. **Sign up for Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select `self-study-hub`

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`

---

### Option 3: GitHub Pages

**Note:** GitHub Pages requires additional configuration for client-side routing.

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`**
   Add:
   ```json
   {
     "homepage": "https://ambalavanan01.github.io/self-study-hub",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.ts`**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/self-study-hub/',
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository settings → Pages
   - Source: Deploy from branch → `gh-pages`
   - Click Save

**Important:** GitHub Pages doesn't support environment variables. You'll need to hardcode them (NOT recommended for security) or use a different platform.

---

## Environment Variables Setup

### Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" (gear icon) → "API"
3. Copy:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Setting Environment Variables

Each platform has a different method:

**Vercel:**
- Dashboard → Settings → Environment Variables

**Netlify:**
- Site settings → Build & deploy → Environment → Environment variables

**Local Development:**
- Create a `.env` file in the project root:
  ```env
  VITE_SUPABASE_URL=your_url_here
  VITE_SUPABASE_ANON_KEY=your_key_here
  ```

---

## Troubleshooting Deployment

### White/Blank Page After Deployment

**Cause:** Missing environment variables

**Solution:**
1. Check deployment logs for errors
2. Verify environment variables are set correctly
3. Ensure variables start with `VITE_` (Vite requirement)
4. Redeploy after adding variables

### Authentication Not Working

**Cause:** Redirect URLs not whitelisted

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your deployment URL to:
   - Site URL
   - Redirect URLs
3. Format: `https://your-app.vercel.app` (no trailing slash)

### Build Fails

**Common fixes:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building locally first
npm run build

# Check for TypeScript errors
npm run build -- --mode production
```

### 404 on Refresh (Routing Issues)

**For Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**For Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

---

## Performance Optimization

### Build Size Optimization

Your app is already optimized, but you can further improve:

1. **Enable compression** (most platforms do this automatically)

2. **Code splitting** (already configured via Vite)

3. **Image optimization**
   - Use WebP format when possible
   - Compress images before uploading

### Caching Strategy

Vite automatically handles caching via content hashing in filenames.

---

## Security Checklist

Before deploying to production:

- [ ] Environment variables are set (NOT hardcoded)
- [ ] `.env` file is in `.gitignore` (already done ✅)
- [ ] Supabase RLS policies are enabled (already done ✅)
- [ ] Redirect URLs are whitelisted in Supabase
- [ ] Production URLs use HTTPS
- [ ] No sensitive data in client-side code

---

## Monitoring & Maintenance

### Vercel Analytics (Optional)

1. Enable Vercel Analytics in dashboard
2. Get insights on:
   - Page views
   - Performance metrics
   - User behavior

### Supabase Monitoring

1. Go to Supabase Dashboard
2. Check "Database" → "Logs" for errors
3. Monitor "Auth" → "Users" for signup/login issues

---

## Custom Domain Setup (Optional)

### Vercel
1. Go to Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable SSL (automatic)

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS
4. SSL enabled automatically

---

## Quick Deployment Commands

```bash
# Build locally to test
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (after setup)
vercel

# Deploy to Netlify (after setup)
netlify deploy --prod
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads without errors
- [ ] Login/Signup works
- [ ] All pages are accessible
- [ ] File upload works
- [ ] Database operations work (CGPA, Tasks, etc.)
- [ ] Study timer logs sessions
- [ ] Profile updates save correctly

---

## Getting Help

If you encounter issues:

1. Check deployment platform logs
2. Check browser console for errors
3. Verify environment variables
4. Check Supabase logs
5. Review this guide's troubleshooting section

---

## Recommended: Vercel

For the best experience, we recommend **Vercel**:
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variable management
- ✅ Excellent support for Vite/React
- ✅ Free SSL certificates
- ✅ Edge network (fast globally)
- ✅ Zero-config for most setups

**Deploy to Vercel in 3 steps:**
1. Connect GitHub repository
2. Add environment variables
3. Click Deploy

That's it! 🚀
