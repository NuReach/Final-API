# Deploy Node.js Express API to Vercel

This guide will help you deploy your Supabase API to Vercel.

## Prerequisites

1. Install Vercel CLI globally:

```bash
npm install -g vercel
```

2. Create a Vercel account at [vercel.com](https://vercel.com)

## Configuration Files Created

### 1. `vercel.json`

This file tells Vercel how to build and route your application.

### 2. `.vercelignore`

This file tells Vercel which files to ignore during deployment.

## Step-by-Step Deployment

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**

```bash
vercel login
```

2. **Deploy to Vercel**

```bash
vercel
```

- Follow the prompts
- Select your project name
- Choose the default settings
- Your API will be deployed to a preview URL

3. **Deploy to Production**

```bash
vercel --prod
```

### Method 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

2. **Import Project to Vercel**

- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click "Add New Project"
- Import your GitHub repository
- Vercel will auto-detect the settings
- Click "Deploy"

## Environment Variables

⚠️ **IMPORTANT**: You need to add your environment variables to Vercel!

### Via Vercel CLI:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add FRONTEND_URL
```

### Via Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase anon/public key
   - `FRONTEND_URL` - Your frontend URL (for CORS and password reset)
   - `PORT` (optional) - Vercel sets this automatically

## Update CORS Configuration

After deployment, update your `src/app.js` CORS settings to include your production frontend URL:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    credentials: true,
  })
);
```

Or allow all origins (not recommended for production):

```javascript
app.use(cors());
```

## Vercel Deployment URLs

- **Preview deployments**: Every push to GitHub creates a preview URL
- **Production URL**: `https://your-project-name.vercel.app`

## Testing Your Deployed API

Once deployed, test your API:

```bash
# Replace with your Vercel URL
curl https://your-project-name.vercel.app/api/

# Expected response:
# {"message":"hello emenu"}
```

## Common Issues & Solutions

### 1. **"Module not found" errors**

- Make sure all imports use `.js` extensions
- Check that `"type": "module"` is in package.json

### 2. **Environment variables not working**

- Redeploy after adding environment variables

```bash
vercel --prod
```

### 3. **CORS errors**

- Update CORS configuration to include your frontend domain
- Check that credentials are properly set

### 4. **File upload issues**

- Vercel has a serverless function size limit (50MB)
- Consider using Supabase Storage for file uploads (already implemented)

### 5. **Timeout errors**

- Vercel serverless functions have a 10-second timeout on free tier
- Optimize long-running operations

## Project Structure for Vercel

```
supabase-api/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Entry point
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── vercel.json             # Vercel configuration
├── .vercelignore          # Files to ignore
├── package.json
└── .env (local only)
```

## Vercel CLI Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

## Updating Your Deployment

Every time you push to GitHub (if connected), Vercel automatically deploys:

- **main/master branch** → Production
- **other branches** → Preview deployments

Or manually deploy:

```bash
git add .
git commit -m "Update API"
git push origin main
# Vercel auto-deploys, or run: vercel --prod
```

## Performance Tips

1. **Enable caching** where appropriate
2. **Use environment variables** for configuration
3. **Optimize database queries** (already using Supabase)
4. **Monitor logs** via Vercel dashboard

## Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Guide](https://vercel.com/docs/frameworks/express)
- [Your Vercel Dashboard](https://vercel.com/dashboard)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test locally with `npm run dev`
4. Check Vercel documentation

---

**Your API is now ready to deploy to Vercel! 🚀**
