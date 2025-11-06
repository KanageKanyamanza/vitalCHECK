# Guide de Configuration du Système d'Administration vitalCHECK

## Vue d'ensemble

Le système d'administration vitalCHECK permet aux administrateurs de gérer les utilisateurs, consulter les évaluations et envoyer des emails de relance.

## Configuration du Serveur

### 1. Modèle Admin

Le modèle `Admin` a été créé dans `server/models/Admin.js` avec les fonctionnalités suivantes :

- Authentification sécurisée avec bcrypt
- Gestion des rôles (super-admin, admin, moderator)
- Système de permissions granulaire
- Horodatage des connexions

### 2. Routes d'Administration

Les routes admin sont disponibles dans `server/routes/admin.js` :

- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/stats` - Statistiques générales
- `GET /api/admin/users` - Liste des utilisateurs avec pagination
- `GET /api/admin/users/:userId` - Détails d'un utilisateur
- `DELETE /api/admin/users/:userId` - Supprimer un utilisateur
- `GET /api/admin/assessments` - Liste des évaluations
- `GET /api/admin/assessments/:assessmentId` - Détails d'une évaluation
- `DELETE /api/admin/assessments/:assessmentId` - Supprimer une évaluation
- `POST /api/admin/users/:userId/remind` - Envoyer un email de relance
- `POST /api/admin/users/remind-bulk` - Envoyer des emails en masse
- `GET /api/admin/export/users` - Exporter les données utilisateurs

### 3. Création du Premier Admin

Un script a été créé pour créer le premier administrateur :

```bash
cd server
node scripts/create-admin.js
```

**Identifiants par défaut :**

- Email: <admin@vitalCHECK.com>
- Mot de passe: admin123

⚠️ **IMPORTANT** : Changez le mot de passe en production !

## Interface Client

### 1. Pages d'Administration

Toutes les pages admin sont dans `client/src/pages/admin/` :

- **AdminLogin.jsx** - Page de connexion
- **AdminDashboard.jsx** - Tableau de bord principal
- **UserManagement.jsx** - Gestion des utilisateurs
- **AssessmentManagement.jsx** - Gestion des évaluations
- **EmailManagement.jsx** - Envoi d'emails de relance
- **UserDetail.jsx** - Détails d'un utilisateur
- **AssessmentDetail.jsx** - Détails d'une évaluation
- **AdminApp.jsx** - Routeur principal admin

### 2. Accès à l'Interface

L'interface admin est accessible via : `http://localhost:5173/admin`

### 3. Fonctionnalités Principales

#### Tableau de Bord

- Statistiques générales (utilisateurs, évaluations, etc.)
- Graphiques de répartition par secteur et taille
- Actions rapides

#### Gestion des Utilisateurs

- Liste paginée avec filtres (recherche, secteur, taille)
- Détails complets de chaque utilisateur
- Historique des évaluations
- Suppression d'utilisateurs
- Sélection multiple pour actions en masse

#### Gestion des Évaluations

- Liste paginée avec filtres (statut, dates)
- Détails complets de chaque évaluation
- Scores par pilier avec visualisations
- Réponses détaillées
- Suppression d'évaluations

#### Système d'Emails

- Modèles prédéfinis pour différents types de relance
- Envoi individuel ou en masse
- Interface intuitive pour composer les messages
- Support des variables (ex: [LIEN])

## Sécurité

### 1. Authentification

- JWT tokens avec expiration (24h)
- Vérification des permissions par route
- Middleware d'authentification sur toutes les routes admin

### 2. Permissions

Le système de permissions permet de contrôler l'accès aux fonctionnalités :

- `viewUsers` - Voir les utilisateurs
- `manageUsers` - Gérer les utilisateurs
- `viewAssessments` - Voir les évaluations
- `manageAssessments` - Gérer les évaluations
- `sendEmails` - Envoyer des emails
- `viewReports` - Voir les rapports
- `manageAdmins` - Gérer les administrateurs

### 3. Validation

- Validation des données d'entrée avec express-validator
- Sanitisation des emails et mots de passe
- Protection contre les injections

## Utilisation

### 1. Connexion

1. Accédez à `http://localhost:5173/admin`
2. Utilisez les identifiants créés par le script
3. Vous serez redirigé vers le tableau de bord

### 2. Gestion des Utilisateurs

1. Cliquez sur "Gérer les Utilisateurs"
2. Utilisez les filtres pour rechercher des utilisateurs
3. Sélectionnez un ou plusieurs utilisateurs
4. Utilisez les actions disponibles (email, suppression, etc.)

### 3. Envoi d'Emails

1. Sélectionnez des utilisateurs depuis la liste
2. Cliquez sur "Email" ou "Envoyer un email"
3. Choisissez un modèle prédéfini ou composez votre message
4. Envoyez individuellement ou en masse

### 4. Export des Données

1. Depuis le tableau de bord, cliquez sur "Exporter les Données"
2. Un fichier CSV sera téléchargé avec toutes les données utilisateurs

## Maintenance

### 1. Création d'Admins Supplémentaires

Pour créer de nouveaux administrateurs, vous pouvez :

- Utiliser l'interface MongoDB directement
- Créer un script personnalisé
- Ajouter une interface de gestion des admins (à développer)

### 2. Sauvegarde

- Sauvegardez régulièrement la base de données
- Exportez les données via l'interface admin
- Conservez les logs d'activité

### 3. Monitoring

- Surveillez les logs du serveur
- Vérifiez les statistiques d'utilisation
- Contrôlez les envois d'emails

## Développement

### 1. Ajout de Nouvelles Fonctionnalités

- Ajoutez les routes dans `server/routes/admin.js`
- Créez les composants React correspondants
- Mettez à jour le système de permissions si nécessaire

### 2. Personnalisation

- Modifiez les modèles prédéfinis d'emails
- Ajustez les permissions selon vos besoins
- Personnalisez l'interface selon votre charte graphique

## Support

Pour toute question ou problème :

1. Vérifiez les logs du serveur
2. Consultez la documentation des API
3. Contactez l'équipe de développement

---

**Note** : Ce système d'administration est conçu pour être sécurisé et facile à utiliser. Assurez-vous de suivre les bonnes pratiques de sécurité lors du déploiement en production.
