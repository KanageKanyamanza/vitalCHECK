# 🔐 Système d'Authentification Client - VitalCHECK

## 🎯 Vue d'Ensemble

VitalCHECK dispose maintenant d'un système complet d'authentification client permettant aux utilisateurs de :
- ✅ Créer un compte et se connecter
- ✅ Accéder à un tableau de bord personnalisé
- ✅ Consulter l'historique de toutes leurs évaluations
- ✅ Gérer leur profil et abonnement
- ✅ Suivre leurs paiements

## 📋 Architecture Complète

### Backend (Serveur)

#### 1. Modèle User Étendu (`server/models/User.js`)

**Nouveaux champs ajoutés** :
```javascript
{
  password: String (hashé avec bcrypt),
  firstName: String,
  lastName: String,
  phone: String,
  subscription: {
    plan: String (free/standard/premium/diagnostic),
    status: String (active/inactive/cancelled/expired),
    startDate: Date,
    endDate: Date,
    paymentId: ObjectId (référence Payment)
  },
  hasAccount: Boolean,
  emailVerified: Boolean,
  lastLogin: Date
}
```

**Méthodes** :
- `comparePassword()` : Vérifier le mot de passe
- `generateTempPassword()` : Générer un mot de passe temporaire

#### 2. Routes d'Authentification (`server/routes/clientAuth.js`)

**Routes publiques** :
- `POST /api/client-auth/register` : Créer un compte
- `POST /api/client-auth/login` : Se connecter

**Routes protégées** (nécessitent un token JWT) :
- `GET /api/client-auth/me` : Obtenir le profil
- `PUT /api/client-auth/profile` : Mettre à jour le profil
- `PUT /api/client-auth/change-password` : Changer le mot de passe
- `GET /api/client-auth/payments` : Voir ses paiements

#### 3. Création Automatique de Compte après Paiement

**Dans `server/routes/payments.js`** :

Quand un paiement est reçu :
1. **Nouveau client** :
   - Créer un compte User
   - Générer un mot de passe temporaire
   - Activer l'abonnement
   - Envoyer email avec identifiants

2. **Client existant sans compte** :
   - Ajouter mot de passe
   - Activer l'abonnement
   - Envoyer email avec identifiants

3. **Client avec compte** :
   - Mettre à jour l'abonnement
   - Pas d'email (déjà connecté)

#### 4. Templates Email

**`sendAccountCreatedEmail()`** : Email après paiement avec identifiants
**`sendWelcomeEmail()`** : Email de bienvenue pour inscription manuelle

### Frontend (Client)

#### 1. Contexte d'Authentification (`ClientAuthContext.jsx`)

**Fonctions exposées** :
```javascript
{
  user: Object,           // Utilisateur connecté
  loading: Boolean,       // État de chargement
  isAuthenticated: Boolean,
  register: Function,     // Créer un compte
  login: Function,        // Se connecter
  logout: Function,       // Se déconnecter
  updateProfile: Function,
  changePassword: Function,
  refreshUser: Function
}
```

**Gestion du Token** :
- Stocké dans `localStorage.clientToken`
- Ajouté automatiquement à toutes les requêtes axios
- Expiré après 7 jours

#### 2. Pages Client

##### Page Login (`/client/login`)
- Formulaire email + mot de passe
- Bouton "Afficher/Masquer mot de passe"
- Lien vers inscription
- Redirection auto si déjà connecté

##### Page Register (`/client/register`)
- Formulaire complet :
  - Prénom, Nom
  - Email
  - Mot de passe + Confirmation
  - Entreprise (nom, secteur, taille)
  - Téléphone (optionnel)
- Validation côté client
- Redirection auto si déjà connecté

##### Page Dashboard (`/client/dashboard`)
- **Cartes statistiques** :
  - Abonnement actuel (GRATUIT/STANDARD/PREMIUM/DIAGNOSTIC)
  - Nombre d'évaluations
  - Nombre de paiements
- **Historique des évaluations** :
  - Liste de toutes les évaluations
  - Score de chaque évaluation
  - Bouton "Voir le rapport"
