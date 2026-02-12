# 📚 Structure Complète du Projet UBB Enterprise Health Check

## 🎯 Vue d'Ensemble

Ce projet est une **application web full-stack** utilisant la stack **MERN** (MongoDB, Express, React, Node.js) avec **Vite** et **Tailwind CSS**. Il s'agit d'une application d'évaluation de santé d'entreprise avec un système d'administration complet.

---

## 📁 Structure Racine

```
UBB_Enterprise_Health_Check/
├── client/              # Frontend React + Vite
├── server/              # Backend Node.js + Express
├── scripts/             # Scripts utilitaires globaux
├── package.json         # Configuration racine (monorepo)
├── package-lock.json
├── yarn.lock
├── .gitignore
├── .gitattributes
├── .hintrc              # Configuration HTMLHint
└── README.md
```

---

## 🎨 Frontend (`/client`)

### Structure Principale

```
client/
├── public/              # Assets statiques
│   ├── manifest.json    # Configuration PWA
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sw.js           # Service Worker
│   └── [icônes PWA]    # Diverses tailles d'icônes
├── src/
│   ├── assets/         # Images, logos
│   ├── components/     # Composants React réutilisables
│   ├── config/         # Configurations (PayPal, etc.)
│   ├── context/        # Context API (state management)
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalisation
│   ├── pages/          # Pages de l'application
│   ├── routes/         # Configuration des routes
│   ├── services/       # Services API
│   ├── utils/          # Utilitaires
│   ├── App.jsx         # Composant racine
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── scripts/            # Scripts de build
├── index.html          # HTML principal
├── vite.config.js      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind CSS
├── postcss.config.js   # Configuration PostCSS
├── package.json        # Dépendances frontend
├── env.example         # Variables d'environnement exemple
└── vercel.json         # Configuration Vercel (déploiement)
```

### Détails des Dossiers Frontend

#### `/client/src/components/`
Composants organisés par fonctionnalité :

```
components/
├── admin/              # Composants panel admin
│   ├── AdminLayout.jsx
│   ├── AdminHeader.jsx
│   ├── AdminSidebar.jsx
│   ├── BlogModal.jsx
│   ├── RichTextEditor.jsx
│   └── chatbot/        # Composants chatbot admin
├── assessment/         # Composants évaluation
│   ├── AssessmentForm.jsx
│   ├── QuestionCard.jsx
│   └── ProgressBar.jsx
├── blog/               # Composants blog
├── chat/               # Widget chat
├── layout/             # Layout principal
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── SplashScreen.jsx
├── navigation/         # Navigation
├── payment/            # Intégration PayPal
├── seo/                # Composants SEO
│   ├── SEOHead.jsx
│   ├── Breadcrumbs.jsx
│   └── PerformanceAnalytics.jsx
└── ui/                 # Composants UI réutilisables
    ├── ScoreGauge.jsx
    ├── PillarChart.jsx
    └── LanguageSelector.jsx
```

#### `/client/src/pages/`
Pages de l'application :

```
pages/
├── LandingPage.jsx          # Page d'accueil
├── AssessmentPage.jsx      # Page d'évaluation
├── ResultsPage.jsx         # Résultats
├── BlogPage.jsx            # Liste des blogs
├── BlogDetailPage.jsx      # Détail d'un blog
├── ContactPage.jsx
├── PricingPage.jsx
├── CheckoutPage.jsx
├── PaymentSuccessPage.jsx
├── client/                 # Pages client
│   ├── ClientRegisterPage.jsx
│   ├── ClientDashboardPage.jsx
│   └── ClientProfilePage.jsx
└── admin/                  # Pages admin
    ├── AdminApp.jsx        # Router admin
    ├── AdminDashboard.jsx
    ├── UserManagement.jsx
    ├── AssessmentManagement.jsx
    ├── BlogManagement.jsx
    ├── NewsletterManagement.jsx
    └── [autres pages admin]
```

