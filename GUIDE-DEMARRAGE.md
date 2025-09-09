# 🚀 Guide de Démarrage Rapide - UBB Health Check

## ⚡ Démarrage Express

### Option 1 : Scripts Automatiques
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2 : Démarrage Manuel

1. **Terminal 1 - Backend** :
```bash
cd server
npm install
npm run dev
```

2. **Terminal 2 - Frontend** :
```bash
cd client
npm install
npm run dev
```

## 🌐 URLs d'Accès

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Health Check** : http://localhost:5000/api/health

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ubb-health-check
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ubb.com

CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Résolution de Problèmes

### Problème : Page d'évaluation reste en chargement

**Solutions** :

1. **Vérifier que le backend est démarré** :
   - Aller sur http://localhost:5000/api/health
   - Doit retourner `{"status":"OK"}`

2. **Mode développement** :
   - L'application utilise maintenant des questions statiques si l'API échoue
   - Un message "Mode développement" apparaîtra

3. **Redémarrer les serveurs** :
   ```bash
   # Arrêter tous les processus
   Ctrl+C
   
   # Redémarrer
   npm run dev
   ```

### Problème : Erreur de connexion à MongoDB

**Solutions** :

1. **Installer MongoDB** :
   - Télécharger depuis https://www.mongodb.com/try/download/community
   - Ou utiliser MongoDB Atlas (cloud)

2. **Démarrer MongoDB** :
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

3. **Utiliser MongoDB Atlas** (recommandé) :
   - Créer un compte gratuit sur https://cloud.mongodb.com
   - Récupérer l'URI de connexion
   - Mettre à jour `MONGODB_URI` dans `.env`

### Problème : Erreurs de dépendances

**Solutions** :

1. **Nettoyer et réinstaller** :
   ```bash
   # Backend
   cd server
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd ../client
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Vérifier les versions** :
   - Node.js : v16+ recommandé
   - npm : v8+ recommandé

## 📱 Test de l'Application

1. **Accéder à l'application** : http://localhost:5173
2. **Remplir le formulaire** avec des données de test
3. **Compléter le questionnaire** (4 questions en mode dev)
4. **Voir les résultats** avec le feedback visuel
5. **Tester la génération de rapport**

## 🎯 Fonctionnalités Disponibles

- ✅ **Interface multilingue** (12 langues)
- ✅ **Questionnaire interactif** avec feedback visuel
- ✅ **Système de scoring** automatique
- ✅ **Génération de rapports PDF**
- ✅ **Mode développement** (fonctionne sans backend)
- ✅ **Gestion d'erreurs** robuste

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs du serveur backend
3. Consultez ce guide de résolution de problèmes
4. Redémarrez les serveurs si nécessaire

---

**L'application est maintenant prête à être utilisée !** 🎉
