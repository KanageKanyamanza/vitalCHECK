# 🔒 Analyse de Sécurité - vitalCHECK Enterprise Health Check

## 📋 Vue d'ensemble

Ce document présente une analyse complète de la sécurité de l'application vitalCHECK, identifiant les points forts et les vulnérabilités potentielles.

---

## ✅ Points Forts de Sécurité

### 1. **Authentification et Autorisation**

#### ✅ Points Positifs
- **Hashage des mots de passe** : Utilisation de `bcryptjs` avec salt rounds (10)
  - Implémenté dans `User.js` et `Admin.js` via middleware `pre('save')`
  - Mots de passe jamais exposés dans les réponses (`.select(false)`)
  
- **JWT Tokens** : Authentification par tokens avec expiration (7 jours)
  - Tokens signés avec `JWT_SECRET`
  - Vérification des tokens dans les middlewares d'authentification
  
- **Séparation des rôles** : Système admin/client distinct
  - Middleware `authenticateAdmin` pour les routes admin
  - Middleware `authenticateClient` pour les routes client
  - Système de permissions granulaire pour les admins

#### ⚠️ Points d'Attention
- **JWT_SECRET par défaut** : Fallback vers `'your-secret-key'` si non défini
  ```javascript
  // server/utils/auth.js:16
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  ```
  **Risque** : Si `JWT_SECRET` n'est pas défini, tokens signés avec clé faible
  
- **Pas de refresh tokens** : Tokens valides 7 jours sans mécanisme de renouvellement
  **Risque** : Tokens volés restent valides longtemps

### 2. **Protection des Headers HTTP**

#### ✅ Helmet.js Configuré
```javascript
app.use(helmet({
  frameguard: { action: 'deny' },
  contentSecurityPolicy: { ... }
}));
```

- **X-Frame-Options: DENY** : Protection contre clickjacking
- **Content Security Policy** : Restriction des sources de contenu
- **Headers de sécurité** : Helmet ajoute automatiquement plusieurs headers

#### ⚠️ CSP Permissif
- `styleSrc` inclut `'unsafe-inline'` (nécessaire pour Tailwind)
- `imgSrc` autorise `data:` et `https:` (large)
- `scriptSrc` limité à `'self'` ✅

### 3. **CORS Configuration**

#### ✅ Configuration Présente
- Liste d'origines autorisées définie
- Support des credentials (`credentials: true`)
- Headers autorisés limités

#### ⚠️ CORS Trop Permissif en Production
```javascript
// En production, être plus permissif pour éviter les problèmes CORS
if (process.env.NODE_ENV === 'production') {
  if (normalizedOrigin.includes('checkmyenterprise.com')) {
    return callback(null, true); // ⚠️ Autorise TOUS les sous-domaines
  }
}
```
**Risque** : Attaque par sous-domaine malveillant (ex: `evil.checkmyenterprise.com`)

#### ⚠️ Requêtes Sans Origine Autorisées
```javascript
if (!origin) return callback(null, true); // ⚠️ Autorise les requêtes sans origine
```
**Risque** : Applications mobiles/Postman peuvent bypasser CORS

### 4. **Validation des Données**

#### ✅ Express-Validator Utilisé
- Validation sur les routes critiques :
  - `/api/auth/register` : Email, companyName, sector, companySize
  - `/api/assessments/submit` : userId, answers, language
  - `/api/admin/*` : Validations sur les routes admin
  
- **Sanitization** :
  - `.normalizeEmail()` pour les emails
  - `.trim()` pour les chaînes
  - `.isMongoId()` pour les IDs MongoDB

#### ⚠️ Validation Incomplète
- **Route `/api/payments/record`** : Pas de validation des données de paiement
  ```javascript
  // server/routes/payments.js:10
  router.post('/record', async (req, res) => {
    // ⚠️ Aucune validation des champs
    const { orderId, planId, amount, customerEmail, ... } = req.body;
  ```
  **Risque** : Injection de données malveillantes, manipulation de montants

- **Route `/api/contact`** : Validation basique (regex email seulement)
  ```javascript
  // Pas de validation de longueur pour message, subject
  // Pas de sanitization HTML
  ```