#### `/client/src/context/`
Gestion d'état avec Context API :

- `AssessmentContext.jsx` : État des évaluations
- `ClientAuthContext.jsx` : Authentification client

#### `/client/src/services/`
Services API et utilitaires :

- `api.js` : Configuration Axios et toutes les fonctions API
- `pdfService.js` : Génération PDF côté client
- `translationService.js` : Service de traduction
- `trackingService.js` : Analytics et tracking

#### `/client/src/hooks/`
Custom React Hooks :

- `useAdminApi.js` : Hook pour appels API admin
- `useLoading.js` : Gestion du loading
- `usePushNotifications.js` : Notifications push
- `usePWAUpdate.js` : Mises à jour PWA

#### `/client/src/i18n/`
Internationalisation :

```
i18n/
├── index.js              # Configuration i18next
└── locales/
    ├── en.json           # Traductions anglais
    └── fr.json           # Traductions français
```

#### `/client/src/utils/`
Utilitaires :

- `colors.js` : Palette de couleurs
- `visitorId.js` : Gestion des IDs visiteurs
- `seoData.js` : Données SEO
- `pdfGeneratorClient.js` : Génération PDF client

### Configuration Frontend

#### `vite.config.js`
- Port : 5173
- Proxy API vers backend
- Optimisations de build (code splitting)
- Configuration PWA

#### `tailwind.config.js`
- Thème personnalisé (couleurs vitalCHECK)
- Fonts (Inter, Poppins)
- Animations personnalisées

#### `package.json` (client)
**Dépendances principales :**
- React 18.2.0
- React Router DOM 6.20.1
- Vite 5.0.8
- Tailwind CSS 3.4.0
- Axios 1.12.2
- Framer Motion 10.16.16
- React i18next 13.5.0
- Recharts 2.8.0
- React Hook Form 7.48.2
- React Hot Toast 2.4.1
- TipTap 3.6.2 (éditeur riche)
- PayPal React SDK 8.9.2

---

## ⚙️ Backend (`/server`)

### Structure Principale

```
server/
├── config/              # Configurations
│   └── cloudinary.js    # Configuration Cloudinary
├── data/                # Données statiques
│   ├── questions.js     # Questions d'évaluation (EN)
│   ├── questions-fr.js  # Questions d'évaluation (FR)
│   └── chatbot-translations.js
├── models/              # Modèles Mongoose
│   ├── User.js
│   ├── Assessment.js
│   ├── Blog.js
│   ├── Admin.js
│   ├── Payment.js
│   ├── Newsletter.js
│   ├── Notification.js
│   └── [autres modèles]
├── routes/              # Routes API Express
│   ├── auth.js          # Authentification
│   ├── assessments.js   # Évaluations
│   ├── blogs.js         # Blogs
│   ├── admin.js         # Panel admin
│   ├── payments.js      # Paiements
│   ├── newsletters.js   # Newsletters
│   ├── chatbot.js       # Chatbot
│   └── [autres routes]
├── scripts/             # Scripts utilitaires
│   ├── create-admin.js
│   ├── generate-sitemap.js
│   ├── migrate-blog-to-bilingual.js
│   └── [autres scripts]
├── utils/               # Utilitaires backend
│   ├── auth.js          # Middleware auth
│   ├── emailService.js  # Service email
│   ├── pdfGenerator.js  # Génération PDF
│   ├── scoring.js       # Calcul des scores
│   ├── newsletterScheduler.js
│   └── [autres utils]
├── public/              # Fichiers publics
│   └── sitemap.xml
├── index.js             # Point d'entrée serveur
├── package.json         # Dépendances backend
├── env.example          # Variables d'environnement
├── Dockerfile           # Configuration Docker
├── render.yaml          # Configuration Render.com
└── MONGODB_SETUP.md     # Documentation MongoDB
```

### Détails des Dossiers Backend

#### `/server/models/`
Modèles Mongoose (MongoDB) :