- **Historique des paiements** :
  - Tableau des paiements
  - Date, Plan, Montant, Statut

##### Page Profile (`/client/profile`)
- **3 onglets** :
  1. **Profil** : Modifier infos personnelles
  2. **Abonnement** : Voir plan actuel, dates, changer de plan
  3. **Sécurité** : Changer le mot de passe

#### 3. Protection des Routes

Routes client accessibles uniquement si connecté :
- `/client/dashboard`
- `/client/profile`

Si non connecté → Redirection vers `/client/login`

## 🔄 Flux Utilisateur Complet

### Scénario 1 : Nouveau Client avec Paiement

```
1. Client paie via PayPal (Standard/Premium/Diagnostic)
   ↓
2. Backend enregistre le paiement
   ↓
3. Backend créé automatiquement un compte User
   ↓
4. Génération d'un mot de passe temporaire
   ↓
5. Email envoyé avec identifiants :
   - Email: client@example.com
   - Mot de passe temporaire: Xyz@1234Abc$
   ↓
6. Client reçoit l'email "Votre compte VitalCHECK [PLAN] est prêt !"
   ↓
7. Client clique sur "Se connecter maintenant"
   ↓
8. Page Login (/client/login)
   ↓
9. Client entre ses identifiants
   ↓
10. Redirection vers Dashboard (/client/dashboard)
    ↓
11. Client voit ses évaluations, son abonnement, etc.
    ↓
12. Client change son mot de passe (Profil → Sécurité)
```

### Scénario 2 : Client Existant qui Paie

```
1. Client avec évaluations gratuites paie
   ↓
2. Backend met à jour son compte (ajoute password + abonnement)
   ↓
3. Email avec identifiants envoyé
   ↓
4. Client peut se connecter
   ↓
5. Dashboard avec TOUTES ses évaluations (anciennes + nouvelles)
```

### Scénario 3 : Inscription Manuelle (Sans Paiement)

```
1. Client va sur /client/register
   ↓
2. Remplit le formulaire complet
   ↓
3. Créé un compte avec plan GRATUIT
   ↓
4. Email de bienvenue envoyé
   ↓
5. Connexion automatique → Dashboard
   ↓
6. Client peut faire des évaluations gratuites
   ↓
7. Si upgrade → Paiement → Plan activé
```

## 💳 Intégration Paiement → Compte

### Dans `server/routes/payments.js` :

```javascript
// Après enregistrement du paiement

1. Rechercher si User existe avec cet email
   
2. Si NON :
   - Créer nouveau User
   - Générer mot de passe temporaire
   - subscription.plan = planId (standard/premium/diagnostic)
   - subscription.status = 'active'
   - subscription.startDate = aujourd'hui
   - subscription.endDate = +1 an
   - hasAccount = true
   - Envoyer email avec identifiants
   
3. Si OUI mais hasAccount = false :
   - Ajouter mot de passe temporaire
   - Activer abonnement
   - hasAccount = true
   - Envoyer email avec identifiants
   
4. Si OUI et hasAccount = true :
   - Mettre à jour abonnement
   - Pas d'email (client déjà inscrit)
```

## 📧 Emails Automatiques

### Email après Paiement (Nouveau Compte)

**Sujet** : `Votre compte VitalCHECK [STANDARD/PREMIUM/DIAGNOSTIC] est prêt !`

**Contenu** :
- ✅ Badge du plan acheté
- ✅ Identifiants de connexion (email + mot de passe temporaire)
- ✅ Avertissement de changer le mot de passe
- ✅ Liste des fonctionnalités disponibles
- ✅ Bouton "Se connecter maintenant"
- ✅ Note : Équipe contactera sous 24h

### Email Inscription Manuelle

**Sujet** : `Bienvenue sur VitalCHECK - Vos identifiants de connexion`

**Contenu** :
- ✅ Message de bienvenue
- ✅ Identifiants (si mot de passe temporaire)
- ✅ Fonctionnalités du compte
- ✅ Bouton de connexion

## 🎨 Interface Utilisateur

### Dashboard Client

