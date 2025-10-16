# Components Organization

Ce dossier contient tous les composants React organisés par catégorie et fonctionnalité.

## Structure

### 📁 `navigation/`
Composants liés à la navigation et au routing
- `Navbar.jsx` - Barre de navigation principale
- `Footer.jsx` - Pied de page
- `BackButton.jsx` - Bouton retour avec flèche gauche
- `BackToTop.jsx` - Bouton retour en haut de page

### 📁 `layout/`
Composants de mise en page et structure
- `Hero.jsx` - Section héro de la page d'accueil
- `SplashScreen.jsx` - Écran de chargement animé

### 📁 `ui/`
Composants d'interface utilisateur réutilisables
- `ScoreGauge.jsx` - Jauge de score circulaire
- `PillarChart.jsx` - Graphique en barres des piliers
- `RecommendationsList.jsx` - Liste des recommandations
- `VitalCHECKLogo.jsx` - Logo VitalCHECK réutilisable
- `InstallPWAButton.jsx` - Bouton d'installation PWA
- `LanguageSelector.jsx` - Sélecteur de langue
- `NavbarLanguageSelector.jsx` - Sélecteur de langue pour navbar

### 📁 `assessment/`
Composants spécifiques à l'évaluation
- `AssessmentForm.jsx` - Formulaire d'évaluation principal
- `QuestionCard.jsx` - Carte de question individuelle
- `ProgressBar.jsx` - Barre de progression
- `SubmissionProgress.jsx` - Progression de soumission
- `ReportGenerationProgress.jsx` - Progression de génération de rapport
- `ReportSuccessModal.jsx` - Modal de succès de génération

### 📁 `test/`
Composants de test et développement
- `LogoTest.jsx` - Test des variations de logo
- `PingPongTest.jsx` - Test des routes ping-pong

## Utilisation

### Import par catégorie
```javascript
import { Navbar, BackToTop } from '../components/navigation';
import { Hero, SplashScreen } from '../components/layout';
import { ScoreGauge, VitalCHECKLogo } from '../components/ui';
import { AssessmentForm, QuestionCard } from '../components/assessment';
```

### Import depuis l'index principal
```javascript
import { Navbar, Hero, ScoreGauge, AssessmentForm } from '../components';
```

## Avantages de cette organisation

1. **Clarté** : Chaque composant est dans sa catégorie logique
2. **Maintenabilité** : Plus facile de trouver et modifier les composants
3. **Réutilisabilité** : Les composants UI sont clairement identifiés
4. **Évolutivité** : Facile d'ajouter de nouveaux composants dans la bonne catégorie
5. **Imports propres** : Imports organisés et cohérents