- **User.js** : Utilisateurs clients
- **Assessment.js** : Évaluations
- **Blog.js** : Articles de blog
- **Admin.js** : Administrateurs
- **Payment.js** : Transactions PayPal
- **Newsletter.js** : Newsletters
- **NewsletterSubscriber.js** : Abonnés newsletters
- **Notification.js** : Notifications push
- **ChatbotInteraction.js** : Interactions chatbot
- **BlogVisitor.js** : Visiteurs blog
- **BlogVisit.js** : Visites blog
- **BlogLike.js** : Likes blog
- **Contact.js** : Messages contact

#### `/server/routes/`
Routes API organisées par domaine :

```
routes/
├── auth.js              # POST /api/auth/register
├── clientAuth.js        # POST /api/client-auth/login
├── unifiedAuth.js       # POST /api/unified-auth/login
├── assessments.js       # GET/POST /api/assessments/*
├── reports.js           # POST /api/reports/generate/:id
├── blogs.js             # GET/POST /api/blogs/*
├── admin.js             # GET/POST /api/admin/*
├── payments.js          # POST /api/payments/record
├── newsletters.js       # GET/POST /api/newsletters/*
├── chatbot.js           # POST /api/chat/chatbot
├── notifications.js     # POST /api/notifications/*
├── contact.js           # POST /api/contact
├── upload.js            # POST /api/upload/*
├── sitemap.js           # GET /sitemap.xml
└── ping.js              # GET /api/ping
```

#### `/server/utils/`
Utilitaires backend :

- **auth.js** : Middleware JWT, vérification tokens
- **emailService.js** : Envoi emails (Nodemailer)
- **emailServiceAlternative.js** : Alternative email
- **emailServiceExternal.js** : EmailJS/SendGrid
- **emailTemplates.js** : Templates emails
- **pdfGenerator.js** : Génération PDF (html-pdf-node)
- **scoring.js** : Calcul scores évaluation
- **newsletterScheduler.js** : Planification newsletters
- **pushService.js** : Notifications push (web-push)
- **visitorUtils.js** : Utilitaires visiteurs
- **deviceAnalyzer.js** : Analyse appareils
- **exportUtils.js** : Export Excel/PDF

#### `/server/data/`
Données statiques :

- **questions.js** : Questions évaluation (anglais)
- **questions-fr.js** : Questions évaluation (français)
- **chatbot-translations.js** : Traductions chatbot

#### `/server/scripts/`
Scripts utilitaires :

- **create-admin.js** : Créer un admin
- **init-admin.js** : Initialiser admin par défaut
- **generate-sitemap.js** : Générer sitemap
- **migrate-blog-to-bilingual.js** : Migration blogs
- **cleanup-draft-assessments.js** : Nettoyer brouillons
- **test-*.js** : Scripts de test

### Configuration Backend

#### `server/index.js`
Point d'entrée principal :

1. **Configuration Express**
   - Helmet (sécurité)
   - CORS (origines autorisées)
   - Body parser (JSON, URL-encoded)
   - Cookie parser

2. **Routes**
   - Toutes les routes API montées sur `/api/*`
   - Routes SEO sur `/`

3. **Connexion MongoDB**
   - Connexion avec Mongoose
   - Initialisation admin au démarrage
   - Gestion erreurs connexion

4. **Middleware**
   - Error handling
   - 404 handler
   - Health check endpoint

#### `package.json` (server)
**Dépendances principales :**
- Express 4.18.2
- Mongoose 8.0.3
- jsonwebtoken 9.0.2
- bcryptjs 2.4.3
- cors 2.8.5
- helmet 7.1.0
- dotenv 16.3.1
- nodemailer 6.9.7
- html-pdf-node 1.0.7
- cloudinary 2.7.0
- multer 2.0.2
- exceljs 4.4.0
- web-push 3.6.7
- @sendgrid/mail 8.1.6
- @emailjs/nodejs 5.0.2

---

## 🔧 Configuration Racine

