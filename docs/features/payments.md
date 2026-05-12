# 💳 Système de Paiements

vitalCHECK intègre un système de paiement via PayPal pour permettre aux utilisateurs d'accéder aux rapports détaillés et aux fonctionnalités premium.

## 🧠 Fonctionnalités Clés

- **Intégration PayPal** : Paiement sécurisé via le SDK PayPal.
- **Auto-provisioning** : Création automatique du compte utilisateur ou mise à niveau de l'abonnement dès la validation du paiement.
- **Facturation par Email** : Envoi automatique d'emails de confirmation avec identifiants (si nouveau compte).
- **Gestion Admin** : Suivi des transactions, modification des statuts et export CSV.

---

## ⚙️ Implémentation Backend

Le backend reçoit les confirmations de paiement du frontend et met à jour les droits des utilisateurs.

### Fichiers Principaux

- `server/routes/payments.js` : Gestion des transactions.
- `server/models/Payment.js` : Modèle de stockage des transactions.
- `server/utils/emailService.js` : Envoi des emails post-paiement.

### Routes API

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/record` | Enregistre une transaction réussie (publique). |
| `GET` | `/payments` | Récupère tous les paiements (Admin). |
| `PATCH` | `/payments/:id/status` | Met à jour le statut d'un paiement (Admin). |
| `GET` | `/payments/export`| Exporte les paiements au format CSV (Admin). |

### Logique Post-Paiement (`/record`)

Lorsqu'un paiement est enregistré :

1. Le système vérifie si la transaction n'a pas déjà été traitée (via `orderId`).
2. Il cherche l'utilisateur par son email.
3. **Cas 1 : Nouvel utilisateur** -> Création d'un compte avec mot de passe temporaire et abonnement actif.
4. **Cas 2 : Utilisateur existant sans compte actif** -> Activation du compte et génération de mot de passe.
5. **Cas 3 : Utilisateur existant** -> Mise à niveau du plan d'abonnement.
6. Envoi de l'email approprié (Création de compte ou Upgrade).
7. Création d'une notification haute priorité pour les administrateurs.

---

## 🎨 Implémentation Frontend

Le frontend utilise le SDK officiel PayPal pour React.

### Fichiers Principaux

- `client/src/pages/CheckoutPage.jsx` : Page de sélection du plan et de paiement.
- `client/src/config/paypal.js` : Configuration du SDK (Client ID).

### Flux de Paiement

1. L'utilisateur choisit un plan sur la page de tarification.
2. Il est redirigé vers la page de Checkout où s'affichent les boutons PayPal.
3. Une fois le paiement validé par PayPal, le callback `onApprove` du frontend appelle l'API `/api/payments/record` pour finaliser l'opération en base de données.
4. L'utilisateur est ensuite redirigé vers une page de succès ou directement vers ses résultats enrichis.