**Header** :
```
Bienvenue, [Prénom]!          [⚙️ Paramètres] [🚪 Déconnexion]
email@example.com
```

**3 Cartes Statistiques** :
1. Abonnement (Badge coloré + Statut)
2. Évaluations (Nombre + Bouton "Nouvelle")
3. Paiements (Nombre)

**Historique Évaluations** :
- Carte par évaluation
- Date, Score
- Bouton "Voir le rapport"

**Historique Paiements** :
- Tableau avec Date, Plan, Montant, Statut

### Page Profil

**3 Onglets** :

1. **Profil** :
   - Prénom, Nom (éditable)
   - Email (lecture seule)
   - Entreprise, Secteur, Taille (éditable)
   - Téléphone (éditable)
   - Bouton "Enregistrer"

2. **Abonnement** :
   - Badge du plan actuel
   - Statut (Actif/Inactif)
   - Dates début/fin
   - Bouton "Changer de plan" → /pricing

3. **Sécurité** :
   - Mot de passe actuel
   - Nouveau mot de passe
   - Confirmation
   - Bouton "Changer le mot de passe"

## 🔒 Sécurité

### Backend
- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Tokens JWT signés (secret dans .env)
- ✅ Middleware authenticateClient pour routes protégées
- ✅ Password non inclus dans les requêtes (select: false)
- ✅ Validation des données

### Frontend
- ✅ Token stocké dans localStorage
- ✅ Token ajouté aux headers automatiquement
- ✅ Redirection si non authentifié
- ✅ Validation des formulaires côté client
- ✅ Affichage/Masquage mot de passe

## ⚙️ Configuration Requise

### Variables d'Environnement Backend

Ajoutez dans `server/.env` :
```env
JWT_SECRET=votre_secret_jwt_super_securise_32_caracteres_minimum
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
MONGODB_URI=votre_mongodb_uri
```

**Important** : Le `JWT_SECRET` doit être une chaîne aléatoire longue et sécurisée.

Générer un secret :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📁 Fichiers Créés/Modifiés

### Backend
- ✅ `server/models/User.js` - Modèle étendu avec auth
- ✅ `server/routes/clientAuth.js` - Routes auth client
- ✅ `server/routes/payments.js` - Création auto de compte
- ✅ `server/utils/emailService.js` - Templates email
- ✅ `server/index.js` - Route /api/client-auth ajoutée

### Frontend
- ✅ `client/src/context/ClientAuthContext.jsx` - Context auth
- ✅ `client/src/pages/client/ClientLoginPage.jsx` - Page login
- ✅ `client/src/pages/client/ClientRegisterPage.jsx` - Page register
- ✅ `client/src/pages/client/ClientDashboardPage.jsx` - Dashboard
- ✅ `client/src/pages/client/ClientProfilePage.jsx` - Profil
- ✅ `client/src/App.jsx` - ClientAuthProvider wrapper
- ✅ `client/src/routes/AppRoutes.jsx` - Routes client
- ✅ `client/src/i18n/locales/fr.json` - Traductions FR
- ✅ `client/src/i18n/locales/en.json` - Traductions EN

## 🚀 Pour Tester

### 1. Préparation

```bash
# Backend
cd server
# Assurez-vous que JWT_SECRET est dans .env
npm start

# Frontend (autre terminal)
cd client
npm run dev
```

### 2. Test Flux Complet

#### Option A : Avec Paiement

1. **Effectuer un paiement test** :
   - Allez sur `/pricing`
   - Cliquez "Sélectionner" sur Standard
   - Payez avec PayPal Sandbox
   - ✅ Compte créé automatiquement

2. **Vérifier l'email** :
   - Consultez votre inbox
   - Email : "Votre compte VitalCHECK STANDARD est prêt !"
   - Notez le mot de passe temporaire

3. **Se connecter** :
   - Allez sur `/client/login`
   - Email: votre_email
   - Mot de passe: le mot de passe temporaire
   - ✅ Redirection vers `/client/dashboard`

4. **Explorer le Dashboard** :
   - Voir votre plan (STANDARD)
   - Voir vos évaluations (si vous en avez)
   - Voir vos paiements

