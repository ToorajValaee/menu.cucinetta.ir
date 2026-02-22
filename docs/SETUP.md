# 🍝 CUCINETTA - Complete Setup Guide

A modern, serverless menu management system built for Cloudflare Pages with an admin panel for managing menu items, images, and prices.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [API Reference](#api-reference)
7. [Customization](#customization)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Security](#security)

## Features

✨ **Public Menu**
- Beautiful, responsive design with RTL (Persian) support
- Lazy-loaded images for optimal performance
- Real-time menu updates from database
- Mobile-friendly interface

🎛️ **Admin Panel**
- Secure password-protected interface
- Add, edit, and delete menu items
- Image URL management with live preview
- Real-time UI updates
- Beautiful, intuitive interface

⚡ **Performance**
- Serverless architecture (Cloudflare Pages)
- KV storage for instant data access
- Lazy image loading reduces bandwidth usage
- 5-minute caching for public menu
- Optimized for speed

🔒 **Security**
- Password-protected admin area
- Token-based authentication
- HTTPS enforced (Cloudflare Pages)
- Input validation
- Secure credential handling

## Prerequisites

Before you start, you'll need:

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Cloudflare Account** (free tier works: [Sign up](https://dash.cloudflare.com/sign-up))
- **GitHub Account** (to host your repository)

## Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ToorajValaee/menu.cucinetta.ir.git
cd menu.cucinetta.ir

# Or if you've forked it:
git clone https://github.com/YOUR_USERNAME/menu.cucinetta.ir.git
cd menu.cucinetta.ir
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs Wrangler and other required dependencies.

### Step 3: Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens your browser to allow you to log in to Cloudflare. Grant permission and return to the terminal.

### Step 4: Create KV Namespace

KV is Cloudflare's key-value storage where your menu items will be stored.

```bash
npm run kv:init
```

The command will output something like:
```
✨ Created namespace with id: a1b2c3d4e5f6g7h8i9j0k1l2m3
✨ Created preview namespace with id: z9y8x7w6v5u4t3s2r1q0p9o8n
```

**Copy these IDs** - you'll need them next.

### Step 5: Update Configuration

Open `wrangler.toml` in your editor and update:

```toml
name = "menu-cucinetta"
type = "javascript"
account_id = "your-cloudflare-account-id"    # From https://dash.cloudflare.com/profile/api-tokens

[[kv_namespaces]]
binding = "MENU_ITEMS"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3"            # From npm run kv:init
preview_id = "z9y8x7w6v5u4t3s2r1q0p9o8n"     # From npm run kv:init

[vars]
ADMIN_PASSWORD = "your-secure-password-here"  # Create a strong password
```

**Find your Account ID:**
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Copy your Account ID from the top of the page

### Step 6: Run Locally

```bash
npm run dev
```

Your site is now running at:
- **Menu**: `http://localhost:8787/`
- **Admin**: `http://localhost:8787/admin/`
- **Login to admin** with the password you set in `wrangler.toml`

Press `Ctrl+C` to stop the server.

## Configuration

All configuration is in `wrangler.toml`:

```toml
# Project name
name = "menu-cucinetta"

# Your Cloudflare account ID
account_id = "your-account-id"

# KV namespace binding
[[kv_namespaces]]
binding = "MENU_ITEMS"
id = "production-namespace-id"
preview_id = "preview-namespace-id"

# Admin password
[vars]
ADMIN_PASSWORD = "your-password"
```

## Usage

### Public Menu Page (`/`)

The public menu displays all items from your database:

1. Open `http://localhost:8787/` (or your domain)
2. Browse menu items
3. Images load lazily as you scroll
4. Click the "مدیریت" (Manage) button to access admin panel

### Admin Panel (`/admin/`)

#### Login
1. Click the "مدیریت" button on the menu page
2. Enter your admin password
3. Click "ورود" (Enter)

#### View Items
All current menu items are displayed as cards showing:
- Item image (if available)
- Item name
- Item description
- Price
- Edit and delete buttons

#### Add New Item
1. Click "➕ افزودن منو جدید" (Add New Menu)
2. Fill in the form:
   - **نام (اسم)**: Item name (e.g., "ROSSO")
   - **توضیحات**: Description (e.g., "بلونز ، سس گوجه، بشامل")
   - **قیمت**: Price (e.g., "835,000 تومان")
   - **URL تصویر**: Image URL (e.g., "https://example.com/rosso.jpg")
3. Image preview appears as you enter the URL
4. Click "ذخیره" (Save)

#### Edit Item
1. Click "✏️ ویرایش" (Edit) on any item
2. Change the fields you want to update
3. Click "ذخیره" (Save)

#### Delete Item
1. Click "🗑️ حذف" (Delete) on any item
2. Confirm the deletion

#### Logout
Click "🚪 خروج" (Logout) to log out and return to the menu.

## API Reference

### Base URL
- Local: `http://localhost:8787/api`
- Production: `https://menu.cucinetta.ir/api`

### Authentication

**Endpoint**: `POST /api/auth`

Request:
```json
{
  "password": "your-admin-password"
}
```

Response (Success):
```json
{
  "token": "base64-encoded-token",
  "message": "Authenticated"
}
```

Response (Error):
```json
{
  "error": "Invalid password"
}
```

### Menu Items

#### Get All Items (Public)
**Endpoint**: `GET /api/items`

No authentication required.

Response:
```json
[
  {
    "id": "1645000000000",
    "name": "ROSSO",
    "description": "بلونز ، سس گوجه، بشامل",
    "price": "835,000 تومان",
    "image": "https://example.com/rosso.jpg",
    "createdAt": "2024-02-22T10:00:00.000Z"
  }
]
```

#### Create Item
**Endpoint**: `POST /api/items`

Requires header: `X-Admin-Token: <your-token>`

Request:
```json
{
  "name": "ROSSO",
  "description": "بلونز ، سس گوجه، بشامل",
  "price": "835,000 تومان",
  "image": "https://example.com/rosso.jpg"
}
```

Response:
```json
{
  "id": "1645000000000",
  "name": "ROSSO",
  "description": "بلونز ، سس گوجه، بشامل",
  "price": "835,000 تومان",
  "image": "https://example.com/rosso.jpg",
  "createdAt": "2024-02-22T10:00:00.000Z"
}
```

#### Update Item
**Endpoint**: `PUT /api/items`

Requires header: `X-Admin-Token: <your-token>`

Request:
```json
{
  "id": "1645000000000",
  "name": "ROSSO UPDATED",
  "description": "Updated description",
  "price": "900,000 تومان",
  "image": "https://example.com/rosso-new.jpg"
}
```

#### Delete Item
**Endpoint**: `DELETE /api/items`

Requires header: `X-Admin-Token: <your-token>`

Request:
```json
{
  "id": "1645000000000"
}
```

Response:
```json
{
  "success": true
}
```

## Image Hosting

You need a way to host your menu images. Here are recommended options:

### Option 1: Cloudflare Images (Recommended)
- Integrated with Cloudflare
- Automatic optimization
- [Documentation](https://developers.cloudflare.com/images/)

### Option 2: ImgBB (Free, No Account)
1. Go to https://imgbb.com
2. Upload an image
3. Copy the link (choose "Direct Image Link")
4. Paste in admin panel

Example: `https://i.ibb.co/abc123/image.jpg`

### Option 3: Imgur
1. Go to https://imgur.com
2. Upload an image
3. Right-click → Copy image address
4. Paste in admin panel

Example: `https://i.imgur.com/abcdef.jpg`

### Option 4: GitHub
1. Create a folder in your repo (e.g., `/images/`)
2. Commit and push image files
3. Use raw GitHub URL:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/menu.cucinetta.ir/main/images/image.jpg
   ```

### Option 5: Your Own Server
If you have a server, upload images there and use their URLs.

**Tip**: Keep images under 500KB for best performance. Use JPG for photos (better compression) and PNG for graphics.

## Customization

### Change Colors
Edit the CSS variables in:
- `/public/index.html` (public menu)
- `/public/admin/index.html` (admin panel)

```css
:root {
  --bg: #ded7c5;        /* Background color */
  --maroon: #5b2b2f;    /* Primary color */
  --accent: #d4a574;    /* Button/accent color */
  --danger: #dc3545;    /* Delete button color */
  --success: #28a745;   /* Save button color */
}
```

### Change Page Title
Update in both HTML files:
```html
<title>غذای اصلی | CUCINETTA</title>  <!-- public/index.html -->
<title>پنل مدیریت | CUCINETTA</title>  <!-- public/admin/index.html -->
```

### Change Admin Password
Update in `wrangler.toml`:
```toml
[vars]
ADMIN_PASSWORD = "your-new-secure-password"
```

Then restart the dev server or redeploy.

### Add Custom Pages
1. Create new HTML file in `/public/` (e.g., `/public/about.html`)
2. Access at `http://localhost:8787/about.html`
3. Deployed pages are auto-served by Cloudflare

## Deployment

### Deploy to Cloudflare Pages

#### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com/
   - Click "Pages" → "Create a project"
   - Click "Connect to Git"
   - Select your repository
   - Click "Begin setup"

3. **Configure Build Settings**
   - **Production branch**: `main`
   - **Build command**: (leave empty)
   - **Build output directory**: `public`

4. **Set Environment Variables** (important!)
   - Click "Environment variables"
   - Add variable: `ADMIN_PASSWORD` = `your-password`
   - Save

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete
   - Your site is now live!

#### Method 2: Git Integration with Custom Domain

1. Deploy using Method 1 above
2. Go back to your Pages project
3. Click "Custom domain"
4. Enter your domain (e.g., `menu.cucinetta.ir`)
5. Follow the DNS setup instructions

#### Method 3: Manual Deployment

```bash
# Deploy immediately
npm run deploy
```

**Note**: Manual deployment requires wrangler to be configured with your credentials.

## Troubleshooting

### Admin Panel Shows Blank Screen
**Problem**: Admin page is empty or doesn't load

**Solutions**:
1. Open browser console: Press `F12` → Look for errors
2. Check `ADMIN_PASSWORD` is set in `wrangler.toml`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Clear localStorage: Open console `>` type `localStorage.clear()`
5. Try incognito/private window

### Wrong Password Error
**Problem**: Password doesn't work even though it's correct

**Solutions**:
1. Check `ADMIN_PASSWORD` in `wrangler.toml` (watch for spaces)
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Redeploy to Cloudflare: `npm run deploy`

### Images Not Loading
**Problem**: Images show placeholder but don't load

**Solutions**:
1. Right-click image → "Open image in new tab" to test URL
2. Verify URL is correct and accessible
3. Check CORS: Image hosting must allow your domain
4. Try a different image URL for testing
5. Use test image: `https://via.placeholder.com/520x300`

### Changes Not Appearing on Live Site
**Problem**: Updates don't show on production

**Solutions**:
1. Menu is cached for 5 minutes - wait and refresh
2. Hard refresh: `Ctrl+Shift+R` on Windows/Linux or `Cmd+Shift+R` on Mac
3. Clear Cloudflare cache: Go to Cloudflare → Caching → Purge everything
4. Check you're logged in before making changes
5. Check developer console for API errors

### KV Namespace Errors
**Problem**: "KV not found" or similar KV errors

**Solutions**:
1. Verify namespace ID in `wrangler.toml` is correct
2. Run `npm run kv:init` again
3. Update both `id` and `preview_id` fields
4. Check `account_id` matches your Cloudflare account
5. Restart dev server

### Deployment Fails
**Problem**: Deployment to Cloudflare Pages fails

**Solutions**:
1. Check build output directory is `public`
2. Verify files exist in `/public/` folder
3. Check environment variables are set
4. Review deployment logs in Cloudflare dashboard
5. Try manual deployment: `npm run deploy`

## Security

⚠️ **Important Security Guidelines**:

### Strong Admin Password
- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and symbols
- Don't use common words or personal info
- Example: `Cucinetta@2024#Menu!`

### Do Not Share Credentials
- Never commit `wrangler.toml` with real passwords to public repos
- Use environment variables in Cloudflare instead
- Rotate passwords regularly

### HTTPS Only
- Cloudflare Pages always uses HTTPS
- Never access admin panel over HTTP
- All data is encrypted in transit

### Access Control
- Keep admin password confidential
- Change password if you suspect exposure
- Log out when finished

### Update Regularly
- Keep Node.js updated
- Update dependencies: `npm update`
- Monitor for security advisories

### Rate Limiting (Optional)
For production with high traffic, consider:
- Adding rate limiting via Cloudflare Firewall
- Implementing CAPTCHA on login
- Using stronger auth (OAuth, JWT with expiry)

## Performance Tips

1. **Image Optimization**
   - Keep images under 500KB
   - Use JPG for photos (better compression)
   - Use PNG for graphics/icons with transparency
   - Use optimized SVG for logos

2. **Lazy Loading**
   - Images load only when visible
   - Reduces initial page load time
   - Saves bandwidth for users

3. **Caching**
   - Public menu cached for 5 minutes
   - Admin panel not cached
   - Clear cache manually if needed

4. **Database**
   - Use short item names
   - Keep descriptions concise
   - Limit to 100+ items (KV performance)

## Browser Support

✅ Supported:
- Chrome/Chromium 51+
- Firefox 54+
- Safari 10.1+
- Edge 15+
- iOS Safari 11+
- Chrome Mobile latest

## File Structure

```
menu.cucinetta.ir/
├── public/                    # Public website files
│   ├── index.html            # Public menu page
│   ├── admin/
│   │   └── index.html        # Admin panel
│   └── [other-pages].html    # Additional pages
│
├── functions/                 # Cloudflare Worker functions
│   └── api/
│       ├── items.js          # Menu items CRUD operations
│       └── auth.js           # Authentication handler
│
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Dependencies and scripts
├── README.md                 # Quick start guide
├── setup.sh                  # Setup script
└── docs/
    └── SETUP.md             # This detailed guide
```

## Next Steps

1. ✅ Complete setup (you are here)
2. Add your menu items via admin panel
3. Upload images to hosting service
4. Customize colors and branding
5. Deploy to Cloudflare Pages
6. Share your menu link!

## Support

Need help? 

- Check this guide's Troubleshooting section
- Review the [API Reference](#api-reference)
- Check GitHub Issues
- Contact maintainers

## License

MIT License - feel free to use and modify!

## Credits

Made with ❤️ for **CUCINETTA**

Built with:
- **Cloudflare Pages** - Free serverless hosting
- **Cloudflare KV** - Global key-value storage
- **Wrangler** - Cloudflare development CLI
- **HTML/CSS/JavaScript** - No frameworks needed!

---

Last updated: February 22, 2024
