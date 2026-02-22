📝 FONTS FOLDER

This folder contains custom fonts for your website.

🔤 Currently Using:
- Morabba.ttf (Persian/Farsi font)

📥 How to Add Your Font

1. **Download/Get Font File**
   - Download "Morabba" font (TTF or OTF format)
   - Popular sources:
     * Fontiran.com (Persian fonts)
     * IranYekan
     * Vazir Font
     * Other TTF files

2. **Upload Font File**
   - Rename your font file to: `Morabba.ttf`
   - Place it in this folder: `/public/fonts/`
   - Path should be: `/public/fonts/Morabba.ttf`

3. **Test**
   - Refresh your website
   - Font should load automatically
   - Check console (F12) if font doesn't load

📂 Folder Structure
```
public/
├── fonts/
│   └── Morabba.ttf      ← Your font file goes here
├── index.html           ← Public menu page
├── admin/
│   └── index.html       ← Admin panel
```

🔧 Configuration

The font is referenced in HTML files:
```css
@font-face {
  font-family: "Morabba";
  src: url("/fonts/Morabba.ttf") format("truetype");
}
```

✅ Font Formats Supported
- TTF (TrueType Font)
- OTF (OpenType Font)
- WOFF (Web Open Font Format)
- WOFF2 (Compressed WOFF)

💡 Tips
- Use TTF for best compatibility
- Keep file size under 500KB
- Test after uploading
- Font will be cached by browsers

🌐 Browser Support
- All modern browsers support TTF
- Works on mobile and desktop
- Automatic fallback to system fonts if TTF fails

Questions?
- See docs/SETUP.md for more info
- Check browser console (F12) for errors
