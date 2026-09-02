# Gestion Multi-Équipe (Teams)

## Vue d'Ensemble

La fonctionnalité **Multi-Équipe** permet à un CEO ou responsable (compte Premium) de constituer une équipe au sein de vitalCHECK. Les membres invités peuvent accéder à un espace collaboratif où les diagnostics de l'entreprise sont partagés et centralisés.

---

## Avantages

- **Vision centralisée** : Le dirigeant dispose d'un tableau de bord unique regroupant tous les diagnostics réalisés sous son entreprise.
- **Collaboration simplifiée** : Les collaborateurs rejoignent l'équipe via une simple invitation par email, sans avoir à chercher l'entreprise manuellement.
- **Sécurité des données** : Chaque équipe ne voit que les diagnostics de sa propre entreprise. Les données des autres clients sont strictement isolées.
- **Gestion des rôles** : Le propriétaire de l'équipe (owner) peut inviter jusqu'à 5 membres. Chaque membre a un rôle défini (owner ou member).
- **Suivi en temps réel** : Les diagnostics complétés apparaissent automatiquement dans la vue équipe, permettant de suivre l'évolution de la santé d'entreprise dans le temps.

---

## Fonctionnement

### 1. Création de l'équipe

L'équipe est créée automatiquement lors de la première connexion d'un compte Premium sur la page **Mon Équipe** (`/client/team`). Aucune action manuelle n'est nécessaire.

### 2. Invitation d'un membre

1. Aller sur la page **Mon Équipe**
2. Cliquer sur **"Inviter un membre"**
3. Saisir l'adresse email du collaborateur
4. Cliquer sur **"Envoyer l'invitation"**

Un email d'invitation est envoyé au collaborateur contenant un lien unique et sécurisé valable 7 jours.

> **Important :** Si le collaborateur ne trouve pas l'email dans sa boîte de réception, il doit vérifier son dossier **Spam / Courrier indésirable**. Les emails d'invitation peuvent parfois être classés automatiquement dans le spam par les filtres des messageries (Gmail, Outlook, etc.).

### 3. Acceptation de l'invitation

Le collaborateur clique sur le lien reçu par email. Il est redirigé vers une page dédiée où il peut :

- **Se connecter** s'il possède déjà un compte vitalCHECK
- **Créer un compte** s'il n'en a pas encore

Une fois authentifié, il rejoint automatiquement l'équipe et est redirigé vers la page **Mon Équipe**.

### 4. Consultation des diagnostics partagés

Sur la page **Mon Équipe**, les membres peuvent consulter :

- La liste des membres de l'équipe et leur rôle
- L'historique de tous les diagnostics complétés par l'entreprise
- Les scores et résultats pour chaque diagnostic

---

## Limites et Règles

| Règle | Valeur |
|---|---|
| Membres maximum par équipe | 5 |
| Durée de validité d'une invitation | 7 jours |
| Une invitation utilisée | Non réutilisable |
| Accès aux données d'autres équipes | Interdit (isolation stricte) |

---

## Résolution de Problèmes

### L'email d'invitation n'est pas reçu

1. Vérifier le dossier **Spam / Courrier indésirable**
2. S'assurer que l'adresse email saisie est correcte
3. Si le problème persiste, renvoyer une invitation depuis la page Mon Équipe

### Le lien d'invitation affiche "Invitation invalide"

Cela peut arriver si :
- Le lien a expiré (plus de 7 jours)
- L'invitation a déjà été utilisée
- Le lien a été copié de manière incomplète depuis l'email

Dans ces cas, le propriétaire de l'équipe doit envoyer une nouvelle invitation.

### La connexion échoue après avoir cliqué sur le lien

S'assurer que les identifiants (email + mot de passe) correspondent bien à un compte vitalCHECK existant. En cas d'oubli du mot de passe, utiliser la fonction "Mot de passe oublié" depuis la page de connexion principale.

---

## Architecture Technique

### Backend

- **Modèle** : `server/models/Team.js` — Entité Team avec `owner`, `members[]`, `subscription`, `maxMembers`
- **Routes** : `server/routes/teams.js`
  - `GET /api/teams/me` — Récupère ou crée l'équipe du compte connecté
  - `GET /api/teams/diagnostics` — Retourne les diagnostics filtrés par entreprise (isolation sécurisée)
  - `POST /api/teams/invite` — Envoie une invitation par email
  - `GET /api/teams/invite/:token` — Vérifie la validité d'une invitation
  - `POST /api/teams/join/:token` — Rejoint une équipe via un token d'invitation
- **Email** : `server/utils/emailService.js` — Fonction `sendTeamInviteEmail` avec fallback 2 niveaux (IONOS → service externe)

### Frontend

- **Page équipe** : `client/src/pages/client/ClientTeamPage.jsx`
- **Page d'acceptation** : `client/src/pages/JoinTeamPage.jsx`
- **Contexte auth** : `client/src/context/ClientAuthContext.jsx`

### Sécurité

Les diagnostics sont filtrés côté serveur par `companyName` + `completedAt`. Un membre ne peut jamais accéder aux données d'une autre entreprise, même en manipulant les requêtes API. La protection est appliquée au niveau du middleware serveur, pas uniquement côté affichage.
