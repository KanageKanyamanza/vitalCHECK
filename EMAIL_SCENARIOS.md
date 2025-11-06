# 📧 Scénarios d'Emails Contextuels - vitalCHECK

## 🎯 Vue d'Ensemble

Le système vitalCHECK envoie automatiquement des emails **différents selon le contexte** de l'utilisateur.

## 📋 Matrice des Scénarios

| Événement | Client Nouveau | Client avec Évaluation | Client avec Compte | Email Envoyé |
|-----------|---------------|----------------------|-------------------|--------------|
| **Évaluation Gratuite** | ✅ Nouveau | - | - | **Compte Créé + Score** 🆕 |
| **Évaluation Gratuite** | - | - | ✅ Existe | **Nouvelle Évaluation** 📊 |
| **Paiement** | ✅ Nouveau | - | - | **Compte + Abonnement** 💳 |
| **Paiement** | - | ✅ Sans compte | - | **Compte + Abonnement** 💳 |
| **Paiement** | - | - | ✅ Avec compte | **Abonnement Mis à Jour** 🔄 |

---

## 📨 1. Après Évaluation Gratuite

### Scénario A : **Premier Contact (Nouveau Client)**

**Condition** : `user.hasAccount === false`

**Email** : `sendAccountCreatedAfterAssessment()`

**Sujet** : 
```
Votre rapport vitalCHECK est prêt - Accédez à votre compte !
```

**Contenu** :
```
🎉 Évaluation Complétée !
Votre compte vitalCHECK est créé

- Score global : [XX]/100 (encadré vert)
- Compte GRATUIT créé automatiquement
- Identifiants de connexion (email + password temporaire)
- Avantages du compte gratuit
- Bouton "Accéder à Mon Dashboard"
- Encart promotionnel : Plans Standard/Premium
```

**Actions Backend** :
```javascript
user.password = tempPassword (généré)
user.hasAccount = true
user.save()
→ Email envoyé avec credentials
```

---

### Scénario B : **Client Existant (A Déjà un Compte)**

**Condition** : `user.hasAccount === true`

**Email** : `sendAssessmentCompletedExistingUser()`

**Sujet** :
```
Nouvelle évaluation complétée - vitalCHECK
```

**Contenu** :
```
✅ Nouvelle Évaluation !
Consultez vos résultats

- Nouveau score : [XX]/100
- "Connectez-vous à votre dashboard pour :"
  - Consulter le rapport détaillé
  - Comparer avec évaluations précédentes
  - Suivre la progression
  - Télécharger le PDF
- Bouton "Voir Mon Dashboard"
- PAS d'identifiants (client déjà inscrit)
```

**Actions Backend** :
```javascript
// Pas de modification du compte
→ Email envoyé (notification simple)
```

---

## 💳 2. Après Paiement

### Scénario C : **Premier Paiement (Nouveau Client)**

**Condition** : `user n'existe pas` OU `user.hasAccount === false`

**Email** : `sendAccountCreatedEmail()`

**Sujet** :
```
Votre compte vitalCHECK [STANDARD/PREMIUM/DIAGNOSTIC] est prêt !
```

**Contenu** :
```
Paiement Confirmé ✓
Votre compte est prêt !

- Badge du plan acheté (coloré)
- "Merci pour votre abonnement au plan [BADGE]"
- Compte créé avec identifiants
- Mot de passe temporaire (code formaté)
- Avertissement changement password
- Liste des fonctionnalités du plan
- Bouton "Se connecter maintenant"
- Note : Équipe contacte sous 24h
```

**Actions Backend** :
```javascript
// Créer le compte
user = new User({
  email: customerEmail,
  password: tempPassword,
  subscription: {
    plan: planId,
    status: 'active',
    startDate: now,
    endDate: +1 an
  },
  hasAccount: true
})
→ Email avec credentials
```

---

### Scénario D : **Client avec Compte Existant**

**Condition** : `user.hasAccount === true`

**Email** : `sendSubscriptionUpgradeEmail()`

**Sujet** :
```
Votre abonnement [STANDARD/PREMIUM/DIAGNOSTIC] est activé ! 🎉
```

**Contenu** :
```
✅ Paiement Confirmé !
Votre abonnement a été mis à jour

- "Excellent choix ! Votre paiement a été confirmé"
- Badge du nouveau plan (grand, centré)
- "Actif maintenant !"
- Liste des nouveaux avantages (selon le plan)
- Bouton "Accéder à Mon Dashboard"
- PAS d'identifiants (client déjà inscrit)
- Note : Équipe contacte sous 24h
```

