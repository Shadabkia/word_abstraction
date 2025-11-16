# 🚀 Deploy to Vercel

This guide will help you deploy your Design Word Merge game to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. [Git](https://git-scm.com/) installed
3. A [GitHub](https://github.com/) account (recommended)

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Word Merge Game"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
6. Click **"Deploy"**

### Step 3: Wait for Deployment

Vercel will:
- Install dependencies
- Build your project
- Deploy to a production URL

You'll get a URL like: `https://your-project-name.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project directory:

```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: **design-word-merge** (or your choice)
- Directory: **./build**
- Override settings: **N**

---

## Configuration Files

Your project now includes:

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Vite builds correctly
- SPA routing works properly
- All routes redirect to index.html

### `package.json` scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Environment Variables (Optional)

If you need environment variables:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variables like:
   - `VITE_API_URL`
   - `VITE_APP_NAME`
4. Redeploy your project

In your code, access them via:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Custom Domain (Optional)

### Add a Custom Domain

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain name
5. Follow DNS configuration instructions

---

## Continuous Deployment

Once connected to GitHub:

- **Every push to main** triggers a production deployment
- **Every pull request** creates a preview deployment
- **Preview URLs** are unique for each branch/PR

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments**
4. Click on the failed deployment
5. Review the build logs

**Common fixes:**
```bash
# Locally test the build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify all dependencies are installed
npm install
```

### 404 Errors on Refresh

Make sure `vercel.json` has the rewrites configuration (already included).

### Slow Build Times

- Vercel caches `node_modules` between builds
- First build may take 2-3 minutes
- Subsequent builds: 30-60 seconds

---

## Local Preview

Test the production build locally before deploying:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Open `http://localhost:4173` to test.

---

## Deployment Checklist

- [x] `package.json` has build script
- [x] `vercel.json` configured
- [x] `.gitignore` includes `node_modules`, `build`, `.env*`
- [x] `.vercelignore` excludes unnecessary files
- [x] TypeScript configured (`tsconfig.json`)
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Deployment successful
- [ ] Custom domain configured (optional)

---

## Project Info

- **Framework**: React 18 + TypeScript + Vite
- **Build Time**: ~1-2 minutes
- **Build Output**: `build/` directory
- **Production URL**: Will be provided after deployment

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

## Summary

Your project is now ready for Vercel deployment! 🎉

**Quick Deploy:**
```bash
git push origin main  # If using GitHub auto-deploy
# OR
vercel --prod         # If using Vercel CLI
```

Your game will be live at: `https://your-project.vercel.app`

