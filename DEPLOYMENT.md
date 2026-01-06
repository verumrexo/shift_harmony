# VKS Shift Planner - GitHub Pages Deployment Guide

## Prerequisites
1. A GitHub account (create one at [github.com](https://github.com))
2. Git installed on your computer

## Step-by-Step Deployment

### 1. Install gh-pages package
```bash
npm install --save-dev gh-pages
```

### 2. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name your repository: `shift_harmony` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README
5. Click "Create repository"

### 3. Update vite.config.js
Open `vite.config.js` and update the `base` path to match your repo name:
```javascript
base: '/shift_harmony/', // Change 'shift_harmony' to your actual repo name
```

### 4. Initialize Git and Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VKS Shift Planner"

# Add your GitHub repository as remote (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/shift_harmony.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. Deploy to GitHub Pages
```bash
# Build and deploy
npm run build
npm run deploy
```

### 6. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select branch: `gh-pages`
4. Click **Save**

### 7. Access Your Site
Your site will be live at:
```
https://USERNAME.github.io/shift_harmony/
```
(Replace USERNAME with your GitHub username)

## Updating Your Site

Whenever you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
npm run build
npm run deploy
```

## Important Notes

✅ **Free Forever**: GitHub Pages is completely free for public repositories
✅ **No Time Limit**: Your site stays online indefinitely
✅ **Custom Domain**: You can add a custom domain later (optional)
✅ **SSL**: Free HTTPS certificate included
✅ **Data Storage**: All data is stored in browser localStorage (client-side only)

## Troubleshooting

**Issue**: Site shows blank page
- **Fix**: Make sure `base` in `vite.config.js` matches your repo name exactly

**Issue**: 404 error
- **Fix**: Check that GitHub Pages is enabled and set to `gh-pages` branch

**Issue**: Changes not showing
- **Fix**: Clear browser cache or wait a few minutes for GitHub to update

## Need Help?
If you encounter any issues, let me know and I'll help you troubleshoot!
