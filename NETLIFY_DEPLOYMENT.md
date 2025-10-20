# Deploy Node.js Express API to Netlify

Complete guide to deploy your Supabase API to Netlify.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com)
2. **Netlify CLI** (optional): `npm install -g netlify-cli`
3. **GitHub Account**: For automatic deployments

---

## 🔧 Configuration Files Created

### 1. `netlify.toml`

Configuration file that tells Netlify how to build and route your app.

### 2. `netlify/functions/api.js`

Serverless function wrapper for your Express app.

---

## 📦 Step 1: Install Required Package

Add the `serverless-http` package:

```powershell
npm install serverless-http
```

This package wraps your Express app to work with Netlify's serverless functions.

---

## 🚀 Step 2: Deploy to Netlify

### **Method A: Deploy via Netlify Dashboard (Recommended)**

#### 1. **Push to GitHub**

```powershell
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

#### 2. **Import to Netlify**

- Go to [app.netlify.com](https://app.netlify.com)
- Click "Add new site" → "Import an existing project"
- Choose "GitHub" and authorize Netlify
- Select your repository: `NuReach/Final-API`
- Configure build settings (auto-detected):
  - **Build command**: `npm install`
  - **Publish directory**: `public`
  - **Functions directory**: `netlify/functions`
- Click "Deploy site"

#### 3. **Add Environment Variables**

- Go to Site settings → Environment variables
- Add the following variables:
  - `SUPABASE_URL` = `https://rkwxqswemzzhxxidvcex.supabase.co`
  - `SUPABASE_KEY` = `your-supabase-key`
  - `FRONTEND_URL` = `*` (or your frontend URL)

#### 4. **Redeploy**

- Go to Deploys → Trigger deploy → Deploy site

---

### **Method B: Deploy via Netlify CLI**

#### 1. **Install Netlify CLI**

```powershell
npm install -g netlify-cli
```

#### 2. **Login to Netlify**

```powershell
netlify login
```

#### 3. **Initialize Netlify**

```powershell
netlify init
```

Follow the prompts:

- Create & configure a new site? **Yes**
- Team: **Select your team**
- Site name: **your-api-name** (or leave blank for random)
- Build command: `npm install`
- Directory to deploy: `public`
- Netlify functions folder: `netlify/functions`

#### 4. **Add Environment Variables**

```powershell
netlify env:set SUPABASE_URL "https://rkwxqswemzzhxxidvcex.supabase.co"
netlify env:set SUPABASE_KEY "your-supabase-key"
netlify env:set FRONTEND_URL "*"
```

#### 5. **Deploy**

```powershell
netlify deploy --prod
```

---

## 📁 Project Structure for Netlify

```
supabase-api/
├── netlify/
│   └── functions/
│       └── api.js          ← Netlify serverless function
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   └── config/
├── netlify.toml            ← Netlify configuration
├── package.json
└── .env (local only)
```

---

## 🧪 Test Your Deployment

After deployment, your API will be available at:

```
https://your-site-name.netlify.app
```

Test endpoints:

```powershell
# Test root endpoint
curl https://your-site-name.netlify.app/api/

# Expected response:
# {"message":"hello emenu"}
```

```powershell
# Test auth endpoint
curl https://your-site-name.netlify.app/api/auth/me
```

---

## 🔄 How Netlify Routing Works

With the configuration in `netlify.toml`:

- `https://your-site.netlify.app/api/*` → Routes to your Express app
- `https://your-site.netlify.app/api/auth/login` → Works!
- `https://your-site.netlify.app/api/shops/1` → Works!

All routes are proxied through the `/.netlify/functions/api` function.

---

## 📊 Netlify vs Vercel Comparison

| Feature    | Netlify                    | Vercel                 |
| ---------- | -------------------------- | ---------------------- |
| Setup      | Requires `serverless-http` | Direct Express support |
| Functions  | `netlify/functions/`       | `api/`                 |
| Config     | `netlify.toml`             | `vercel.json`          |
| Free Tier  | 125k requests/month        | 100GB bandwidth        |
| Build Time | Similar                    | Similar                |

---

## 🔧 Environment Variables

### Via Netlify Dashboard:

1. Site settings → Environment variables
2. Add variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `FRONTEND_URL`

### Via Netlify CLI:

```powershell
netlify env:set VARIABLE_NAME "value"
```

### View Environment Variables:

```powershell
netlify env:list
```

---

## 🔍 Troubleshooting

### Issue 1: "Function not found"

**Solution**: Make sure `netlify/functions/api.js` exists and `netlify.toml` is configured correctly.

### Issue 2: CORS errors

**Solution**: Your CORS is already configured to use `FRONTEND_URL` environment variable. Set it in Netlify.

### Issue 3: Import errors

**Solution**: Make sure `serverless-http` is installed:

```powershell
npm install serverless-http
```

### Issue 4: Environment variables not working

**Solution**: Redeploy after adding environment variables:

```powershell
netlify deploy --prod
```

### Issue 5: 404 errors

**Solution**: Check the `[[redirects]]` section in `netlify.toml` is correct.

---

## 📝 Netlify CLI Commands

```powershell
# Login
netlify login

# Initialize site
netlify init

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod

# View deployment logs
netlify logs

# Open site in browser
netlify open

# Open admin dashboard
netlify open:admin

# View environment variables
netlify env:list

# Set environment variable
netlify env:set KEY "value"

# Link to existing site
netlify link
```

---

## 🔄 Automatic Deployments

Once connected to GitHub:

- **main branch** → Automatic production deployment
- **other branches** → Deploy previews
- **Pull requests** → Deploy previews

---

## ⚡ Performance Tips

1. **Cold starts**: First request might be slow (serverless function cold start)
2. **Keep functions small**: Netlify has size limits
3. **Use environment variables**: Don't hardcode configuration
4. **Monitor usage**: Check Netlify dashboard for analytics

---

## 🎯 Quick Deploy Summary

1. **Install dependency**:

   ```powershell
   npm install serverless-http
   ```

2. **Commit and push**:

   ```powershell
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

3. **Deploy on Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Import from GitHub
   - Add environment variables
   - Deploy!

---

## 📚 Additional Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)
- [Serverless HTTP Docs](https://github.com/dougmoscrop/serverless-http)

---

## 🆘 Need Help?

1. Check Netlify function logs in dashboard
2. Test locally with Netlify CLI:
   ```powershell
   netlify dev
   ```
3. Contact Netlify Support: [netlify.com/support](https://www.netlify.com/support/)

---

## ✅ Deployment Checklist

- [ ] Installed `serverless-http` package
- [ ] Created `netlify/functions/api.js`
- [ ] Created `netlify.toml`
- [ ] Committed and pushed to GitHub
- [ ] Created Netlify site
- [ ] Added environment variables
- [ ] Deployed to production
- [ ] Tested API endpoints

---

## 🎉 Success!

Your API should now be live at:

```
https://your-site-name.netlify.app
```

Test it:

```powershell
curl https://your-site-name.netlify.app/api/
```

Expected:

```json
{ "message": "hello emenu" }
```
