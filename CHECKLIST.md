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
1. Open terminal on your PC
2. Go to your project folder:
   cd menu.cucinetta.ir

3. Run:
   npx wrangler kv:namespace create menu-items

4. Copy the namespace ID from output:
   ✨ Created namespace with id: a1b2c3d4e5f6g7h8i9j0k1l2m

5. Replace "YOUR_NAMESPACE_ID_HERE" in wrangler.toml with it

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