**Actions Backend** :
```javascript
// Mettre à jour l'abonnement
user.subscription = {
  plan: planId,
  status: 'active',
  startDate: now,
  endDate: +1 an
}
user.isPremium = true (si premium/diagnostic)
→ Email de mise à jour (PAS de credentials)
```

---

## 📊 Tableau Récapitulatif des Fonctions Email

| Fonction | Quand ? | Credentials ? | Contenu Principal |
|----------|---------|--------------|-------------------|
| `sendAccountCreatedAfterAssessment()` | Évaluation + Nouveau | ✅ Oui | Score + Compte Gratuit + Login |
| `sendAssessmentCompletedExistingUser()` | Évaluation + Existant | ❌ Non | Nouveau Score + Dashboard |
| `sendAccountCreatedEmail()` | Paiement + Nouveau | ✅ Oui | Plan Payant + Compte + Login |
| `sendSubscriptionUpgradeEmail()` | Paiement + Existant | ❌ Non | Abonnement Activé + Dashboard |

---

## 🔄 Flux Utilisateur Complets

### Flux 1 : Client Gratuit → Évaluation

```
1. Client fait évaluation gratuite (première fois)
   ↓
2. Soumission de l'évaluation
   ↓
3. Backend :
   - Calcule les scores
   - user.hasAccount = false détecté
   - Génère mot de passe temporaire
   - user.hasAccount = true
   - user.password = tempPassword
   ↓
4. Email "Votre rapport est prêt - Accédez à votre compte !"
   - Score affiché
   - Credentials fournis
   - Lien dashboard
   - Promo plans payants
   ↓
5. Client se connecte avec credentials
   ↓
6. Dashboard avec son évaluation
```

### Flux 2 : Client avec Compte → Nouvelle Évaluation

```
1. Client connecté fait nouvelle évaluation
   ↓
2. Soumission de l'évaluation
   ↓
3. Backend :
   - user.hasAccount = true détecté
   - Pas de création de credentials
   ↓
4. Email "Nouvelle évaluation complétée"
   - Nouveau score affiché
   - Lien vers dashboard
   - PAS de credentials
   ↓
5. Client se connecte (mot de passe existant)
   ↓
6. Dashboard avec TOUTES ses évaluations
```

### Flux 3 : Nouveau Client → Paiement Direct

```
1. Client paie (jamais fait d'évaluation)
   ↓
2. Paiement PayPal validé
   ↓
3. Backend :
   - user n'existe pas
   - Crée User complet
   - Génère mot de passe temporaire
   - subscription.plan = standard/premium/diagnostic
   - subscription.status = 'active'
   - hasAccount = true
   ↓
4. Email "Votre compte vitalCHECK [PLAN] est prêt !"
   - Badge du plan
   - Credentials fournis
   - Fonctionnalités du plan
   - Lien login
   ↓
5. Client se connecte
   ↓
6. Dashboard avec abonnement actif
```

### Flux 4 : Client Gratuit → Paie pour Upgrade

```
1. Client avec évaluations gratuites paie
   ↓
2. Paiement PayPal validé
   ↓
3. Backend :
   - user.hasAccount = false détecté
   - Ajoute mot de passe temporaire
   - Active abonnement
   - hasAccount = true
   ↓
4. Email "Votre compte vitalCHECK [PLAN] est prêt !"
   - Badge du plan
   - Credentials fournis
   ↓
5. Client se connecte
   ↓
6. Dashboard avec :
   - Ses anciennes évaluations gratuites
   - Son nouvel abonnement actif
```

### Flux 5 : Client avec Compte → Upgrade

```
1. Client déjà inscrit paie pour upgrade
   ↓
2. Paiement PayPal validé
   ↓
3. Backend :
   - user.hasAccount = true détecté
   - Met à jour subscription seulement
   - PAS de nouveau mot de passe
   ↓
4. Email "Votre abonnement [PLAN] est activé ! 🎉"
   - Badge du plan
   - Nouveaux avantages
   - Lien dashboard
   - PAS de credentials
   ↓
5. Client se connecte (password existant)
   ↓
6. Dashboard avec abonnement mis à jour
```

---

## 🎯 Détection du Contexte

### Backend Logic

```javascript
// APRÈS ÉVALUATION
if (!user.hasAccount) {
  // → Scénario A : Premier contact
  generateTempPassword()
  createAccount()
  sendAccountCreatedAfterAssessment(email, name, password, score)
} else {
  // → Scénario B : Client existant
  sendAssessmentCompletedExistingUser(email, name, score)
}

// APRÈS PAIEMENT
if (!user) {
  // → Scénario C : Nouveau client complet
  createUser()
  generateTempPassword()
  sendAccountCreatedEmail(email, name, password, plan)
} else if (!user.hasAccount) {
  // → Scénario D : Client gratuit qui upgrade
  addPasswordToUser()
  activateSubscription()
  sendAccountCreatedEmail(email, name, password, plan)
} else {
  // → Scénario E : Client avec compte qui upgrade
  updateSubscription()
  sendSubscriptionUpgradeEmail(email, name, plan, planId)
}
```

