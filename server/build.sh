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

# Créer un lien symbolique pour faciliter l'accès
if [ -d "/opt/render/.cache/puppeteer" ]; then
    echo "🔗 Setting up Chrome access..."
    # Trouver le chemin exact de Chrome
    CHROME_PATH=$(find /opt/render/.cache/puppeteer -name "chrome" -type f 2>/dev/null | head -1)
    if [ -n "$CHROME_PATH" ]; then
        echo "Found Chrome at: $CHROME_PATH"
        # Créer un répertoire accessible
        mkdir -p /tmp/chrome
        ln -sf "$CHROME_PATH" /tmp/chrome/chrome 2>/dev/null || true
        echo "Chrome accessible at: /tmp/chrome/chrome"
    fi
fi

echo "🎉 Build completed successfully!"
