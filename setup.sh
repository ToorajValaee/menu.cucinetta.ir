#!/bin/bash

echo "🍝 Initializing CUCINETTA Menu Management System"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Next steps:"
echo ""
echo "1. Update wrangler.toml with your account credentials:"
echo "   - Set your Cloudflare account_id"
echo "   - Create KV namespace: npm run kv:init"
echo "   - Set ADMIN_PASSWORD in the config"
echo ""
echo "2. Authenticate with Cloudflare:"
echo "   npx wrangler login"
echo ""
echo "3. Create KV namespace:"
echo "   npm run kv:init"
echo "   (Copy the namespace ID and preview_id to wrangler.toml)"
echo ""
echo "4. Run locally:"
echo "   npm run dev"
echo ""
echo "5. Deploy to Cloudflare Pages:"
echo "   npm run deploy"
echo ""
echo "📚 Documentation: Check README.md for detailed setup instructions"
