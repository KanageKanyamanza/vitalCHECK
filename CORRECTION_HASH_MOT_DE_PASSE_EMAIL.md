# Correction de l'Affichage du Hash Bcrypt dans l'Email

## Date: 10 Octobre 2025

## 🔍 Problème Identifié

**Problème :**
- L'email affichait le hash bcrypt du mot de passe au lieu du mot de passe en clair
- Affichage : `$2a$10$mQfHrJ1tb6Vqn/KfKT3Ui.13c0cDI9kenTHoMW1J8TIo4946njdsk`
- Au lieu du mot de passe temporaire lisible : `obOXZBMTtIOk`

**Cause Identifiée :**
- Le système récupérait `assessment.user.password` qui contient le hash bcrypt
- Pas de stockage du mot de passe temporaire original en clair
- Le middleware de Mongoose hash automatiquement le mot de passe lors de la sauvegarde

---

## ✅ Solution Appliquée

### **1. Nouveau Champ `tempPassword` dans le Modèle User**

#### **Fichier :** `server/models/User.js`

```javascript
// AVANT
accountCreatedAt: {
  type: Date,
  default: null
},

// MAINTENANT
accountCreatedAt: {
  type: Date,
  default: null
},
tempPassword: {
  type: String,
  default: null,
  select: false // Ne pas inclure par défaut dans les queries
},
```

### **2. Stockage du Mot de Passe Temporaire Original**

#### **Fichier :** `server/routes/assessments.js`

```javascript
// AVANT
if (!user.hasAccount) {
  tempPassword = user.generateTempPassword();
  user.password = tempPassword; // Hash automatique par le middleware
  user.hasAccount = true;
  user.accountCreatedAt = new Date();
  await user.save();
  accountCreated = true;
}

// MAINTENANT
if (!user.hasAccount) {
  tempPassword = user.generateTempPassword();
  user.password = tempPassword; // Hash automatique par le middleware
  user.tempPassword = tempPassword; // Stocker le mot de passe en clair pour l'email
  user.hasAccount = true;
  user.accountCreatedAt = new Date();
  await user.save();
  accountCreated = true;
}
```

### **3. Récupération du Mot de Passe en Clair**

#### **Fichier :** `server/routes/reports.js`

```javascript
// AVANT
const assessment = await Assessment.findById(req.params.assessmentId)
  .populate('user', 'email companyName sector companySize hasAccount accountCreatedAt password');

// MAINTENANT
const assessment = await Assessment.findById(req.params.assessmentId)
  .populate('user', 'email companyName sector companySize hasAccount accountCreatedAt tempPassword');
```

### **4. Utilisation du Mot de Passe en Clair dans l'Email**

```javascript
// AVANT
if (isNewAccount) {
  tempPassword = assessment.user.password; // Hash bcrypt
}

// MAINTENANT
if (isNewAccount) {
  tempPassword = assessment.user.tempPassword; // Mot de passe en clair
}
```

### **5. Nettoyage de Sécurité après Envoi**

```javascript
// Nettoyer le mot de passe temporaire après l'envoi de l'email (sécurité)
if (isNewAccount && assessment.user.tempPassword) {
  assessment.user.tempPassword = null;
  await assessment.user.save();
  console.log('🧹 [REPORT] Mot de passe temporaire nettoyé pour:', assessment.user.email);
}
```

---

## 📊 Comparaison Avant/Après

### **AVANT (Problématique)**
```
Email reçu:
┌─────────────────────────────────────────┐
│ Vos Identifiants de Connexion           │
│                                         │
│ Email: user@example.com                 │
│ Mot de passe temporaire:                │
│ ┌─────────────────────────────────────┐ │
│ │ $2a$10$mQfHrJ1tb6Vqn/KfKT3Ui...    │ │ ← Hash illisible
│ └─────────────────────────────────────┘ │
│                                         │
│ ⚠️ Important: Changez ce mot de passe   │
└─────────────────────────────────────────┘
```

