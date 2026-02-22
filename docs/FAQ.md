# 🤔 FAQ & Common Issues

## General Questions

### Q: Is this free to use?
**A:** Yes! Cloudflare Pages has a generous free tier (500 builds/month). Your menu will be completely free to host.

### Q: Do I need to know how to code?
**A:** No! The setup is mostly configuration. Once deployed, managing items is done through the admin panel - no coding required.

### Q: Can I customize the design?
**A:** Yes! You can edit CSS variables, colors, fonts, and create custom pages. See [SETUP.md](./SETUP.md#customization).

### Q: How many menu items can I add?
**A:** Cloudflare KV can store very large amounts of data. For most restaurants, hundreds of items is no problem.

### Q: Is my data safe?
**A:** Yes. Cloudflare uses enterprise-grade security. Your data is encrypted in transit (HTTPS) and at rest.

### Q: What if I want to switch hosting later?
**A:** Your data is in Cloudflare KV. You can export it and migrate to another provider.

## Setup Issues

### Q: "wrangler login failed"
**A:** 
1. Make sure you have a Cloudflare account (https://dash.cloudflare.com/)
2. Try again: `npx wrangler login`
3. Clear browser cookies for dash.cloudflare.com
4. Try in a different browser if persistent

### Q: "KV namespace not found"
**A:**
1. Run: `npm run kv:init`
2. Check wrangler.toml has correct:
   - `account_id`
   - `MENU_ITEMS` binding
   - `id` and `preview_id`
3. Verify namespace exists at: https://dash.cloudflare.com/ → KV

### Q: Admin password doesn't work
**A:**
1. Check password in wrangler.toml (watch for spaces)
2. Passwords are case-sensitive
3. Restart dev server: `Ctrl+C` then `npm run dev`
4. On production, verify environment variable is set

### Q: "npm install" fails
**A:**
1. Make sure Node.js 16+ is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules`: `rm -rf node_modules`
4. Try again: `npm install`
5. On Windows, might need to run as Administrator

### Q: Port 8787 already in use
**A:**
```bash
# Kill the process using port 8787
# On Windows:
netstat -ano | findstr :8787
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :8787
kill <PID>
```

## Deployment Issues

### Q: Deployment fails on GitHub
**A:**
1. Check build directory is `public` (not `dist`)
2. Check `account_id` in wrangler.toml
3. Push without secret credentials
4. Check GitHub Actions logs for error details

### Q: Environment variables not working
**A:**
1. Set in Cloudflare Pages dashboard, NOT in code
2. Refresh page after setting variables
3. Wait a few minutes for Cloudflare to propagate
4. Redeploy your project

### Q: Custom domain not working
**A:**
1. Check domain DNS is pointing to Cloudflare
2. Wait 24-48 hours for DNS propagation
3. Use online DNS checker: https://mxtoolbox.com/
4. In Cloudflare, click "Checking nameserver" button

### Q: "Cannot find module" error
**A:**
- This shouldn't happen! All dependencies are built-in.
- If you see it: delete node_modules, run `npm install`

## Admin Panel Issues

### Q: Admin panel is blank/white
**A:**
1. Open DevTools: Press `F12`
2. Check Console tab for error messages
3. Check Network tab - are API calls failing?
4. Clear browser cache: `Ctrl+Shift+Delete`
5. Try incognito window

### Q: Login page shows but authentication fails
**A:**
1. Check ADMIN_PASSWORD is set
2. Verify no spaces before/after password
3. Password is case-sensitive
4. Wait 5 minutes after changing password on production

### Q: Can't type in form fields
**A:**
- Usually browser autocomplete issue
- Try incognito window
- Clear browser cache
- Try different browser

### Q: Image preview not showing
**A:**
1. Check image URL is correct (test in new tab)
2. Image must be publicly accessible
3. Some image hosts block embedding
4. Try: `https://via.placeholder.com/520x300`

## Menu Display Issues

### Q: Menu items don't appear
**A:**
1. Check you've added items via admin panel
2. Hard refresh: `Ctrl+Shift+R`
3. Check browser console for errors
4. Check KV namespace has data:
   - Go to Cloudflare dashboard
   - Look in Workers → KV

### Q: Images not loading
**A:**
1. Test image URL in new tab - must load
2. Check image hosting CORS settings
3. Try different image hosters:
   - ImgBB (recommended)
   - Imgur
   - GitHub raw URLs
4. Test with placeholder: `https://via.placeholder.com/520x300`

### Q: Images load slow
**A:**
1. Compress images before uploading URL
   - Target: under 500KB
   - Use JPG for photos
2. Use image hosting CDN
3. Cloudflare automatically optimizes

### Q: Prices not formatted correctly
**A:**
- Prices are stored exactly as you type them
- Just enter as: `500,000 تومان`
- Format however you like!

## Customization Questions

### Q: How do I change the colors?
**A:** Edit CSS variables in HTML files:
```css
:root {
  --bg: #ded7c5;        /* Change background */
  --maroon: #5b2b2f;    /* Change main color */
  --accent: #d4a574;    /* Change accent */
}
```

### Q: How do I add a new page?
**A:**
1. Create `public/mypage.html`
2. Access at `/mypage.html`
3. Push to GitHub - auto-deployed

### Q: Can I use my own fonts?
**A:** Yes! Add font URLs in `<head>`:
```html
<link href="https://fonts.google.com/..." rel="stylesheet">
```

## Performance Questions

### Q: Why is my site slow?
**A:**
1. Check image sizes (keep under 500KB)
2. Use lazy loading (built-in)
3. Clear Cloudflare cache
4. Check internet speed: https://speedtest.net

### Q: How do I make it faster?
**A:**
1. Optimize images (compress before hosting)
2. Use CDN image hosting
3. Pages caches for 5 minutes
4. Cloudflare automatically optimizes

## Security Questions

### Q: Is the admin panel secure?
**A:** Yes, but remember:
- HTTPS is enforced
- Password is required
- Keep password strong (12+ chars)
- Change periodically

### Q: Can I make the admin password stronger?
**A:** Yes! Update in wrangler.toml or Cloudflare environment variables:
1. Use 12+ characters
2. Mix: uppercase, lowercase, numbers, symbols
3. Example: `Cucinetta@2024#Menu!`

### Q: Should I share my admin URL?
**A:** No security risk - the URL is public, but:
1. Admin panel needs password
2. Password must be correct to access
3. Still, share carefully with employees only

## Account & Billing Questions

### Q: How much does this cost?
**A:** 
- Cloudflare Pages: FREE (500 builds/month)
- Custom domain: FREE if with Cloudflare
- Premium: $20/month for unlimited builds
- **Most restaurants stay on free tier!**

### Q: Do I need a Cloudflare account?
**A:** Yes, free account at https://dash.cloudflare.com/

### Q: Can I use my existing domain?
**A:** Yes! Either:
1. Transfer domain to Cloudflare
2. Keep registrar, point to Cloudflare nameservers
3. Use CNAME if your registrar supports it

## Data & Backup Questions

### Q: How do I backup my menu?
**A:**
1. Your menu is in Cloudflare KV
2. Export via KV dashboard
3. Regular backups happen automatically

### Q: Can I import menu from CSV?
**A:** Currently, add items via admin panel. To bulk import:
1. Use KV API directly
2. Or create a simple import script
3. Let us know if you need help!

### Q: What if I delete an item by mistake?
**A:**
- Once deleted, it's gone
- No undo feature currently
- Keep a backup of important items

## Browser & Device Questions

### Q: What browsers does this work on?
**A:** All modern browsers:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ Works on phones and tablets

### Q: Does it work on mobile?
**A:** Yes! Both menu and admin panel are mobile-friendly.

### Q: Can users print the menu?
**A:** Yes! Users can press `Ctrl+P` to print, or Save as PDF.

## Multiple Locations

### Q: Can I run multiple locations' menus?
**A:** Yes! Options:
1. **Separate projects**: Each location gets own Pages project
2. **Shared project**: Add location filtering to the code
3. **Subdomains**: `location1.menu.cucinetta.ir`, etc.

## Scale & Growth

### Q: What if I have 1000 items?
**A:** Still works! Cloudflare KV handles it fine.

### Q: What if I get 1M visits/month?
**A:** No problem! Cloudflare Pages handles massive traffic.

### Q: When do I need to upgrade?
**A:** You can stay on free tier for most use cases. Consider paid if:
- You need >500 builds/month
- Want 24/7 premium support
- Need advanced analytics

## Getting Help

### Where to get answers?
1. **This FAQ** - check here first
2. **[SETUP.md](./SETUP.md)** - detailed guide
3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - deployment help
4. **Cloudflare Docs** - technical reference
5. **GitHub Issues** - bug reports

### How to report a bug?
1. Describe what you did
2. What you expected to happen
3. What actually happened
4. Error messages (from console)
5. Browser and OS you're using

---

**Still have questions?** Create an issue on GitHub! We're here to help. 💚
