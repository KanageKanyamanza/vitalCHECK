# Configuration PayPal pour VitalCheck

## Étapes pour configurer PayPal

### 1. Créer un compte développeur PayPal

1. Visitez [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Créez un compte ou connectez-vous
3. Créez une application pour obtenir votre Client ID

### 2. Obtenir votre Client ID

1. Allez dans **Dashboard** > **My Apps & Credentials**
2. Dans l'onglet **Sandbox**, cliquez sur **Create App**
3. Donnez un nom à votre application (ex: "VitalCheck Payments")
4. Copiez le **Client ID** généré

### 3. Configurer les variables d'environnement

1. Créez un fichier `.env` dans le dossier `client/` (s'il n'existe pas déjà)
2. Ajoutez la variable suivante :

```env
VITE_PAYPAL_CLIENT_ID=votre_client_id_ici
```

**Important** : 
- Pour le mode **Sandbox** (test) : Utilisez le Client ID de Sandbox
- Pour le mode **Production** : Utilisez le Client ID de Production

### 4. Tester les paiements

#### Mode Sandbox (Test)

1. Créez un compte acheteur de test dans le PayPal Developer Dashboard
2. Utilisez ces identifiants pour tester les paiements
3. Les paiements ne seront pas réels

#### Mode Production

1. Remplacez le Client ID Sandbox par le Client ID Production
2. Les paiements seront réels
3. Assurez-vous que votre compte PayPal est vérifié

### 5. Prix des plans

Les prix sont configurés dans `client/src/config/paypal.js` :

- **Standard** : $18/mois (10,000 FCFA)
- **Premium** : $45/mois (25,000 FCFA)
- **Diagnostic Service** : $1,000 (550,000 FCFA)

Vous pouvez modifier ces prix dans le fichier de configuration.

### 6. Gestion des paiements réussis

Quand un paiement est réussi :
1. L'utilisateur est redirigé vers `/contact?plan={planId}&payment=success&orderId={orderId}`
2. Les détails du paiement sont loggés dans la console
3. Vous pouvez ajouter une intégration backend pour enregistrer les paiements dans votre base de données

## Dépannage

### Le bouton PayPal ne s'affiche pas
- Vérifiez que `VITE_PAYPAL_CLIENT_ID` est bien configuré
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que vous avez redémarré le serveur de développement après avoir ajouté la variable d'environnement

### Erreur de script PayPal
- Vérifiez votre connexion Internet
- Vérifiez que le Client ID est valide
- Essayez de vider le cache du navigateur

## Ressources

- [Documentation PayPal Checkout](https://developer.paypal.com/docs/checkout/)
- [PayPal React SDK](https://github.com/paypal/react-paypal-js)
- [Guide de test Sandbox](https://developer.paypal.com/docs/api-basics/sandbox/)

