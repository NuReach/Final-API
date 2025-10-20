# 🚀 Quick Deployment Checklist

Follow these steps to deploy your API to Vercel:

## ✅ Pre-Deployment Checklist

- [ ] All code is committed to Git
- [ ] Environment variables are documented
- [ ] `.env` file is NOT committed (it's in `.gitignore`)
- [ ] `vercel.json` is created
- [ ] `package.json` has `start` script

## 🎯 Quick Deploy (5 minutes)

### Option A: Using Vercel CLI (Fastest)

1. **Install Vercel CLI**
```powershell
npm install -g vercel
```

2. **Login to Vercel**
```powershell
vercel login
```

3. **Deploy**
```powershell
vercel
```

4. **Add Environment Variables**
```powershell
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add FRONTEND_URL
```
(Enter the values when prompted)

5. **Deploy to Production**
```powershell
vercel --prod
```

✅ **Done!** Your API is live at the URL shown in the terminal.

---

### Option B: Using GitHub + Vercel Dashboard

1. **Push to GitHub**
```powershell
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Go to Vercel**
- Visit: https://vercel.com/new
- Import your GitHub repository
- Click "Deploy"

3. **Add Environment Variables**
- Go to Project Settings → Environment Variables
- Add:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `FRONTEND_URL`

4. **Redeploy**
- Go to Deployments → Click "Redeploy"

✅ **Done!** Your API is live!

---

## 📝 Environment Variables Needed

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🧪 Test Your Deployment

After deployment, test your API:

```powershell
# Replace with your actual Vercel URL
curl https://your-project.vercel.app/api/
```

Expected response:
```json
{"message":"hello emenu"}
```

## 🔧 Update CORS After Deployment

After you know your frontend URL, update `src/app.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);
```

Then redeploy:
```powershell
git add .
git commit -m "Update CORS"
git push origin main
```

---

## 🎉 You're Live!

Your API endpoints:
- Root: `https://your-project.vercel.app/api/`
- Auth: `https://your-project.vercel.app/api/auth/...`
- Shops: `https://your-project.vercel.app/api/shops/...`
- Menu Designs: `https://your-project.vercel.app/api/menu-designs/...`

## 📚 Need More Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions.