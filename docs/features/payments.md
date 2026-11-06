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

---

## 📱 Mobile Money (AfribaPay)

Activé par `PAYMENT_PROVIDER=afribapay` côté serveur (sinon PayPal, comportement inchangé). Le front lit `GET /api/payments/config` pour savoir quoi afficher.

### Règles

- Le montant vient de `server/config/plans.js` (Standard 10 000 FCFA, Premium 25 000 FCFA). Le navigateur n'envoie que l'offre, l'opérateur, le numéro et le code Orange.
- Activation uniquement sur `SUCCESS` confirmé côté serveur : webhook signé (`Afribapay-Sign`, HMAC-SHA256 hex du corps brut, clé secrète) et/ou `GET /v1/status`, avec montant initial (`original_amount`), devise et pays identiques à la commande.
- Passage `pending → completed` atomique : un webhook reçu plusieurs fois n'active et ne prolonge qu'une fois. `orderId` et `transactionId` sont uniques.
- `PENDING` n'active, n'annule et ne rembourse jamais. Une tâche (`utils/afribapayReconciler.js`, toutes les 2 min) revérifie les commandes en attente pendant 7 jours.
- Désaccord (montant, devise, statuts finaux contradictoires) : `conflict: true`, examen manuel.
- Période payée de 30 jours ; même offre encore active = prolongation, autre offre = nouvelle période dès le paiement. Le Diagnostic reste sur « Nous contacter ».

### Routes

| Méthode | Route | Protection |
| :--- | :--- | :--- |
| `GET` | `/api/payments/config` | publique |
| `POST` | `/api/payments/afribapay/initiate` | client connecté, 10 / 15 min |
| `POST` | `/api/payments/afribapay/webhook` | signature uniquement (corps brut) |
| `GET` | `/api/payments/afribapay/orders/:orderId` | propriétaire de la commande |

### Rappels

`RENEWAL_REMINDERS_ENABLED=true` active le rappel J-3 et l'expiration réelle à l'échéance (e-mail dans la langue du dernier diagnostic).

### Tests

`cd server && npm run test:afribapay` (AfribaPay simulé, MongoDB en mémoire).
