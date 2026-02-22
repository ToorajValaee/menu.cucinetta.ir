🔧 SETUP CHECKLIST - Fill These In

Follow these steps on YOUR PC (localhost):

STEP 1: Get Account ID
===============================
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Copy your "Account ID" value
3. Replace "YOUR_ACCOUNT_ID_HERE" in wrangler.toml with it

Example account ID:
  a1b2c3d4e5f6g7h8i9j0k1l2m

STEP 2: Create KV Namespace  
===============================

OPTION A: Create via Cloudflare Dashboard (EASIEST)
---------------------------------------------------
1. Go to: https://dash.cloudflare.com
2. Click "Workers" → "KV" in the left sidebar
3. Click "Create namespace"
4. Type name: "menu-items"
5. Click "Add"
6. Copy the "Namespace ID" shown
7. Replace "YOUR_NAMESPACE_ID_HERE" in wrangler.toml with it

OPTION B: Create via Command Line
----------------------------------
1. Go to your project folder:
   cd menu.cucinetta.ir

2. Make sure dependencies are fresh:
   npm install --force

3. Make sure you're logged in:
   npx wrangler login

4. Then create namespace:
   npx wrangler kv:namespace create "menu-items"

5. Copy the namespace ID from output
6. Replace "YOUR_NAMESPACE_ID_HERE" in wrangler.toml with it

⭐ RECOMMENDED: Use Option A (Cloudflare Dashboard) - it's faster and simpler!

STEP 3: Set Admin Password
===============================
In wrangler.toml, replace:
   ADMIN_PASSWORD = "changeme123"
   
With your password (choose something secure!):
   ADMIN_PASSWORD = "MyPassword@2024"

STEP 4: Verify & Test
===============================
1. Save wrangler.toml
2. Run locally:
   npm run dev

3. Test at:
   http://localhost:8787/admin/
   
4. Login with your password

STEP 5: Deploy
===============================
1. Commit changes:
   git add wrangler.toml
   git commit -m "Add Cloudflare credentials"
   git push origin main

2. Go to Cloudflare Pages dashboard
3. Connect your GitHub repo
4. Set publish directory: public
5. Add ADMIN_PASSWORD environment variable
6. Deploy!

✅ YOU'RE DONE!

Questions?
- Check docs/SETUP.md for detailed guide
- Check docs/FAQ.md for common issues
