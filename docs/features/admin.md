# 🛡️ Panel d'Administration

Le panel d'administration est l'interface dédiée aux gestionnaires de vitalCHECK pour piloter l'activité, gérer les contenus et suivre les performances.

## 🧠 Fonctionnalités Clés

- **Gestion des Utilisateurs** : Visualisation, recherche et modification des comptes clients.
- **Gestion du Blog** : Création, édition, traduction et publication d'articles.
- **Gestion des Newsletters** : Création de campagnes, programmation et suivi des abonnés.
- **Suivi des Évaluations** : Consultation des résultats des diagnostics passés par les entreprises.
- **Suivi des Paiements** : Liste des transactions et export CSV.
- **Modération du Chatbot** : Revue des questions non comprises et ajout de réponses personnalisées.

---

## ⚙️ Implémentation Backend

L'administration repose sur des routes hautement sécurisées accessibles uniquement aux utilisateurs ayant le rôle `admin`.

### Fichiers Principaux

- `server/routes/admin.js` : Centralise la majorité des opérations d'administration.
- `server/models/Admin.js` : Modèle de données pour les administrateurs.

### Sécurisation

Toutes les routes admin sont protégées par le middleware `authenticateAdmin` qui :

1. Vérifie la présence et la validité du token JWT.
2. S'assure que le rôle décodé est bien `admin`.
3. Vérifie que le compte admin est toujours actif en base de données.

---

## 🎨 Implémentation Frontend

L'interface admin est séparée de l'interface client et utilise un layout spécifique.

### Fichiers Principaux

- `client/src/pages/admin/AdminApp.jsx` : Router spécifique pour l'espace admin.
- `client/src/components/admin/` : Composants spécifiques (Layout, Header, Sidebar).

### Pages Disponibles

- `AdminDashboard.jsx` : Vue d'ensemble avec KPIs (nombre d'utilisateurs, revenus, taux de complétion des tests).
- `UserManagement.jsx` : Tableau listant les clients avec options de filtrage.
- `BlogManagement.jsx` : Interface pour rédiger des articles avec éditeur riche.
- `NewsletterManagement.jsx` : Outil de création et d'envoi de campagnes.
