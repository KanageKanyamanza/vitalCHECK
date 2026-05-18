# vitalCHECK Enterprise Health Check

Une application web complète pour évaluer la santé d'entreprise avec la stack MERN + Vite + Tailwind CSS.

## 🚀 Fonctionnalités

- **Évaluation Interactive** : Questionnaire de 12 questions couvrant 6 piliers clés
- **Scoring Intelligent** : Système de notation automatique avec seuils colorés
- **Rapports PDF** : Génération automatique de rapports détaillés
- **Interface Moderne** : Design responsive avec Tailwind CSS
- **Gestion des Utilisateurs** : Inscription et suivi des évaluations
- **Recommandations Personnalisées** : Conseils adaptés selon les scores
- **Support Multilingue** : Interface disponible en anglais et français

## 📚 Documentation

Une documentation détaillée de toutes les fonctionnalités du projet (frontend et backend) est disponible dans le dossier `docs/` :

- [Index de la documentation](docs/README.md)
- [Système d'Évaluation](docs/features/assessment.md)
- [Authentification](docs/features/auth.md)
- [Blog](docs/features/blog.md)
- [Paiements](docs/features/payments.md)
- [Newsletters](docs/features/newsletters.md)
- [Chatbot](docs/features/chatbot.md)
- [Notifications](docs/features/notifications.md)
- [SEO & Analytics](docs/features/seo.md)
- [Panel d'Administration](docs/features/admin.md)

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)

- **API REST** : Routes pour authentification, évaluations et rapports
- **Modèles de Données** : User, Assessment avec relations
- **Génération PDF** : Rapports automatiques avec html-pdf-node
- **Envoi d'Emails** : Notifications avec rapports en pièce jointe
- **Sécurité** : Helmet, CORS, Rate Limiting

### Frontend (React + Vite + Tailwind CSS)

- **Pages** : Landing, Assessment, Results
- **Composants** : QuestionCard, ScoreGauge, PillarChart
- **État Global** : Context API pour la gestion des données
- **Animations** : Framer Motion pour une UX fluide
- **Graphiques** : Recharts pour la visualisation des données

## 📊 Piliers d'Évaluation

1. **Finance & Cash Flow** - Gestion financière et trésorerie
2. **Operations & Processes** - Processus et efficacité opérationnelle
3. **Sales & Marketing** - Ventes et stratégie marketing
4. **People & HR** - Ressources humaines et développement
5. **Strategy & Governance** - Stratégie et gouvernance
6. **Technology & Digital Readiness** - Maturité technologique

## 🎯 Système de Scoring

- **Chaque question** : 0-3 points
- **Score par pilier** : Moyenne × 25 (0-100)
- **Score global** : Moyenne de tous les piliers
- **Seuils** :
  - 🔴 Rouge (0-39) : Critique
  - 🟡 Ambre (40-69) : À améliorer
  - 🟢 Vert (70-100) : En bonne santé

## 🛠️ Installation

### Prérequis

- Node.js (v16+)
- MongoDB
- npm ou yarn

### Installation Complète

```bash
# Cloner le projet
git clone <repository-url>
cd vitalCHECK_Enterprise_Health_Check

# Installer toutes les dépendances
npm run install-all

# Configuration
cp server/env.example server/.env
cp client/env.example client/.env

# Éditer les variables d'environnement
# server/.env - Configurer MongoDB, JWT, Email
# client/.env - Configurer l'URL de l'API
```

### Variables d'Environnement

#### Backend (server/.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitalCHECK-health-check
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@checkmyenterprise.com
EMAIL_PASS=your-app-password
EMAIL_FROM=info@checkmyenterprise.com

# Note: CORS configuration is now hardcoded in server/index.js
```

#### Frontend (client/.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage

### Développement

```bash
# Démarrer MongoDB
mongod

# Démarrer les deux serveurs (backend + frontend)
npm run dev
```

### Production

```bash
# Build du frontend
npm run build

# Démarrer le serveur
npm start
```

## 📁 Structure du Projet

```
vitalCHECK_Enterprise_Health_Check/
├── server/                 # Backend Node.js
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── utils/             # Utilitaires (PDF, Email)
│   ├── data/              # Données des questions
│   └── index.js           # Point d'entrée
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   ├── context/       # Gestion d'état
│   │   ├── services/      # Services API
│   │   └── App.jsx        # Application principale
│   └── public/            # Assets statiques
├── package.json           # Scripts principaux
└── README.md
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Backend + Frontend
npm run server       # Backend uniquement
npm run client       # Frontend uniquement

# Production
npm run build        # Build frontend
npm start           # Démarrer serveur

# Installation
npm run install-all # Installer toutes les dépendances
```

## 📧 Configuration Email

Pour l'envoi automatique des rapports :

1. **Gmail** : Utiliser un mot de passe d'application
2. **Autres fournisseurs** : Configurer SMTP dans `.env`

## 🌍 Support Multilingue

L'application supporte plusieurs langues avec i18next (gratuit) :

### Langues Supportées

- 🇺🇸 **Anglais** (en) - Langue par défaut
- 🇫🇷 **Français** (fr) - Questions traduites

### Configuration i18next

1. **Installation des dépendances** :

   ```bash
   cd client && npm install react-i18next i18next i18next-browser-languagedetector
   ```

2. **Fichiers de traduction** :
   - Interface : `client/src/i18n/locales/`
   - Questions : `server/data/questions-{lang}.js`

3. **Ajout de nouvelles langues** :
   - Créer un fichier `questions-{lang}.js` dans `server/data/`
   - Ajouter la langue dans `server/routes/assessments.js`
   - Créer le fichier de traduction dans `client/src/i18n/locales/`

### Utilisation

- **Sélection de langue** : L'utilisateur choisit sa langue au début du questionnaire
- **Questions traduites** : Les questions sont traduites selon la langue sélectionnée
- **Interface multilingue** : L'interface utilisateur s'adapte à la langue sélectionnée
- **Rapports traduits** : Les rapports PDF sont générés dans la langue choisie
- **100% Gratuit** : Aucun coût d'API externe

## 🎨 Personnalisation

### Couleurs (Tailwind)

- **Primary** : Orange (#f97316)
- **Secondary** : Bleu (#0ea5e9)
- **Success** : Vert (#10b981)
- **Warning** : Ambre (#f59e0b)
- **Danger** : Rouge (#ef4444)

### Questions

Modifier `server/data/questions.js` pour :

- Ajouter/modifier des questions
- Ajuster les recommandations
- Personnaliser les piliers

## 🚀 Déploiement

### Heroku

```bash
# Backend
heroku create vitalCHECK-health-check-api
heroku addons:create mongolab:sandbox
heroku config:set NODE_ENV=production

# Frontend
heroku create vitalCHECK-health-check-web
```

### Serveur de Production

- Déploiement sur serveur dédié
- Configuration des variables d'environnement
- Domaine de production : <https://www.checkmyenterprise.com>

## 📈 Métriques et Analytics

- **Taux de completion** : Suivi des évaluations terminées
- **Scores moyens** : Analyse des tendances
- **Piliers faibles** : Identification des domaines problématiques

## 🔒 Sécurité

- **Helmet** : Headers de sécurité
- **CORS** : Configuration des origines
- **Rate Limiting** : Protection contre les abus
- **Validation** : Sanitisation des données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Créer une issue sur GitHub
- Contacter l'équipe vitalCHECK

---

**vitalCHECK Enterprise Health Check** - Évaluez la santé de votre entreprise en 10 minutes ! 🚀
