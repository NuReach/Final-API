# 🔧 Vercel Deployment Fix Guide

## ✅ What Was Fixed:

1. **Created `api/index.js`** - Proper Vercel serverless entry point
2. **Updated `vercel.json`** - Points to the correct entry file
3. **Updated CORS in `app.js`** - Uses environment variable for frontend URL
4. **Added `FRONTEND_URL` to `.env`** - For local development

---

## 🚀 Deploy to Vercel - Updated Commands

### Step 1: Commit the Changes
```powershell
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```powershell
# If not installed yet
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

When prompted:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N** (or **Y** if you already created one)
- What's your project's name? **supabase-api**
- In which directory is your code located? **./** (press Enter)

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Click "Deploy"

### Step 3: Add Environment Variables to Vercel

**Via CLI:**
```powershell
vercel env add SUPABASE_URL production
# Paste: https://rkwxqswemzzhxxidvcex.supabase.co

vercel env add SUPABASE_KEY production
# Paste your Supabase key

vercel env add FRONTEND_URL production
# Paste: https://your-frontend-url.vercel.app
# Or use: * for development (allows all origins)
```

**Via Dashboard:**
1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add each variable:
   - `SUPABASE_URL` = `https://rkwxqswemzzhxxidvcex.supabase.co`
   - `SUPABASE_KEY` = `your-key`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app` or `*`

### Step 4: Deploy to Production
```powershell
vercel --prod
```

---

## 📁 New Project Structure for Vercel

```
supabase-api/
├── api/
│   └── index.js          ← New! Vercel entry point
├── src/
│   ├── app.js            ← Updated CORS
│   ├── server.js         ← For local development
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── vercel.json           ← Updated to use api/index.js
├── .env                  ← Added FRONTEND_URL
├── .gitignore
└── package.json
```

---

## 🧪 Test Your Deployment

After successful deployment:

```powershell
# Test root endpoint
curl https://your-project.vercel.app/api/

# Expected response:
# {"message":"hello emenu"}
```

```powershell
# Test auth endpoint
curl https://your-project.vercel.app/api/auth/me
```

---

## 🔍 Troubleshooting

### Issue 1: "An unexpected error happened"
✅ **FIXED**: We created `api/index.js` as the proper entry point

### Issue 2: CORS errors
✅ **FIXED**: Updated CORS to use `FRONTEND_URL` environment variable

### Issue 3: Environment variables not working
**Solution**: Make sure to redeploy after adding environment variables
```powershell
vercel --prod
```

### Issue 4: Import errors
**Solution**: Ensure all imports use `.js` extensions
```javascript
import app from "./src/app.js";  // ✅ Correct
import app from "./src/app";     // ❌ Wrong for ES modules
```

### Issue 5: Build still failing
**Try these steps:**
1. Delete the `.vercel` folder (if exists)
2. Run `vercel --prod` again
3. Check the build logs in Vercel dashboard
4. Make sure all dependencies are in `package.json`, not just `devDependencies`

---

## 📊 Vercel Logs

To check deployment logs:
```powershell
vercel logs
```

Or view in dashboard:
https://vercel.com/your-username/your-project/deployments

---

## ⚡ Local Development vs Production

### Local Development (localhost):
```powershell
npm run dev
# Uses src/server.js
# Runs on http://localhost:3000
```

### Production (Vercel):
```
Uses api/index.js
Runs as serverless function
Accessible at https://your-project.vercel.app
```

Both use the same `src/app.js` Express application!

---

## 🎯 Quick Redeploy

Anytime you make changes:

```powershell
git add .
git commit -m "Update API"
git push origin main
```

If connected to GitHub, Vercel auto-deploys.
Or manually deploy:
```powershell
vercel --prod
```

---

## ✅ Deployment Checklist

- [x] Created `api/index.js`
- [x] Updated `vercel.json`
- [x] Updated CORS configuration
- [x] Added `FRONTEND_URL` to `.env`
- [ ] Committed and pushed to GitHub
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel
- [ ] Tested API endpoints

---

## 🆘 Still Having Issues?

1. **Check Vercel deployment logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the failed deployment
   - Check the build logs

2. **Verify environment variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Make sure all 3 variables are set

3. **Test locally first**
   ```powershell
   npm run dev
   # Visit http://localhost:3000/api/
   ```

4. **Contact Vercel Support**
   - https://vercel.com/help

---

## 🎉 Success!

Your API should now be deployed successfully at:
```
https://your-project-name.vercel.app
```

Test it:
```powershell
curl https://your-project-name.vercel.app/api/
```

Expected response:
```json
{"message":"hello emenu"}
```