### 5. **Protection contre les Injections**

#### ✅ MongoDB (NoSQL Injection)
- Utilisation de Mongoose avec schémas typés
- Requêtes paramétrées (pas de concaténation de strings)
- Validation des ObjectIds avec `.isMongoId()`

#### ⚠️ Pas de Protection XSS
- **Pas de sanitization HTML** dans les champs utilisateur
  - `Blog` content : HTML brut stocké
  - `Contact` message : Pas d'échappement
  - **Risque** : XSS si contenu affiché sans échappement côté client

#### ⚠️ Pas de Protection CSRF
- **Aucun token CSRF** implémenté
- **Risque** : Attaques CSRF sur les actions authentifiées

### 6. **Gestion des Fichiers (Upload)**

#### ✅ Points Positifs
- Upload via Cloudinary (pas de stockage local)
- Authentification admin requise pour upload
- Validation des types de fichiers (via Multer)

#### ⚠️ Validation Limite
- Pas de vérification explicite des types MIME
- Pas de limite de taille par fichier (seulement globale `10mb`)
- Pas de scan antivirus

### 7. **Rate Limiting**

#### ❌ **CRITIQUE : Rate Limiting Désactivé**
```javascript
// Rate limiting désactivé pour permettre un trafic illimité en production
// Les limitations ont été retirées pour éviter de bloquer les clients
```
**Risques Majeurs** :
- **Brute Force** : Tentatives illimitées de connexion
- **DDoS** : Pas de protection contre les attaques par déni de service
- **Abus d'API** : Requêtes massives possibles
- **Spam** : Envoi illimité de formulaires de contact

### 8. **Gestion des Erreurs**

#### ✅ Gestion Présente
- Middleware d'erreur global
- Messages d'erreur génériques en production
- Logs d'erreurs côté serveur

#### ⚠️ Exposition d'Informations
```javascript
error: process.env.NODE_ENV === "development" ? err.message : {}
```
✅ Bon : Masque les détails en production
⚠️ Mais : Stack traces dans les logs peuvent exposer des infos sensibles

### 9. **Sécurité des Mots de Passe Temporaires**

#### ⚠️ Stockage en Clair
```javascript
// server/models/User.js
tempPassword: {
  type: String,
  default: null,
  select: false
}
```
**Risque** : Mots de passe temporaires stockés en clair dans la base de données
- Si la DB est compromise, mots de passe temporaires exposés
- **Recommandation** : Ne pas stocker, générer à la volée ou hasher

### 10. **Endpoints de Test Exposés**

#### ⚠️ Endpoints de Debug en Production
```javascript
// server/index.js:106
app.get("/api/test", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Test endpoint accessible",
    routes: { ... } // ⚠️ Expose la structure des routes
  });
});
```
**Risque** : Fuite d'informations sur l'architecture

---

## 🚨 Vulnérabilités Critiques

### 1. **Rate Limiting Absent** 🔴 CRITIQUE
**Impact** : Élevé
**Probabilité** : Élevée
**Solution** : Réactiver `express-rate-limit` avec limites adaptées

### 2. **JWT_SECRET Fallback Faible** 🔴 CRITIQUE
**Impact** : Élevé
**Probabilité** : Faible (si .env configuré)
**Solution** : Forcer l'arrêt si `JWT_SECRET` non défini

### 3. **CORS Trop Permissif** 🟡 MOYEN
**Impact** : Moyen
**Probabilité** : Faible
**Solution** : Liste stricte des sous-domaines autorisés

### 4. **Pas de Protection CSRF** 🟡 MOYEN
**Impact** : Moyen
**Probabilité** : Moyenne
**Solution** : Implémenter `csurf` ou tokens CSRF

### 5. **Validation Incomplète des Paiements** 🟡 MOYEN
**Impact** : Élevé (financier)
**Probabilité** : Faible
**Solution** : Validation stricte + vérification PayPal

### 6. **Mots de Passe Temporaires en Clair** 🟡 MOYEN
**Impact** : Moyen
**Probabilité** : Faible
**Solution** : Ne pas stocker ou hasher

