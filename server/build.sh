#!/bin/bash

# Script de build pour Render.com
echo "🚀 Starting build process..."

# Installer les dépendances Node.js
echo "📦 Installing Node.js dependencies..."
npm install

# Installer Chrome pour Puppeteer
echo "🌐 Installing Google Chrome..."
apt-get update
apt-get install -y wget gnupg

# Ajouter la clé GPG de Google
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Ajouter le repository Chrome
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

# Mettre à jour et installer Chrome
apt-get update
apt-get install -y google-chrome-stable

# Vérifier l'installation
echo "✅ Chrome version:"
google-chrome-stable --version

echo "🎉 Build completed successfully!"
