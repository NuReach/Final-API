# 🚀 Quick Netlify Deployment Commands

## Step 1: Install Required Package

```powershell
npm install serverless-http
```

## Step 2: Commit Changes

```powershell
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

## Step 3: Deploy via Netlify Dashboard (Easiest)

1. **Go to Netlify**: https://app.netlify.com

2. **Click "Add new site"** → "Import an existing project"

3. **Connect to GitHub** and select your repository

4. **Configure build settings** (auto-detected):

   - Build command: `npm install`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

5. **Click "Deploy site"**

6. **Add Environment Variables**:

   - Go to Site settings → Environment variables
   - Add:
     - `SUPABASE_URL` = `https://rkwxqswemzzhxxidvcex.supabase.co`
     - `SUPABASE_KEY` = `your-key`
     - `FRONTEND_URL` = `*`

7. **Redeploy**: Deploys → Trigger deploy

## ✅ Done!

Your API will be live at: `https://your-site-name.netlify.app`

Test:

```powershell
curl https://your-site-name.netlify.app/api/
```

---

## Alternative: Deploy via Netlify CLI

```powershell
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Add environment variables
netlify env:set SUPABASE_URL "https://rkwxqswemzzhxxidvcex.supabase.co"
netlify env:set SUPABASE_KEY "your-key"
netlify env:set FRONTEND_URL "*"

# Deploy
netlify deploy --prod
```

---

See `NETLIFY_DEPLOYMENT.md` for detailed instructions.
