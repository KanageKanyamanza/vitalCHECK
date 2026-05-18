# 📋 Système d'Évaluation (Assessment)

Le système d'évaluation est le cœur de l'application vitalCHECK. Il permet aux utilisateurs de répondre à un questionnaire pour évaluer la santé de leur entreprise.

## 🧠 Fonctionnalités Clés

- **Questionnaire Dynamique** : Les questions sont chargées en fonction du secteur d'activité de l'entreprise et de la langue choisie.
- **Gestion de Brouillon (Draft)** : Sauvegarde automatique de la progression pour permettre à l'utilisateur de reprendre plus tard.
- **Calcul des Scores** : Calcul automatique des scores par pilier et d'un score global à la soumission.
- **Génération de Recommandations** : Recommandations personnalisées basées sur les réponses.
- **Limites Mensuelles** : Limitation du nombre d'évaluations selon le plan de l'utilisateur.

---

## ⚙️ Implémentation Backend

Le backend gère la logique de calcul, la persistance des données et l'envoi de notifications.

### Fichiers Principaux

- `server/routes/assessments.js` : Routes API pour les évaluations.
- `server/models/Assessment.js` : Modèle de données Mongoose.
- `server/utils/scoring.js` : Logique de calcul des scores.
- `server/data/questions.js` & `questions-fr.js` : Données des questions.

### Modèle de Données (`Assessment.js`)

L'évaluation stocke :

- L'ID de l'utilisateur.
- Les réponses (`questionId`, `answer`).
- Les scores par pilier (`pillarId`, `pillarName`, `score`, `status`, `recommendations`).
- Le score global (`overallScore`) et le statut global (`overallStatus`).
- Le statut (`draft` ou `completed`).
- Un token de reprise (`resumeToken`) pour les brouillons.

### Routes API (`/api/assessments`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/languages` | Récupère les langues supportées. |
| `POST` | `/draft` | Crée ou récupère un brouillon d'évaluation. |
| `GET` | `/resume/:token` | Récupère une évaluation via son token de reprise. |
| `GET` | `/questions` | Récupère les questions (filtres: `lang`, `sector`). |
| `PUT` | `/progress/:assessmentId` | Sauvegarde la progression (réponses + index actuel). |
| `POST` | `/submit` | Soumet l'évaluation finale, calcule les scores et génère les notifications. |
| `GET` | `/user/:userId` | Récupère toutes les évaluations d'un utilisateur. |
| `GET` | `/:assessmentId` | Récupère les détails d'une évaluation spécifique. |

### Logique Particulière

- **Sélection des Questions** : La fonction `getQuestionsForSector` associe le secteur de l'utilisateur à un jeu de questions spécifique. Si non trouvé, elle utilise le secteur `other`.
- **Calcul des Scores** : Effectué dans `utils/scoring.js`. Il prend les réponses et les compare aux questions pour calculer un score sur 100 par pilier et globalement.
- **Soumission** : Lors de la soumission, l'évaluation passe de `draft` à `completed`. Un compte utilisateur est automatiquement créé si l'utilisateur n'en avait pas (`hasAccount: false`).

---

## 🎨 Implémentation Frontend

Le frontend guide l'utilisateur à travers le questionnaire avec une interface fluide et animée.

### Fichiers Principaux

- `client/src/pages/AssessmentPage.jsx` : Page principale de l'évaluation.
- `client/src/context/AssessmentContext.jsx` : Gestion de l'état global de l'évaluation.
- `client/src/components/assessment/` : Composants spécifiques (`ProgressBar`, `QuestionCard`, `SubmissionProgress`).

### Gestion de l'État (`AssessmentContext`)

L'état de l'évaluation est partagé via le contexte React :

- `questions` : Liste des questions chargées.
- `answers` : Réponses actuelles.
- `currentQuestionIndex` : Index de la question affichée.
- `assessmentId` : ID du brouillon en cours.

### Flux de l'Utilisateur

1. **Initialisation** : Au chargement de `AssessmentPage`, l'application vérifie si l'utilisateur est connecté, charge les questions via l'API et crée/récupère un brouillon (`/draft`).
2. **Réponse aux Questions** : L'utilisateur répond aux questions une par une. À chaque réponse ou changement de question, la progression est sauvegardée en arrière-plan (`/progress/:assessmentId`).
3. **Soumission** : À la dernière question, un clic sur "Terminer" déclenche `handleSubmit`. Un modal de progression (`SubmissionProgress`) s'affiche pour simuler les étapes (validation, calcul, génération).
4. **Redirection** : Une fois la soumission réussie, l'utilisateur est redirigé vers la page de résultats (`/results`).

### Composants Utilisés

- `ProgressBar` : Affiche la progression sous forme de barre et de pourcentage.
- `QuestionCard` : Affiche la question actuelle et les options de réponse (radio buttons ou sliders).
- `LimitReachedModal` : S'affiche si l'utilisateur a atteint sa limite mensuelle d'évaluations.
