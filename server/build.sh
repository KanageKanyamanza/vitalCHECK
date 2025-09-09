#!/bin/bash

# Script de build pour Render.com
echo "🚀 Starting build process..."

# Installer les dépendances Node.js
echo "📦 Installing Node.js dependencies..."
npm install

# Installer Chrome pour Puppeteer (via Puppeteer lui-même)
echo "🌐 Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

# Vérifier l'installation
echo "✅ Chrome installation completed"
echo "Chrome cache location: /opt/render/.cache/puppeteer"

# Vérifier que Chrome est accessible
if command -v google-chrome-stable &> /dev/null; then
    echo "✅ System Chrome found: $(google-chrome-stable --version)"
else
    echo "ℹ️  System Chrome not found, will use Puppeteer Chrome"
fi

echo "🎉 Build completed successfully!"
