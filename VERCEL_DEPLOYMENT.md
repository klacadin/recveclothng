# Deploy to Vercel

## Prerequisites
1. Vercel account (free at https://vercel.com)
2. GitHub repository with your code
3. Your Supabase credentials

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - REVE Clothing app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/reveclothingxnobody.git
git push -u origin main
```

## Step 2: Deploy to Vercel (Option A - Via CLI)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Step 3: Deploy to Vercel (Option B - Via Web Dashboard)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account
5. Select your repository
6. Click "Import"
7. In "Environment Variables", add:
   - `VITE_SUPABASE_URL`: `https://unaodlytdymouicuuywb.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your anon key
8. Click "Deploy"

## Environment Variables to Set in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://unaodlytdymouicuuywb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[your-anon-key]
```

## Your Production URLs

After deployment, Vercel will provide:
- Production URL: `https://your-project.vercel.app`
- Preview URLs for each PR
- Automatic deployments on git push

## Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your domain: `reveclothingxnobody.com`
3. Update DNS records to point to Vercel
4. Vercel will auto-configure SSL/TLS

## Monitoring & Logs

- View logs: Vercel Dashboard → Deployments → Click deployment
- Real-time analytics: Vercel Dashboard → Analytics
- Error tracking: Vercel Dashboard → Errors

## Rollback to Previous Version

1. Go to Deployments
2. Click the deployment you want
3. Click "Promote to Production"

## Important Notes

- ✅ Free tier supports unlimited deployments
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN included
- ✅ Serverless functions (if you add /api routes)
- ⚠️ Your Supabase credentials are in environment variables (secure)
- ⚠️ Database stays on Supabase (not included in Vercel)
