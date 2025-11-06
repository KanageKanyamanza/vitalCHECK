# Flux de Paiement vitalCHECK

## Architecture du système de paiement

Le système de paiement vitalCHECK utilise une page de checkout dédiée qui centralise toutes les options de paiement.

## Parcours utilisateur

### 1. Page des Tarifs (`/pricing`)
- L'utilisateur consulte les différents plans : GRATUIT, STANDARD, PREMIUM, et SERVICE DIAGNOSTIC
- Pour le plan GRATUIT : Clic sur "Commencer gratuitement" → Redirection vers `/assessment`
- Pour les autres plans : Clic sur "Sélectionner" → Redirection vers `/checkout?plan={planId}`

### 2. Page de Checkout (`/checkout`)

La page de checkout affiche :

#### Colonne gauche - Résumé de la commande
- Nom du plan sélectionné
- Prix en USD et FCFA
- Type de période (mensuel/annuel/unique)
- Option annuelle avec économie (si applicable)

#### Colonne droite - Méthodes de paiement

L'utilisateur peut choisir entre deux options :

**Option 1 : PayPal**
- Paiement instantané par PayPal ou carte bancaire
- Intégration officielle du bouton PayPal
- Sécurisé et automatisé
- Redirection vers `/payment-success` après paiement réussi

**Option 2 : Virement bancaire / Contact**
- Pour les clients préférant un paiement traditionnel
- Redirection vers `/contact?plan={planId}`
- L'équipe vitalCHECK contactera le client pour finaliser

### 3. Page de Succès (`/payment-success`)

Après un paiement PayPal réussi :
- Confirmation visuelle avec icône de succès
- Détails de la commande (ID, plan, statut)
- Prochaines étapes :
  - Email de confirmation
  - Informations d'accès
  - Contact de l'équipe sous 24h
- Boutons : "Retour à l'accueil" et "Contacter le Support"

## Configuration technique

### Fichiers clés

1. **`/pages/CheckoutPage.jsx`** - Page de checkout principale
2. **`/pages/PaymentSuccessPage.jsx`** - Page de confirmation
3. **`/components/payment/PayPalButton.jsx`** - Composant bouton PayPal
4. **`/config/paypal.js`** - Configuration PayPal et prix

### Variables d'environnement

Créez un fichier `.env` dans le dossier `client/` :

```env
VITE_PAYPAL_CLIENT_ID=votre_client_id_paypal
```

**Important** : 
- Mode Sandbox (test) : Utilisez le Client ID Sandbox de PayPal
- Mode Production : Utilisez le Client ID Production

### Prix configurés

```javascript
STANDARD:
  - Mensuel: $18 USD (10,000 FCFA)
  - Annuel: $180 USD (100,000 FCFA)

PREMIUM:
  - Mensuel: $45 USD (25,000 FCFA)
  - Annuel: $450 USD (250,000 FCFA)

DIAGNOSTIC:
  - Unique: $1,000 USD (550,000 FCFA)
```

## Gestion des paiements

### Paiement PayPal réussi

Quand un paiement est complété :
1. L'ordre PayPal est capturé
2. Les détails sont loggés dans la console
3. L'utilisateur est redirigé vers `/payment-success?orderId={id}&plan={planId}`

**TODO Backend** : Ajoutez un appel API dans la fonction `handlePaymentSuccess` de `CheckoutPage.jsx` pour enregistrer le paiement dans votre base de données.

```javascript
const handlePaymentSuccess = async (order) => {
  // TODO: Appel API pour enregistrer le paiement
  // await api.post('/payments/record', {
  //   orderId: order.id,
  //   planId: planId,
  //   amount: order.purchase_units[0].amount.value,
  //   currency: order.purchase_units[0].amount.currency_code,
  //   status: order.status
  // })
  
  navigate(`/payment-success?orderId=${order.id}&plan=${planId}`)
}
```

### Paiement par contact

Quand l'utilisateur choisit "Virement bancaire / Contact" :
1. Redirection vers `/contact?plan={planId}`
2. Le formulaire de contact est pré-rempli avec le plan sélectionné
3. L'équipe vitalCHECK reçoit la demande et contacte le client

## Tests

### Test en mode Sandbox

1. Configurez `VITE_PAYPAL_CLIENT_ID` avec votre Client ID Sandbox
2. Créez un compte acheteur test dans PayPal Developer Dashboard
3. Testez le flux complet :
   - Sélection d'un plan
   - Page checkout
   - Paiement PayPal avec compte test
   - Vérification de la page de succès

### Test en production

⚠️ **Important** : Avant de passer en production :
1. Remplacez le Client ID Sandbox par le Client ID Production
2. Testez avec de petits montants réels
3. Vérifiez que les webhooks PayPal sont configurés (si utilisés)
4. Assurez-vous que l'intégration backend enregistre les paiements

## Support

Pour toute question :
- Email : info@checkmyenterprise.com
- Documentation PayPal : https://developer.paypal.com/docs/checkout/