---

## ✅ Avantages du Système

### Pour le Client
- ✅ **Contexte approprié** : Reçoit les bonnes infos au bon moment
- ✅ **Pas de confusion** : Identifiants seulement quand nécessaire
- ✅ **Expérience fluide** : Toujours guidé vers la prochaine étape
- ✅ **Sécurité** : Mots de passe temporaires pour nouveaux comptes

### Pour l'Admin
- ✅ **Notifications claires** : Sait si compte créé ou non
- ✅ **Suivi facile** : Métadonnée `accountCreated` dans notification
- ✅ **Pas d'intervention** : Tout est automatique

### Pour vitalCHECK
- ✅ **Conversion maximale** : Tous les utilisateurs ont un compte
- ✅ **Rétention** : Historique garde les clients engagés
- ✅ **Upsell** : Promo des plans payants dans emails gratuits
- ✅ **Support optimisé** : Clients peuvent se self-service

---

## 🔧 Structure des Emails

### Tous les Emails Incluent :
- ✅ Header vitalCHECK (gradient vert)
- ✅ Design professionnel et responsive
- ✅ Call-to-Action clair (bouton)
- ✅ Footer avec contact
- ✅ Branding cohérent

### Éléments Conditionnels :
- 🔐 **Credentials** : Seulement si nouveau compte
- 📊 **Score** : Pour les évaluations
- 💳 **Badge Plan** : Pour les paiements
- 🎯 **Avantages** : Selon le plan (Standard vs Premium)
- 📈 **Promotions** : Pour les comptes gratuits

---

## 🧪 Tests

### Comment Tester Chaque Scénario

#### Test A : Évaluation Gratuite (Nouveau)
```bash
1. Allez sur / (pas connecté)
2. Démarrez évaluation
3. Complétez toutes les questions
4. Soumettez
5. ✅ Vérifiez email : "Votre rapport est prêt..."
6. ✅ Credentials inclus
7. Connectez-vous avec les credentials
```

#### Test B : Évaluation (Compte Existant)
```bash
1. Connectez-vous à /client/dashboard
2. Cliquez "Nouvelle évaluation"
3. Complétez l'évaluation
4. ✅ Vérifiez email : "Nouvelle évaluation complétée"
5. ✅ PAS de credentials
6. Allez sur dashboard → Nouvelle évaluation visible
```

#### Test C : Paiement (Nouveau Client)
```bash
1. Allez sur /pricing (pas connecté, jamais d'évaluation)
2. Sélectionnez Standard
3. Payez avec PayPal Sandbox
4. ✅ Vérifiez email : "Votre compte vitalCHECK STANDARD..."
5. ✅ Credentials inclus
6. Connectez-vous
7. ✅ Dashboard avec plan actif
```

#### Test D : Paiement (Client Gratuit → Upgrade)
```bash
1. Faites une évaluation gratuite (créé compte)
2. NE vous connectez PAS encore
3. Allez sur /pricing
4. Payez pour Standard
5. ✅ Vérifiez email : "Votre compte vitalCHECK STANDARD..."
6. ✅ Credentials inclus (nouveau password)
7. Connectez-vous
8. ✅ Dashboard avec anciennes évaluations + plan actif
```

#### Test E : Paiement (Client Connecté → Upgrade)
```bash
1. Connectez-vous avec un compte existant
2. Allez sur /pricing
3. Sélectionnez Premium
4. Payez
5. ✅ Vérifiez email : "Votre abonnement PREMIUM est activé !"
6. ✅ PAS de credentials
7. Rechargez dashboard
8. ✅ Plan mis à jour à PREMIUM
```

---

## 📝 Templates Email Créés

### 1. `sendAccountCreatedAfterAssessment(to, name, tempPassword, score)`
- **Quand** : Évaluation + Nouveau client
- **Identifiants** : ✅ Oui
- **Score** : ✅ Affiché
- **Promotion** : ✅ Plans payants

### 2. `sendAssessmentCompletedExistingUser(to, name, score)`
- **Quand** : Évaluation + Client existant
- **Identifiants** : ❌ Non
- **Score** : ✅ Affiché
- **Promotion** : ❌ Non

### 3. `sendAccountCreatedEmail(to, name, tempPassword, planName)`
- **Quand** : Paiement + Nouveau compte
- **Identifiants** : ✅ Oui
- **Score** : ❌ Non
- **Plan** : ✅ Badge coloré