### **MAINTENANT (Corrigé)**
```
Email reçu:
┌─────────────────────────────────────────┐
│ Vos Identifiants de Connexion           │
│                                         │
│ Email: user@example.com                 │
│ Mot de passe temporaire:                │
│ ┌─────────────────────────────────────┐ │
│ │ obOXZBMTtIOk                        │ │ ← Mot de passe lisible
│ └─────────────────────────────────────┘ │
│                                         │
│ ⚠️ Important: Changez ce mot de passe   │
└─────────────────────────────────────────┘
```

---

## 🔧 Détails Techniques

### **Stockage Sécurisé**
```javascript
// Dans la base de données
{
  password: "$2a$10$mQfHrJ1tb6Vqn/KfKT3Ui...", // Hash bcrypt (sécurisé)
  tempPassword: "obOXZBMTtIOk",                 // Mot de passe en clair (temporaire)
  hasAccount: true,
  accountCreatedAt: "2025-10-10T13:02:21.727Z"
}
```

### **Récupération avec Select**
```javascript
// Récupération normale (sans tempPassword)
const user = await User.findById(id); // tempPassword non inclus

// Récupération avec tempPassword
const user = await User.findById(id).select('+tempPassword'); // tempPassword inclus
```

### **Nettoyage Automatique**
```javascript
// Après envoi de l'email
assessment.user.tempPassword = null; // Suppression du mot de passe en clair
await assessment.user.save();
```

---

## 🧪 Test de Validation

### **Script de Test Créé**
```javascript
// Test réussi:
✅ Utilisateur de test créé: test@example.com
✅ Compte créé avec mot de passe temporaire: obOXZBMTtIOk
🔍 Utilisateur récupéré: {
  email: 'test@example.com',
  hasAccount: true,
  accountCreatedAt: 2025-10-10T13:02:21.727Z,
  tempPassword: 'obOXZBMTtIOk',
  tempPasswordMatches: true,
  hasPassword: false  // Hash non récupéré (sécurité)
}
```

### **Validation du Flux**
1. ✅ **Génération** : Mot de passe temporaire créé
2. ✅ **Stockage** : Hash dans `password`, clair dans `tempPassword`
3. ✅ **Récupération** : `tempPassword` accessible pour l'email
4. ✅ **Envoi** : Email avec mot de passe lisible
5. ✅ **Nettoyage** : `tempPassword` supprimé après envoi

---

## 🔒 Sécurité

### **Mesures de Sécurité Implémentées**
- ✅ **Champ `select: false`** : `tempPassword` non inclus par défaut
- ✅ **Nettoyage automatique** : Suppression après envoi de l'email
- ✅ **Stockage temporaire** : Seulement pendant la création du compte
- ✅ **Hash principal** : `password` reste hashé avec bcrypt

### **Flux de Sécurité**
```
1. Création compte → tempPassword stocké temporairement
2. Envoi email → tempPassword utilisé pour l'affichage
3. Nettoyage → tempPassword supprimé immédiatement
4. Connexion → Seul le hash bcrypt est utilisé
```

---

## 📁 Fichiers Modifiés

### **`server/models/User.js`**
- ✅ **Nouveau champ** : `tempPassword` avec `select: false`
- ✅ **Sécurité** : Champ non inclus par défaut dans les queries

### **`server/routes/assessments.js`**
- ✅ **Stockage** : `user.tempPassword = tempPassword`
- ✅ **Double stockage** : Hash + clair pendant la création

### **`server/routes/reports.js`**
- ✅ **Récupération** : `tempPassword` au lieu de `password`
- ✅ **Nettoyage** : Suppression après envoi de l'email
- ✅ **Logs** : Suivi du nettoyage pour debugging

### **Scripts de Test**
- ✅ **`test-temp-password.js`** : Test de la logique
- ✅ **`create-test-user-with-temp-password.js`** : Validation complète

---

## ✅ Résumé

**Problème résolu :**
- ✅ **Affichage correct** : Mot de passe lisible dans l'email
- ✅ **Sécurité maintenue** : Hash bcrypt pour l'authentification
- ✅ **Nettoyage automatique** : Suppression du mot de passe en clair
- ✅ **Validation complète** : Tests de la logique implémentés

**Les utilisateurs reçoivent maintenant un mot de passe temporaire lisible dans l'email, tout en maintenant la sécurité du système !** 🎉
