# 🔐 Authentification & Gestion des Comptes

vitalCHECK utilise un système d'authentification robuste avec des rôles distincts pour les clients et les administrateurs, ainsi qu'un mécanisme de connexion unifié.

## 🧠 Fonctionnalités Clés

- **Connexion Unifiée** : Un seul formulaire de connexion qui détecte automatiquement si l'utilisateur est un admin ou un client.
- **Inscription Client** : Création de compte avec collecte d'informations sur l'entreprise.
- **Auto-création de Compte** : Les clients qui passent l'évaluation sans compte se voient attribuer un compte automatiquement.
- **Réinitialisation de Mot de Passe** : Système sécurisé par email avec token d'expiration (1h).
- **Gestion de Profil** : Mise à jour des informations et changement de mot de passe.

---

## ⚙️ Implémentation Backend

L'authentification repose sur des tokens JWT (JSON Web Tokens) et le hashage des mots de passe avec bcryptjs.

### Fichiers Principaux

- `server/routes/unifiedAuth.js` : Route de connexion intelligente.
- `server/routes/clientAuth.js` : Gestion des comptes clients (inscription, profil, etc.).
- `server/models/User.js` : Modèle pour les clients.
- `server/models/Admin.js` : Modèle pour les administrateurs.

### Routes API

#### Connexion Unifiée (`/api/unified-auth`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/login` | Tente de connecter en tant qu'admin, puis client. Retourne un token JWT et le rôle. |
| `GET` | `/me` | Récupère les infos de l'utilisateur courant à partir du token. |

#### Authentification Client (`/api/client-auth`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Crée un compte client ou complète un compte existant (issu d'une évaluation). |
| `POST` | `/login` | Connexion spécifique pour les clients. |
| `GET` | `/me` | Profil complet du client connecté (protégé). |
| `PUT` | `/profile` | Mise à jour des informations de l'entreprise (protégé). |
| `PUT` | `/change-password`| Changement de mot de passe (protégé). |
| `POST` | `/forgot-password`| Demande de réinitialisation de mot de passe (envoi d'email). |
| `POST` | `/reset-password/:token`| Réinitialisation effective avec le token reçu. |

### Logique Particulière

- **Vérification Double** : Dans `unifiedAuth.js`, le serveur cherche d'abord dans la collection `Admins`. Si trouvé et mot de passe valide, il connecte comme admin. Sinon, il cherche dans `Users`.
- **Lien avec l'Évaluation** : Si un utilisateur fait une évaluation puis s'inscrit avec le même email, la route `register` fusionne les données au lieu de créer un doublon.

---

## 🎨 Implémentation Frontend

Le frontend utilise le Context API pour maintenir l'état d'authentification à travers l'application.

### Fichiers Principaux

- `client/src/context/ClientAuthContext.jsx` : Fournit l'état de l'utilisateur connecté (`user`, `token`, `isAuthenticated`).
- `client/src/pages/client/ClientRegisterPage.jsx` : Formulaire d'inscription.
- Pages de profil et dashboard client.

### Flux d'Authentification

1. L'utilisateur saisit ses identifiants.
2. L'application appelle `/api/unified-auth/login`.
3. En cas de succès, le token est stocké dans le `localStorage` et l'état global est mis à jour.
4. L'utilisateur est redirigé vers son dashboard (client ou admin selon le rôle retourné).
