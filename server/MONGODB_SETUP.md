# Guide de Configuration MongoDB

## Problèmes corrigés ✅

1. ✅ **Duplicate index warnings** - Supprimés des définitions `index: true` en double
2. ✅ **Connexion MongoDB améliorée** - Gestion d'erreurs et timeout configurés
3. ✅ **Mode développement** - Le serveur démarre même sans MongoDB (avec avertissements)

## Solutions disponibles

### Option 1 : MongoDB Atlas (Recommandé) ☁️

**Avantages :**
- Pas besoin d'installer MongoDB localement
- Gratuit jusqu'à 512MB
- Accessible depuis n'importe où
- Géré automatiquement

**Configuration :**

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Créez un cluster gratuit (M0)

3. Créez un utilisateur de base de données :
   - Database Access → Add New Database User
   - Choisissez un username et password

4. Configurez Network Access :
   - Network Access → Add IP Address
   - Pour développement : `0.0.0.0/0` (toutes les IP)
   - Pour production : votre IP spécifique

5. Obtenez votre URI de connexion :
   - Cliquez sur "Connect" sur votre cluster
   - Choisissez "Connect your application"
   - Copiez l'URI (format: `mongodb+srv://username:password@cluster.mongodb.net/`)

6. Créez/modifiez `server/.env` :
   ```env
   MONGODB_URI=mongodb+srv://votre-username:votre-password@cluster0.xxxxx.mongodb.net/vitalCHECK-health-check?retryWrites=true&w=majority
   ```

7. Remplacez dans l'URI :
   - `votre-username` : votre nom d'utilisateur MongoDB
   - `votre-password` : votre mot de passe MongoDB
   - `cluster0.xxxxx` : le nom de votre cluster
   - `vitalCHECK-health-check` : nom de votre base de données

### Option 2 : MongoDB Local 💻

**Pour Windows :**

1. **Installer MongoDB** (si pas déjà fait) :
   - Téléchargez depuis [mongodb.com](https://www.mongodb.com/try/download/community)
   - Installez avec les options par défaut

2. **Démarrer MongoDB comme service** :
   ```powershell
   net start MongoDB
   ```

3. **Ou démarrer manuellement** :
   ```powershell
   mongod --dbpath "C:\data\db"
   ```

4. **Vérifier la connexion** :
   - Ouvrez MongoDB Compass
   - Connectez-vous à `mongodb://localhost:27017`

5. **Configuration `.env`** :
   ```env
   MONGODB_URI=mongodb://localhost:27017/vitalCHECK-health-check
   ```

### Option 3 : Continuer sans MongoDB (Développement uniquement) ⚠️

Le serveur démarre maintenant même sans MongoDB, mais :
- ❌ Les routes admin ne fonctionneront pas
- ❌ L'enregistrement des données ne fonctionnera pas
- ✅ Le chatbot fonctionnera (sans enregistrement)
- ✅ Les routes publiques basiques fonctionneront

## Commandes utiles

```bash
# Démarrer le serveur
cd server
npm run dev

# Vérifier si MongoDB est en cours d'exécution (Windows)
net start MongoDB

# Arrêter MongoDB (Windows)
net stop MongoDB

# Vérifier la connexion MongoDB
mongosh mongodb://localhost:27017
```

## Vérification

Après configuration, redémarrez le serveur. Vous devriez voir :
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

Si vous voyez des avertissements, MongoDB n'est pas connecté mais le serveur fonctionne quand même en mode développement.