---

## 📝 Recommandations Prioritaires

### 🔴 Priorité 1 (Critique - À faire immédiatement)

1. **Réactiver le Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // 100 requêtes par IP
   });
   
   const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5 // 5 tentatives de connexion
   });
   
   app.use('/api/', limiter);
   app.use('/api/auth/login', authLimiter);
   app.use('/api/client-auth/login', authLimiter);
   ```

2. **Forcer JWT_SECRET**
   ```javascript
   if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
     console.error('❌ JWT_SECRET must be set in production!');
     process.exit(1);
   }
   ```

3. **Valider les Paiements**
   ```javascript
   router.post('/record', [
     body('orderId').isString().notEmpty(),
     body('amount').isFloat({ min: 0 }),
     body('customerEmail').isEmail(),
     body('paypalOrderId').isString().notEmpty()
   ], async (req, res) => {
     // Vérifier avec PayPal API que le paiement est valide
   });
   ```

### 🟡 Priorité 2 (Important - À faire rapidement)

4. **Restreindre CORS**
   ```javascript
   const allowedOrigins = [
     "https://www.checkmyenterprise.com",
     "https://checkmyenterprise.com"
     // Ne pas autoriser tous les sous-domaines
   ];
   ```

5. **Sanitization HTML**
   ```javascript
   const DOMPurify = require('isomorphic-dompurify');
   
   // Avant de sauvegarder le contenu du blog
   blog.content.fr = DOMPurify.sanitize(blog.content.fr);
   ```

6. **Protection CSRF**
   ```javascript
   const csrf = require('csurf');
   const csrfProtection = csrf({ cookie: true });
   
   app.use(csrfProtection);
   ```

7. **Ne Pas Stocker les Mots de Passe Temporaires**
   ```javascript
   // Générer et envoyer par email, ne pas stocker
   const tempPassword = generateTempPassword();
   await sendWelcomeEmail(user.email, name, tempPassword);
   // Ne pas sauvegarder tempPassword dans la DB
   ```

### 🟢 Priorité 3 (Amélioration - À planifier)

8. **Refresh Tokens** : Implémenter un système de refresh tokens
9. **2FA** : Authentification à deux facteurs pour les admins
10. **Logging de Sécurité** : Logger les tentatives d'accès suspectes
11. **Scan de Fichiers** : Vérification antivirus des uploads
12. **HSTS** : Headers Strict-Transport-Security
13. **Audit Logs** : Traçabilité des actions admin

---

## 🔍 Checklist de Sécurité

### Configuration
- [ ] `JWT_SECRET` défini et fort (min 32 caractères aléatoires)
- [ ] Variables d'environnement sécurisées (pas dans le code)
- [ ] MongoDB avec authentification activée
- [ ] HTTPS forcé en production
- [ ] Headers de sécurité configurés (Helmet)

### Authentification
- [ ] Mots de passe hashés (bcrypt, salt rounds ≥ 10)
- [ ] Tokens JWT avec expiration
- [ ] Rate limiting sur les routes d'authentification
- [ ] Protection contre brute force
- [ ] Logout avec invalidation de token

### Autorisation
- [ ] Vérification des permissions sur toutes les routes sensibles
- [ ] Principe du moindre privilège
- [ ] Séparation admin/client

### Validation
- [ ] Validation de tous les inputs utilisateur
- [ ] Sanitization des données
- [ ] Validation des types et formats
- [ ] Limites de longueur

### Protection des Données
- [ ] Données sensibles jamais dans les logs
- [ ] Mots de passe jamais dans les réponses
- [ ] Chiffrement des données sensibles si nécessaire
- [ ] Backups sécurisés

### API
- [ ] Rate limiting global
- [ ] CORS configuré strictement
- [ ] Protection CSRF
- [ ] Validation des paiements externes

### Monitoring
- [ ] Logs d'erreurs
- [ ] Alertes sur tentatives suspectes
- [ ] Monitoring des performances
- [ ] Audit des actions admin

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

---

**Date de l'analyse** : 2024
**Version analysée** : 1.0.0
**Prochaine révision recommandée** : Après implémentation des corrections critiques