### 4. `sendSubscriptionUpgradeEmail(to, name, planName, planId)`
- **Quand** : Paiement + Compte existant
- **Identifiants** : ❌ Non
- **Score** : ❌ Non
- **Plan** : ✅ Badge + Avantages

---

## 🔍 Vérification du Contexte

### Dans le Code Backend

**Évaluation** (`server/routes/assessments.js`) :
```javascript
if (!user.hasAccount) {
  // NOUVEAU CLIENT
  tempPassword = generateTempPassword()
  user.password = tempPassword
  user.hasAccount = true
  sendAccountCreatedAfterAssessment(...)
} else {
  // CLIENT EXISTANT
  sendAssessmentCompletedExistingUser(...)
}
```

**Paiement** (`server/routes/payments.js`) :
```javascript
if (!user || !user.hasAccount) {
  // NOUVEAU COMPTE (avec ou sans évaluation précédente)
  accountCreated = true
  tempPassword = generateTempPassword()
  user.password = tempPassword
  user.hasAccount = true
  sendAccountCreatedEmail(...)
} else {
  // COMPTE EXISTANT - UPGRADE
  updateSubscription()
  sendSubscriptionUpgradeEmail(...)
}
```

---

## 📧 Contenu des Emails

### Éléments Communs à Tous
- 🎨 Header vitalCHECK (gradient vert)
- 📧 From: "vitalCHECK <email>"
- 🏢 Footer : © vitalCHECK, Dakar, Contact
- 🔗 Liens cliquables
- 📱 Responsive design

### Différences Clés

| Email | Score | Credentials | Badge Plan | Promo | Bouton CTA |
|-------|-------|-------------|-----------|-------|------------|
| Évaluation Nouveau | ✅ | ✅ | ❌ | ✅ | "Accéder Dashboard" |
| Évaluation Existant | ✅ | ❌ | ❌ | ❌ | "Voir Dashboard" |
| Paiement Nouveau | ❌ | ✅ | ✅ | ❌ | "Se connecter" |
| Paiement Existant | ❌ | ❌ | ✅ | ❌ | "Accéder Dashboard" |

---

## 💡 Conseils d'Implémentation

### Gestion des Erreurs Email
```javascript
try {
  await sendEmail(...)
  console.log('✅ Email envoyé')
} catch (error) {
  console.error('❌ Erreur email:', error)
  // Continue quand même - ne pas bloquer le flux
}
```

### Logs Importants
```javascript
console.log('✅ Email de création de compte envoyé à:', email)
console.log('✅ Email de nouvelle évaluation envoyé à:', email)
console.log('✅ Email mise à jour abonnement envoyé à:', email)
```

### Métadonnées Admin
```javascript
notification.metadata = {
  paymentId: payment._id,
  accountCreated: true/false, // ← Important !
  ...
}
```

---

## 🚀 Avantages pour l'Entreprise

### Conversion
- ✅ **100% des utilisateurs** ont un compte après première action
- ✅ **Friction minimale** : Automatique, pas de formulaire
- ✅ **Email immédiat** : Client peut se connecter tout de suite

### Rétention
- ✅ **Historique** : Client voit sa progression
- ✅ **Engagement** : Revient pour voir le dashboard
- ✅ **Upsell** : Promotions dans emails gratuits

### Support
- ✅ **Self-service** : Clients autonomes
- ✅ **Traçabilité** : Tous les comptes dans la base
- ✅ **Communication** : Email direct pour chaque action

---

## ✅ Fichiers Modifiés

**Backend** :
- ✅ `server/routes/assessments.js` - Création compte après évaluation
- ✅ `server/routes/payments.js` - Emails contextuels selon statut
- ✅ `server/utils/emailService.js` - 4 templates email

**Exports** :
```javascript
module.exports = {
  sendAccountCreatedAfterAssessment,      // Nouveau
  sendAssessmentCompletedExistingUser,    // Nouveau
  sendAccountCreatedEmail,                // Existant
  sendSubscriptionUpgradeEmail            // Nouveau
}
```

---

## 🎯 Résultat Final

### Chaque Client Reçoit :
1. ✅ **L'email approprié** selon son statut
2. ✅ **Les identifiants** seulement si nouveau compte
3. ✅ **Les infos pertinentes** (score, plan, avantages)
4. ✅ **Un call-to-action** clair
5. ✅ **Une expérience personnalisée**

---

**📧 Système d'Emails Contextuels 100% Opérationnel ! 🎉**

*4 templates email créés*  
*5 scénarios utilisateur couverts*  
*100% d'automatisation*

