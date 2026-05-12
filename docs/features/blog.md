# memo Blog & Actualités

Le module Blog permet de publier des articles, de suivre l'audience et d'interagir avec les lecteurs via un système de likes.

## 🧠 Fonctionnalités Clés

- **Support Multilingue** : Les articles peuvent être rédigés en français et en anglais avec détection automatique de la langue.
- **Tracking Avancé** : Enregistrement détaillé des visites (IP, géolocalisation, type d'appareil, origine du trafic/référent, paramètres UTM).
- **Système de Likes** : Permet aux utilisateurs (connectés ou anonymes via `visitorId`) d'aimer un article.
- **Traduction Automatique** : Intégration d'APIs tierces (MyMemory, LibreTranslate) pour aider les admins à traduire les articles.

---

## ⚙️ Implémentation Backend

Le backend gère le stockage des articles, l'analyse du trafic et la gestion des interactions.

### Fichiers Principaux

- `server/routes/blogs.js` : Routes pour le public et l'administration.
- `server/models/Blog.js` : Modèle de l'article (titres et contenus bilingues).
- `server/models/BlogVisit.js` : Modèle pour l'enregistrement des visites.
- `server/models/BlogLike.js` : Modèle pour les likes.

### Routes API Publiques (`/api/blogs`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Récupère la liste des blogs publiés (avec pagination et filtres). |
| `GET` | `/:slug` | Récupère un article par son slug et enregistre la visite. |
| `GET` | `/:id/like/status` | Vérifie si le visiteur actuel a déjà aimé l'article. |
| `POST` | `/:id/like` | Ajoute ou retire un like (Toggle). |

### Routes API Admin (protégées)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/translate` | Traduit un texte d'une langue à une autre. |
| `GET` | `/admin/blogs` | Récupère tous les articles (y compris brouillons). |

### Logique Particulière

- **Géolocalisation** : Lors d'une visite, l'IP est analysée via `ipapi.co` ou `ip-api.com` pour déterminer le pays et la ville du lecteur.
- **Persistance des Likes** : Pour les utilisateurs non connectés, le like est attaché à un `visitorId` généré côté client et stocké dans le navigateur. Si l'utilisateur se connecte plus tard, ses likes anonymes sont migrés vers son compte.

---

## 🎨 Implémentation Frontend

Le frontend affiche les articles et gère les interactions utilisateur de manière dynamique.

### Fichiers Principaux

- `client/src/pages/BlogPage.jsx` : Liste des articles avec recherche et filtres par catégorie.
- `client/src/pages/BlogDetailPage.jsx` : Affichage complet de l'article, gestion des likes et du partage.

### Flux de Consultation

1. L'utilisateur arrive sur la liste des blogs. L'application détecte la langue courante (via `i18n`) et demande les articles correspondants au serveur.
2. Au clic sur un article, l'application utilise le slug localisé pour charger le détail.
3. Pendant la lecture, un composant de tracking envoie des données d'interaction (temps passé, scroll) pour enrichir les stats côté serveur.
