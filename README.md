# 🍝 CUCINETTA Menu Management System

A modern, serverless menu management system built for Cloudflare Pages with a beautiful admin panel for managing menu items, images, and prices.

## ✨ Features

- **Public Menu**: Beautiful, responsive design with RTL Persian support
- **Admin Panel**: Secure, password-protected interface to manage items
- **Lazy Loading**: Images load only when needed, saving bandwidth
- **Serverless**: Built on Cloudflare Pages - free and fast
- **Real-time**: Updates instantly across all pages
- **Mobile-friendly**: Works perfectly on all devices

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Cloudflare
```bash
npx wrangler login          # Login to Cloudflare
npm run kv:init             # Create KV namespace
# Update wrangler.toml with your credentials
```

### Run Locally
```bash
npm run dev
```

Then visit:
- Menu: `http://localhost:8787/`
- Admin: `http://localhost:8787/admin/`

### Deploy
```bash
git push origin main        # Push to GitHub
# Then connect repo to Cloudflare Pages
# Set publish directory: public
# Add ADMIN_PASSWORD environment variable
```

## 📂 Project Structure

```
├── public/                      # Website files
│   ├── index.html              # Public menu page
│   └── admin/
│       └── index.html          # Admin panel
├── functions/api/              # API endpoints
│   ├── items.js               # Menu CRUD operations
│   └── auth.js                # Authentication
├── wrangler.toml              # Cloudflare config
├── package.json               # Dependencies
└── docs/SETUP.md              # Full documentation
```

## 📖 Documentation

For detailed setup instructions, customization, and troubleshooting, see [docs/SETUP.md](./docs/SETUP.md)

## 🎯 Usage

### Public Menu
Visitors see your menu with lazy-loaded images. Perfect for mobile users!

### Admin Panel
1. Login with your password
2. Add/edit/delete menu items
3. Upload images (paste image URLs)
4. See changes instantly

## 🔒 Security

- ✅ Password-protected admin panel
- ✅ HTTPS everywhere (Cloudflare)
- ✅ No database passwords stored
- ✅ Simple, auditable code

## 🌎 Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set publish directory: `public`
4. Add `ADMIN_PASSWORD` environment variable
5. Deploy!

[Detailed deployment guide](./docs/SETUP.md#deployment)

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  
✅ RTL (Persian) support

## 🛠️ Tech Stack

- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare KV
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **No dependencies**: Zero external libraries needed!

## 📚 API Reference

- `GET /api/items` - Get all menu items
- `POST /api/items` - Add new item (auth required)
- `PUT /api/items` - Update item (auth required)
- `DELETE /api/items` - Delete item (auth required)
- `POST /api/auth` - Authenticate with password

[Full API documentation](./docs/SETUP.md#api-reference)

## 🎨 Customization

Edit CSS variables to change colors:
```css
:root {
  --bg: #ded7c5;        /* Background */
  --maroon: #5b2b2f;    /* Primary color */
  --accent: #d4a574;    /* Buttons */
}
```

[More customization options](./docs/SETUP.md#customization)

## ✅ Checklist

- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Login to Cloudflare: `npx wrangler login`
- [ ] Create KV namespace: `npm run kv:init`
- [ ] Update `wrangler.toml` with your credentials
- [ ] Set admin password in `wrangler.toml`
- [ ] Run locally: `npm run dev`
- [ ] Test at `http://localhost:8787/admin/`
- [ ] Push to GitHub
- [ ] Connect to Cloudflare Pages
- [ ] Set environment variables
- [ ] Deploy and enjoy! 🎉

## 🆘 Troubleshooting

**Admin panel blank?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check ADMIN_PASSWORD in wrangler.toml
- Open console (F12) to see errors

**Images not loading?**
- Verify image URLs are accessible
- Try test image: `https://via.placeholder.com/520x300`

**Changes not showing?**
- Menu cached for 5 minutes
- Hard refresh: Ctrl+Shift+R

[More troubleshooting](./docs/SETUP.md#troubleshooting)

## 📞 Support

Need help? Check:
- [Full documentation](./docs/SETUP.md)
- [API Reference](./docs/SETUP.md#api-reference)
- GitHub Issues

## 📄 License

MIT - Free to use and modify

## 💚 Credits

Made with ❤️ for **CUCINETTA**

Built with Cloudflare Pages, KV, and vanilla JavaScript.

---

**[👉 Start Setup](./docs/SETUP.md)** | **[📚 Full Docs](./docs/SETUP.md)** | **[🔧 Configuration](./docs/SETUP.md#configuration)**