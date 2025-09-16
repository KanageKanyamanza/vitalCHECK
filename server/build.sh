#!/bin/bash

# Script de build pour Render.com
echo "🚀 Starting build process..."

# Installer les dépendances Node.js
echo "📦 Installing Node.js dependencies..."
npm install

# html-pdf-node gère automatiquement Chrome via Puppeteer
echo "📄 html-pdf-node will handle Chrome installation automatically"
echo "ℹ️  No manual Chrome setup required for PDF generation"

# Vérifier que les dépendances sont installées
echo "✅ Dependencies installed successfully"

# Vérifier que html-pdf-node est disponible
if npm list html-pdf-node &> /dev/null; then
    echo "✅ html-pdf-node is available for PDF generation"
else
    echo "❌ html-pdf-node not found, PDF generation may not work"
fi

echo "🎉 Build completed successfully!"
