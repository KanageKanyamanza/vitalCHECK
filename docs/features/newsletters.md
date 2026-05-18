# ✉️ Gestion des Newsletters

vitalCHECK dispose d'un système complet de gestion de newsletters pour garder le contact avec les abonnés et les clients.

## 🧠 Fonctionnalités Clés

- **Abonnement/Désabonnement** : Inscription simple avec validation d'email et lien de désabonnement sécurisé.
- **Segmentation** : Envoi ciblé par tags, à tous les actifs, ou à une liste personnalisée d'emails.
- **Programmation** : Possibilité de planifier l'envoi d'une newsletter à une date et heure précises.
- **File d'Attente (Queue)** : Utilisation d'un service de file d'attente pour gérer les envois massifs sans bloquer le serveur.
- **Templates Unifiés** : Génération de rendus HTML professionnels et responsive.

---

## ⚙️ Implémentation Backend

Le backend gère la base des abonnés, la création des campagnes et l'exécution des envois.

### Fichiers Principaux

- `server/routes/newsletters.js` : Toutes les routes publiques et admin.
- `server/models/Newsletter.js` : Modèle d'une campagne (sujet, contenu, stats).
- `server/models/NewsletterSubscriber.js` : Modèle des abonnés.
- `server/utils/emailQueueService.js` : Gestion de la file d'attente d'envoi.

### Routes API Publiques (`/api/newsletters`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/subscribe` | Ajoute un email à la liste des abonnés (ou réactive). |
| `POST` | `/unsubscribe/:token` | Désactive un abonnement via le token unique reçu par email. |

### Routes API Admin (`/api/newsletters/admin`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/list` | Liste toutes les campagnes (draft, sent, scheduled). |
| `GET` | `/subscribers` | Liste et filtre les abonnés (recherche, période). |
| `POST` | `/create` | Crée une nouvelle campagne (brouillon ou programmée). |
| `POST` | `/:id/send` | Déclenche l'envoi immédiat d'une newsletter via la queue. |
| `POST` | `/send-scheduled`| Script/Route pour envoyer les campagnes dont l'heure est arrivée. |

### Logique d'Envoi Massif

Pour éviter les timeouts et les blocages :

1. L'admin clique sur "Envoyer".
2. Le serveur récupère la liste des destinataires selon les critères choisis.
3. Chaque email à envoyer est transformé en "job" et ajouté à `emailQueueService`.
4. Le statut de la newsletter passe à `sending` puis `sent` une fois la mise en file d'attente terminée.

---

## 🎨 Implémentation Frontend

Le frontend offre une interface complète pour les administrateurs et un widget pour le public.

### Fichiers Principaux

- `client/src/pages/admin/NewsletterManagement.jsx` : Dashboard pour créer, éditer et suivre l'envoi des newsletters.
- Formulaire d'inscription généralement situé dans le footer ou des popups d'engagement.

### Flux Admin

1. L'admin compose son message dans un éditeur riche.
2. Il sélectionne l'audience (ex: "Tous les abonnés" ou des emails spécifiques séparés par des virgules).
3. Il peut prévisualiser le rendu final (envoi d'un mail de test ou rendu HTML à l'écran).
4. Il choisit d'envoyer immédiatement ou de programmer.
