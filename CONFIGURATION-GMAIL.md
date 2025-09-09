# 📧 Configuration Gmail avec Nodemailer

## 🔧 **Configuration Gmail**

### **Étape 1 : Activer l'authentification à 2 facteurs**

1. **Aller sur votre compte Google** : https://myaccount.google.com/
2. **Sécurité** → **Authentification à 2 facteurs**
3. **Activer** l'authentification à 2 facteurs si ce n'est pas déjà fait

### **Étape 2 : Générer un mot de passe d'application**

1. **Aller sur** : https://myaccount.google.com/apppasswords
2. **Sélectionner l'application** : "Autre (nom personnalisé)"
3. **Nom** : "UBB Health Check"
4. **Cliquer sur "Générer"**
5. **Copier le mot de passe** généré (16 caractères)

### **Étape 3 : Configuration du fichier .env**

Créer un fichier `.env` dans le dossier `server/` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ubb-health-check
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application-16-caracteres
EMAIL_FROM=votre-email@gmail.com

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### **Étape 4 : Test de la configuration**

Créer un script de test pour vérifier la configuration :

```bash
# Dans le dossier server/
node -e "
const { testEmailConfig } = require('./utils/emailService');
testEmailConfig().then(result => {
  console.log('Configuration email:', result ? '✅ OK' : '❌ Erreur');
  process.exit(result ? 0 : 1);
});
"
```

## 🚀 **Utilisation dans l'Application**

### **Envoi d'email automatique**

L'application envoie automatiquement des emails pour :
- ✅ **Rapports d'évaluation** (PDF en pièce jointe)
- ✅ **Confirmations** d'inscription
- ✅ **Notifications** de résultats

### **Fonctionnalités Email**

1. **Génération de PDF** avec Puppeteer
2. **Envoi automatique** après évaluation
3. **Pièces jointes** (rapport PDF)
4. **Templates HTML** personnalisés
5. **Gestion d'erreurs** robuste

## 🔒 **Sécurité**

### **Bonnes Pratiques**

- ✅ **Mot de passe d'application** (pas le mot de passe principal)
- ✅ **Authentification à 2 facteurs** obligatoire
- ✅ **Variables d'environnement** pour les credentials
- ✅ **Fichier .env** dans .gitignore

### **Limites Gmail**

- **Quota quotidien** : 500 emails/jour (compte gratuit)
- **Taille des pièces jointes** : 25MB max
- **Rate limiting** : 100 emails/heure

## 🐛 **Résolution de Problèmes**

### **Erreur : "Invalid login"**

**Solutions** :
1. Vérifier que l'authentification à 2 facteurs est activée
2. Utiliser un mot de passe d'application (pas le mot de passe principal)
3. Vérifier les credentials dans le fichier .env

### **Erreur : "Less secure app access"**

**Solutions** :
1. Gmail a supprimé cette option
2. Utiliser uniquement les mots de passe d'application
3. Activer l'authentification à 2 facteurs

### **Erreur : "Connection timeout"**

**Solutions** :
1. Vérifier la connexion internet
2. Vérifier les paramètres de pare-feu
3. Essayer avec un autre réseau

### **Erreur : "Rate limit exceeded"**

**Solutions** :
1. Attendre avant d'envoyer d'autres emails
2. Implémenter un système de queue
3. Utiliser un service email professionnel

## 📊 **Monitoring**

### **Logs Email**

L'application log automatiquement :
- ✅ **Emails envoyés** avec succès
- ❌ **Erreurs d'envoi**
- 📊 **Statistiques** d'utilisation

### **Test en Développement**

```bash
# Tester l'envoi d'email
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com"}'
```

## 🎯 **Configuration Recommandée**

### **Production**

Pour la production, considérer :
- **Service email professionnel** (SendGrid, Mailgun, etc.)
- **SMTP dédié** avec authentification
- **Monitoring** et alertes
- **Backup** en cas d'échec

### **Développement**

Pour le développement :
- **Gmail** avec mot de passe d'application
- **Logs détaillés** pour le debugging
- **Tests automatiques** de la configuration

---

**Configuration Gmail terminée !** 📧

Votre application peut maintenant envoyer des emails via Gmail avec Nodemailer.
