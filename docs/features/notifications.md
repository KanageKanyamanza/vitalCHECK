# 🔔 Système de Notifications

vitalCHECK utilise les notifications push du navigateur (Web Push API) pour informer les utilisateurs en temps réel.

## 🧠 Fonctionnalités Clés

- **Abonnement Push** : Demande d'autorisation et enregistrement de l'appareil de l'utilisateur.
- **Notifications Ciblées** : Envoi de messages spécifiques à un utilisateur (ex: "Votre rapport est prêt").
- **Notifications Admin** : Alertes pour les administrateurs lors d'événements clés (nouveaux paiements, nouvelles évaluations).
- **Service Worker** : Gestion de la réception des notifications même quand l'application est fermée.

---

## ⚙️ Implémentation Backend

Le backend utilise la librairie `web-push` pour communiquer avec les serveurs de push des navigateurs.

### Fichiers Principaux

- `server/routes/notifications.js` : Routes pour s'abonner.
- `server/models/PushSubscription.js` : Stockage des endpoints de push par utilisateur.
- `server/utils/pushService.js` : Fonctions pour envoyer les notifications.

### Routes API (`/api/notifications`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/subscribe` | Enregistre les clés d'abonnement push générées par le navigateur. |
| `POST` | `/test` | Envoie une notification de test à l'utilisateur. |

### Logique d'Envoi

La fonction `sendPushNotification(userId, payload)` :

1. Recherche tous les abonnements actifs pour l'utilisateur donné dans `PushSubscription`.
2. Pour chaque abonnement, elle tente d'envoyer le payload chiffré.
3. Si un endpoint retourne une erreur 410 (Gone) ou 404, l'abonnement est automatiquement supprimé de la base car il n'est plus valide.

---

## 🎨 Implémentation Frontend

Le frontend utilise les APIs natives du navigateur et un Service Worker.

### Fichiers Principaux

- `client/public/sw.js` : Le Service Worker qui écoute l'événement `push` et affiche la notification.
- `client/src/hooks/usePushNotifications.js` : Hook personnalisé pour gérer la demande d'autorisation et l'inscription.

### Flux d'Abonnement

1. L'application demande l'autorisation à l'utilisateur d'envoyer des notifications (via le hook).
2. Si acceptée, le navigateur génère un objet `subscription` contenant un endpoint unique et des clés de chiffrement.
3. Le frontend envoie cet objet au serveur via `/api/notifications/subscribe`.
