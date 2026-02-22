📦 UPLOADS & ASSETS GUIDE

This explains how to manage images and fonts in your project.

═══════════════════════════════════════════════════════════════

## 🖼️ IMAGES - How It Works

Current System: External URLs (Recommended)

HOW IT WORKS:
1. User uploads image to external service (ImgBB, Imgur, etc.)
2. Gets image URL
3. Pastes URL in admin panel
4. Image displays immediately

RECOMMENDED SERVICES:

### Option 1: ImgBB (EASIEST - FREE)
- Go to: https://imgbb.com
- Upload image
- Copy "Direct Image Link"
- Paste in admin panel
- Example: https://i.ibb.co/abc123/image.jpg

✅ Pros:
- No account needed
- Free
- Fast
- Reliable

### Option 2: Imgur (FREE)
- Go to: https://imgur.com
- Upload image
- Copy image address
- Paste in admin panel
- Example: https://i.imgur.com/xyz789.jpg

### Option 3: Cloudflare Images (PAID - Advanced)
- Use Cloudflare Images API
- More complex
- Costs money
- Better for high traffic

### Option 4: Your Own Server
- Host images on your server
- Full control
- Requires hosting plan

WHY NOT UPLOAD TO YOUR SITE?
- Cloudflare KV is for data, not large files
- Increases page size
- Slows down performance
- External URLs are better

═══════════════════════════════════════════════════════════════

## 🔤 FONTS - How It Works

Current System: Local Files

HOW IT WORKS:
1. Download font file (Morabba.ttf)
2. Upload to `/public/fonts/` folder
3. Font loads from your site
4. Browser caches it

FOLDER STRUCTURE:
```
public/
├── fonts/
│   ├── Morabba.ttf      ← Upload your font here
│   └── README.md        ← Instructions
├── index.html
└── admin/
    └── index.html
```

STEPS TO ADD YOUR FONT:

1. Get Font File
   - Download Morabba font (TTF format)
   - Sources:
     * Fontiran.com
     * IranYekan
     * Vazir Font
     * Google Fonts (Persian)

2. Upload Font
   - Rename file to: Morabba.ttf
   - Place in: /public/fonts/
   - Full path: /public/fonts/Morabba.ttf

3. Test
   - Refresh your site
   - Font should appear
   - Check F12 console if issues

SUPPORTED FORMATS:
- ✅ TTF (TrueType)
- ✅ OTF (OpenType)
- ✅ WOFF (Web Open)
- ✅ WOFF2 (Compressed)

FILE SIZE:
- Keep under 500KB
- TTF is usually 100-300KB
- Larger = slower loading

═══════════════════════════════════════════════════════════════

## 📁 COMPLETE FOLDER STRUCTURE

menu.cucinetta.ir/
│
├── public/                      ← Deployed to web
│   ├── fonts/
│   │   ├── Morabba.ttf         ← Upload your font here
│   │   ├── Vazir.ttf           ← Add more fonts as needed
│   │   └── README.md
│   │
│   ├── images/                 ← (Optional) Store local images
│   │   └── logo.png            ← Logo or icons
│   │
│   ├── index.html              ← Public menu page
│   └── admin/
│       └── index.html          ← Admin panel
│
├── functions/api/
│   ├── items.js
│   ├── auth.js
│   └── data-init.js
│
├── wrangler.toml
├── package.json
└── docs/

═══════════════════════════════════════════════════════════════

## 🎨 HOW TO CUSTOMIZE

### Add More Fonts

If you want more fonts (like "Vazir"):

1. Download font file: Vazir.ttf
2. Save to: /public/fonts/Vazir.ttf

3. Update CSS:
```css
@font-face {
  font-family: "Vazir";
  src: url("/fonts/Vazir.ttf") format("truetype");
}

body {
  font-family: "Vazir", fallback fonts...;
}
```

### Reference Local Images

If you add images to /public/images/:

```html
<img src="/images/logo.png" alt="Logo">
```

Or in CSS:
```css
background-image: url("/images/pattern.jpg");
```

═══════════════════════════════════════════════════════════════

## 📝 CURRENT FONT SETUP

Both `index.html` and `admin/index.html` now:

✅ Load Morabba from: /fonts/Morabba.ttf
✅ Use Morabba as primary font
✅ Fall back to system fonts if Morabba unavailable

Current CSS:
```css
@font-face {
  font-family: "Morabba";
  src: url("/fonts/Morabba.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Morabba", system-ui, Arial, sans-serif;
}
```

═══════════════════════════════════════════════════════════════

## ⚡ PERFORMANCE TIPS

Images:
- Use external URLs (faster CDN)
- Compress images before uploading
- Use JPG for photos, PNG for graphics
- Keep under 500KB per image

Fonts:
- Load from local /fonts/ folder
- Browser caches after first load
- Use font-weight variations
- Keep 2-3 fonts maximum

═══════════════════════════════════════════════════════════════

## ✅ QUICK CHECKLIST

- [ ] Download Morabba.ttf font
- [ ] Place in /public/fonts/Morabba.ttf
- [ ] Refresh website to test
- [ ] Font appears on menu and admin
- [ ] When uploading images, use ImgBB
- [ ] Paste image URLs in admin panel
- [ ] Add more fonts as needed
- [ ] Commit changes to GitHub

═══════════════════════════════════════════════════════════════

## 🆘 TROUBLESHOOTING

Font Not Loading?
- Check file path: /public/fonts/Morabba.ttf
- Check file name matches CSS
- Try F5 refresh (not Ctrl+F5)
- Check file size (under 5MB)
- Check file extension (.ttf)

Images Not Showing?
- Verify URL is correct
- Test URL in new browser tab
- Check CORS settings
- Try different image service
- Use placeholder: https://via.placeholder.com/520x300

═══════════════════════════════════════════════════════════════

Ready to upload your font? 👉 Place Morabba.ttf in /public/fonts/

Questions? Check /public/fonts/README.md for details!