5. **Changer le mot de passe** :
   - Cliquez "⚙️ Paramètres"
   - Onglet "Sécurité"
   - Changez le mot de passe temporaire

#### Option B : Inscription Manuelle

1. **Créer un compte** :
   - Allez sur `/client/register`
   - Remplissez tous les champs
   - ✅ Compte créé avec plan GRATUIT

2. **Connexion automatique** :
   - ✅ Redirection vers Dashboard

3. **Faire une évaluation** :
   - Cliquez "Nouvelle évaluation"
   - Complétez l'évaluation
   - ✅ Apparaît dans l'historique

4. **Upgrader** :
   - Dashboard → "Gérer mon abonnement"
   - Ou Profil → Abonnement → "Changer de plan"
   - Paiement → Abonnement activé

## 🎯 Fonctionnalités Clés

### 1. Tableau de Bord Personnalisé
- Vision globale de l'activité
- Stats en temps réel
- Accès rapide aux évaluations

### 2. Historique Complet
- Toutes les évaluations en un seul endroit
- Scores et dates
- Téléchargement des rapports

### 3. Gestion d'Abonnement
- Voir le plan actuel
- Dates de début/fin
- Upgrade facile

### 4. Sécurité
- Changement de mot de passe
- Mots de passe hashés
- Tokens JWT sécurisés

## 📊 Gestion Admin

### Notification Automatique

Quand un compte est créé automatiquement :
- **Notification admin** contient `accountCreated: true`
- Admin peut voir si le compte a été créé
- Admin peut envoyer un email de suivi

### Voir les Comptes Créés

Dans Admin → Paiements :
- Colonne "Email" montre l'email du client
- Client peut maintenant se connecter
- Admin peut envoyer des emails de suivi

## 🔧 Dépannage

### Compte non créé après paiement

**Vérifiez** :
1. Email dans les logs backend
2. Erreur dans console serveur
3. Configuration EMAIL_USER et EMAIL_PASS

**Solution** : L'email peut échouer mais le compte est créé quand même

### Impossible de se connecter

**Vérifiez** :
1. Email correct (lowercase)
2. Mot de passe temporaire exact (copier-coller)
3. Compte a `hasAccount: true` dans MongoDB

### Token expiré

**Message** : "Token invalide"

**Solution** :
1. Se déconnecter
2. Se reconnecter
3. Nouveau token de 7 jours

## 📝 Messages aux Clients

### Après Paiement (Page de Succès)

Mettre à jour `paymentSuccess.*` :
```
"Vous recevrez un email avec vos identifiants de connexion sous peu."
"Connectez-vous pour accéder à votre tableau de bord personnalisé."
```

### Dans le Dashboard

Messages à afficher :
- "Bienvenue dans votre espace VitalCHECK !"
- "Votre abonnement [PLAN] est actif"
- "Vous avez X évaluations"

## 🎁 Avantages pour les Clients

### Plan GRATUIT
- ✅ Compte gratuit
- ✅ Historique des évaluations
- ✅ Rapports basiques
- ✅ Tableau de bord

### Plans STANDARD/PREMIUM/DIAGNOSTIC
- ✅ Tout du plan gratuit
- ✅ Fonctionnalités premium actives
- ✅ Historique complet
- ✅ Suivi de progression
- ✅ Support prioritaire
- ✅ Rapports avancés

## 🚀 Prochaines Améliorations Possibles

- [ ] Réinitialisation de mot de passe par email
- [ ] Vérification d'email (token)
- [ ] Authentification à deux facteurs (2FA)
- [ ] Notifications push pour nouvelles évaluations
- [ ] Export de données utilisateur
- [ ] Suppression de compte
- [ ] Partage de rapports
- [ ] Comparaison d'évaluations dans le temps

---

## ✅ Système Complet et Fonctionnel !

**Le système d'authentification client est maintenant opérationnel ! 🎉**

Les clients peuvent :
- Se connecter
- Gérer leur profil
- Voir leur historique
- Suivre leur abonnement

Tout est en place pour offrir une expérience premium ! 🚀

