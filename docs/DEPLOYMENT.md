# 🚀 Deployment Guide to Cloudflare Pages

This guide walks you through deploying the CUCINETTA Menu Management System to Cloudflare Pages.

## Prerequisites

- ✅ Completed local setup (can run `npm run dev`)
- ✅ GitHub account with your code pushed
- ✅ Cloudflare account (free tier works)

## Option 1: Automatic Deployment (Recommended)

### Step 1: Push to GitHub

Make sure your code is on GitHub:

```bash
git add .
git commit -m "Initial commit: CUCINETTA menu system"
git push origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to **https://dash.cloudflare.com/**
2. Click **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select GitHub (or your Git provider)
6. Authorize Cloudflare to access your GitHub account
7. Select your `menu.cucinetta.ir` repository
8. Click **Begin setup**

### Step 3: Configure Build Settings

You should see a deployment configuration screen:

- **Production branch**: `main`
- **Build command**: *(leave empty)*
- **Build output directory**: `public`

Just click **Continue** for these settings.

### Step 4: Add Environment Variables

**This is VERY IMPORTANT!**

1. In the Cloudflare Pages setup, find **Environment variables**
2. Click **Add variable**
3. Enter:
   - **Variable name**: `ADMIN_PASSWORD`
   - **Value**: Your secure admin password
4. Click **Add variable** again if you have multiple environments
5. For Production environment:
   - Name: `ADMIN_PASSWORD`
   - Value: Your password

### Step 5: Deploy

Click **Save and Deploy**

Cloudflare will:
- Clone your repository
- Build your site
- Deploy to Cloudflare's global network

Wait for the deployment to complete. You'll see a URL like:
`https://menu-cucinetta.pages.dev`

### Step 6: Set Custom Domain

To use your own domain (e.g., `menu.cucinetta.ir`):

1. In Cloudflare Pages, go to your project settings
2. Click **Custom domain**
3. Enter your domain
4. Follow the DNS setup instructions
5. DNS is usually set up within minutes

**Done!** Your menu is now live! 🎉

## Option 2: Manual Deployment with Wrangler

If you prefer to deploy from your terminal:

```bash
npm run deploy
```

You'll need:
- Wrangler configured with your account
- KV namespace set up
- `wrangler.toml` with correct settings

## Option 3: Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: menu-cucinetta
          directory: public
          productionBranch: main
```

Then add secrets in GitHub:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID

## After Deployment

### Verify It Works

1. Visit your deployment URL
2. Check the public menu page
3. Go to `/admin/` to test the admin panel
4. Test adding/editing/deleting items

### Set Up KV Namespace

If you haven't already:

```bash
npm run kv:init
```

Then update your Cloudflare Pages project with the KV namespace IDs:

1. Go to your Pages project settings
2. Click **Functions** (or **KV Namespace**)
3. Add binding:
   - **Variable name**: `MENU_ITEMS`
   - **Namespace ID**: Your KV namespace ID

### Troubleshooting Deployment

**"KV namespace not found"**
- Ensure KV namespace is bound in Cloudflare Pages
- Check namespace IDs match
- Re-run `npm run kv:init`

**"Admin password not working"**
- Verify `ADMIN_PASSWORD` is set in environment variables
- Values are case-sensitive
- No extra spaces in the password

**"Images not loading"**
- Image hosting service may have CORS restrictions
- Try different image hosting (ImgBB, Imgur)
- Test image URLs in browser

**"Page shows error instead of menu"**
- Check browser console (F12)
- Look for API errors
- Verify KV namespace is working
- Try clearing Cloudflare cache

## Updating After Deployment

### Small Changes (CSS, HTML)
Just push to GitHub - automatic deployment will update your site in minutes.

### Admin Password Change
1. Update `ADMIN_PASSWORD` in Cloudflare Pages environment variables
2. Redeploy or wait for next git push
3. No code changes needed

### Major Updates
1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub
4. Cloudflare automatically redeploys

## Caching & Performance

Your public menu is cached for 5 minutes. If you need changes to appear immediately:

1. Go to Cloudflare dashboard
2. Go to your domain
3. Click **Caching**
4. Click **Purge everything**
5. Refresh your site

Or use the API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

## Custom Domain Setup

### Using Cloudflare as Registrar

1. Transfer domain to Cloudflare (or register)
2. Cloudflare Pages → Custom Domain
3. Cloudflare handles DNS automatically
4. Done!

### Using External Registrar

1. Get your Cloudflare nameservers
2. Update your domain's nameservers at your registrar
3. DNS updates can take 24-48 hours
4. Once propagated, set custom domain in Cloudflare Pages

Or use CNAME (if supported):
1. In Cloudflare Pages → Custom Domain
2. Get your CNAME value
3. Add CNAME record at your registrar pointing to Cloudflare

## Git Operations

### Pushing Updates

```bash
git add .
git commit -m "Update menu items"
git push origin main
```

Cloudflare automatically redeploys!

### Branch Deployments

Push to different branches to get preview deployments:

```bash
git checkout -b staging
git push origin staging
```

Cloudflare gives you a unique URL for testing.

## Security Checklist

- ✅ Never commit `wrangler.toml` with real credentials
- ✅ Use strong `ADMIN_PASSWORD` (12+ chars)
- ✅ Set environment variables in Cloudflare, not in code
- ✅ Use HTTPS only (Cloudflare enforces this)
- ✅ Keep dependencies updated
- ✅ Rotate passwords periodically

## Monitoring & Analytics

Cloudflare Pages shows:
- **Deployment analytics**
- **Request analytics**
- **Build times**
- **Status checks**

Visit your Pages project dashboard to view these.

## Cost

**Cloudflare Pages pricing (as of 2024):**
- ✅ **Free**: 500 builds/month, unlimited bandwidth
- 💙 **Unlimited**: $20/month for unlimited builds

Most projects stay on free tier! 🎉

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. Setup custom domain
3. Add menu items via admin panel
4. Upload real images
5. Share your menu!

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [GitHub Issues](../../issues)

---

**Your menu is now live on the Internet!** 🍝✨