### `package.json` (racine)
Scripts monorepo :

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install",
    "start": "cd server && npm start"
  }
}
```

### `.gitignore`
- `node_modules/`
- `.env*`
- `dist/`
- Documentation de fonctionnalités

---

## 🌍 Variables d'Environnement

### `server/.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitalCHECK-health-check
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
FRONTEND_URL=https://www.checkmyenterprise.com
BACKEND_URL=https://ubb-enterprise-health-check.onrender.com/api
EMAIL_FROM=info@checkmyenterprise.com
```

### `client/.env`
```env
VITE_API_URL=https://ubb-enterprise-health-check.onrender.com/api
```

---

## 🚀 Architecture Technique

### Stack Technologique

**Frontend :**
- React 18 (Hooks, Context API)
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Axios (HTTP client)
- i18next (internationalisation)
- Framer Motion (animations)
- Recharts (graphiques)
- TipTap (éditeur riche)

**Backend :**
- Node.js
- Express.js (framework web)
- MongoDB + Mongoose (base de données)
- JWT (authentification)
- Nodemailer (emails)
- html-pdf-node (génération PDF)
- Cloudinary (stockage images)
- Web Push (notifications)

### Patterns Architecturaux

1. **Monorepo** : Frontend et backend dans le même repo
2. **RESTful API** : Routes API REST standard
3. **Context API** : Gestion d'état React (pas Redux)
4. **Service Layer** : Services API séparés (`services/api.js`)
5. **Component-Based** : Composants React réutilisables
6. **Middleware Pattern** : Middleware Express pour auth, errors
7. **MVC-like** : Models (Mongoose), Routes (Controllers), Views (React)

---

## 📦 Dépendances Principales

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.12.2",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.16.16",
    "react-i18next": "^13.5.0",
    "recharts": "^2.8.0",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "@tiptap/react": "^3.6.2",
    "@paypal/react-paypal-js": "^8.9.2"
  }
}
```

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "nodemailer": "^6.9.7",
    "html-pdf-node": "^1.0.7",
    "cloudinary": "^2.7.0",
    "multer": "^2.0.2",
    "web-push": "^3.6.7"
  }
}
```

---

## 🔐 Sécurité

1. **Helmet** : Headers de sécurité HTTP
2. **CORS** : Origines autorisées configurées
3. **JWT** : Authentification par tokens
4. **bcryptjs** : Hashage des mots de passe
5. **Validation** : Express Validator
6. **Rate Limiting** : (désactivé actuellement)

---

## 📱 Fonctionnalités Principales

### 1. Système d'Évaluation
- Questionnaire 12 questions (6 piliers)
- Calcul automatique des scores
- Génération de rapports PDF
- Sauvegarde de brouillons

### 2. Authentification
- Inscription/Connexion clients
- Panel admin séparé
- Connexion unifiée
- Réinitialisation mot de passe

### 3. Blog
- CRUD articles
- Système de likes
- Tracking visiteurs
- Analytics détaillées
- Support multilingue

### 4. Paiements
- Intégration PayPal
- Gestion transactions
- Emails de confirmation

### 5. Newsletters
- Abonnements
- Envoi programmé
- Templates emails

### 6. Chatbot
- Chat interactif
- Analytics
- Gestion réponses

### 7. Notifications
- Push notifications
- Notifications admin
- Badge app

### 8. SEO
- Sitemap dynamique
- Meta tags
- Structured data
- Performance analytics

---

## 🛠️ Scripts Disponibles

### Racine
```bash
npm run dev          # Démarrer frontend + backend
npm run server        # Backend uniquement
npm run client        # Frontend uniquement
npm run build         # Build production frontend
npm run install-all   # Installer toutes les dépendances
npm start            # Démarrer serveur production
```

### Backend (`server/`)
```bash
npm run dev          # Développement avec nodemon
npm start            # Production
npm run generate-sitemap
npm run create-admin
```

### Frontend (`client/`)
```bash
npm run dev          # Développement Vite
npm run build        # Build production
npm run preview      # Prévisualiser build
```

---

## 📂 Fichiers de Configuration Importants

1. **`package.json`** (racine) : Scripts monorepo
2. **`client/vite.config.js`** : Configuration Vite
3. **`client/tailwind.config.js`** : Thème Tailwind
4. **`server/index.js`** : Configuration Express
5. **`.env`** (server/client) : Variables d'environnement
6. **`.gitignore`** : Fichiers ignorés par Git

---

## 🎨 Design System

### Couleurs (Tailwind)
- **Primary** : Vert vitalCHECK (#00751B)
- **Secondary** : Ocre chaud (#d97706)
- **Accent** : Jaune vitalCHECK (#F4C542)
- **Success** : Vert (#10b981)
- **Warning** : Ambre (#f59e0b)
- **Danger** : Rouge (#ef4444)

### Typographie
- **Sans-serif** : Inter (body)
- **Display** : Poppins (titres)

---

## 📊 Base de Données (MongoDB)

### Collections Principales
- `users` : Utilisateurs clients
- `assessments` : Évaluations
- `blogs` : Articles blog
- `admins` : Administrateurs
- `payments` : Transactions
- `newsletters` : Newsletters
- `newslettersubscribers` : Abonnés
- `notifications` : Notifications
- `chatbotinteractions` : Interactions chatbot
- `blogvisitors` : Visiteurs blog
- `blogvisits` : Visites blog
- `bloglikes` : Likes blog

---

## 🚢 Déploiement

### Frontend
- **Vercel** : Déploiement automatique
- Configuration : `vercel.json`

### Backend
- **Render.com** : Serveur Node.js
- Configuration : `render.yaml`
- Docker : `Dockerfile` disponible

---

## 📝 Guide de Création d'un Nouveau Projet

### 1. Structure de Base
```bash
mkdir mon-projet
cd mon-projet
npm init -y
```

### 2. Créer les dossiers
```bash
mkdir client server scripts
```

### 3. Initialiser Frontend
```bash
cd client
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios tailwindcss
```

### 4. Initialiser Backend
```bash
cd ../server
npm init -y
npm install express mongoose cors helmet dotenv
```

### 5. Configuration Monorepo
Créer `package.json` à la racine avec scripts `dev`, `server`, `client`.

### 6. Structure des Dossiers
Créer la même structure de dossiers que ce projet :
- `client/src/components/`
- `client/src/pages/`
- `client/src/services/`
- `client/src/context/`
- `server/routes/`
- `server/models/`
- `server/utils/`

### 7. Configuration
- Copier `vite.config.js`, `tailwind.config.js`
- Configurer `.env` pour server et client
- Configurer CORS dans `server/index.js`

### 8. Dépendances
Installer toutes les dépendances listées dans les `package.json` de ce projet selon vos besoins.

---

## ✅ Checklist de Création

- [ ] Structure de dossiers créée
- [ ] Frontend initialisé (Vite + React)
- [ ] Backend initialisé (Express)
- [ ] MongoDB configuré
- [ ] Variables d'environnement configurées
- [ ] Routes API créées
- [ ] Composants React créés
- [ ] Authentification implémentée
- [ ] Services API configurés
- [ ] Tailwind CSS configuré
- [ ] i18n configuré (si multilingue)
- [ ] Scripts npm configurés
- [ ] `.gitignore` configuré
- [ ] README.md créé

---

## 📚 Ressources Supplémentaires

- **Documentation React** : https://react.dev
- **Documentation Express** : https://expressjs.com
- **Documentation MongoDB** : https://www.mongodb.com/docs
- **Documentation Vite** : https://vitejs.dev
- **Documentation Tailwind** : https://tailwindcss.com

---

**Note** : Cette structure est optimisée pour un projet full-stack moderne avec séparation claire entre frontend et backend, facilitant la maintenance et l'évolutivité.
