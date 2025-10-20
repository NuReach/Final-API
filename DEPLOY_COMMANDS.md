# 🚀 Deploy to Vercel - Run These Commands

## Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

## Step 2: Login to Vercel
```powershell
vercel login
```
(This will open your browser to login)

## Step 3: Deploy to Vercel
```powershell
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- What's your project's name? **supabase-api** (or your preferred name)
- In which directory is your code located? **./** (press Enter)

## Step 4: Add Environment Variables
```powershell
vercel env add SUPABASE_URL
```
Paste your Supabase URL when prompted

```powershell
vercel env add SUPABASE_KEY
```
Paste your Supabase Key when prompted

```powershell
vercel env add FRONTEND_URL
```
Paste your Frontend URL when prompted

## Step 5: Deploy to Production
```powershell
vercel --prod
```

## ✅ Done!

Your API is now live! The URL will be shown in the terminal.

Test it:
```powershell
curl https://your-url.vercel.app/api/
```

---

## Alternative: Quick Deploy via GitHub

```powershell
# 1. Commit and push
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import your repository
# 4. Add environment variables in settings
# 5. Click Deploy
```

---

## Update After Deployment

To deploy updates:
```powershell
git add .
git commit -m "Update API"
git push origin main
```

Vercel auto-deploys from GitHub, or run:
```powershell
vercel --prod
```