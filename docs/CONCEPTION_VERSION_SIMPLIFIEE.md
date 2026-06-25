# Document de Conception — VitalCHECK Version Simplifiée (Niveau 1)

**Branche :** `feature/new_version`  
**Date :** 2026-06-09  
**Statut :** EN ATTENTE DE VALIDATION

---

## 1. Analyse du questionnaire actuel

### Structure actuelle (identique pour les 9 secteurs)

Chaque secteur (technology, commerce, services, manufacturing, agriculture, healthcare, education, finance, other) contient :

| Dimension | Valeur actuelle |
|-----------|----------------|
| Nombre de piliers | 9 |
| Questions par pilier | 2 |
| Total questions | **18** |
| Scores par option | 0 / 1 / 3 |
| Score max théorique par pilier | 75 (formule : moy × 25, max moy = 3) |
| Seuils de statut | 3 niveaux : rouge < 40 / orange 40–69 / vert ≥ 70 |
| Temps de complétion estimé | ~4–5 min |

**Piliers actuels (mêmes 9 piliers dans tous les secteurs) :**

| # | Pilier | Questions |
|---|--------|-----------|
| 1 | Finance | 2 |
| 2 | Opérations | 2 |
| 3 | Ventes | 2 |
| 4 | RH | 2 |
| 5 | Stratégie | 2 |
| 6 | Technologie | 2 |
| 7 | Risques | 2 |
| 8 | Branding | 2 |
| 9 | Export | 2 |

### Logique de scoring actuelle

```
Pilier : score = round((somme des réponses / nb questions) × 25)
Score global : moyenne des scores de piliers
```

Conséquence : **le score maximum réel est 75/100** (et non 100/100), car le score max d'une option est 3 → moyenne max = 3 → 3 × 25 = 75. Les seuils (vert ≥ 70, orange 40–69, rouge < 40) ont été calibrés sur cette échelle réelle, mais affichent une note sur 100 trompeuse.

---

## 2. Problèmes identifiés

### 2.1 Inadéquation avec les spécifications du Niveau 1

| Problème | Détail |
|---------|--------|
| **Mauvais nombre de piliers** | 9 piliers vs 5 requis |
| **Mauvais nombre de questions** | 18 questions vs 25 requises |
| **Scores mal calibrés** | Options 0/1/3 → score max réel = 75, affiché sur 100 |
| **Seuils incomplets** | 3 seuils (rouge/orange/vert) vs 5 requis |
| **Labels d'options hétérogènes** | Labels différents par question, pas d'unification Oui/Partiellement/Non |

### 2.2 Problèmes UX / Expérience utilisateur

| Problème | Détail |
|---------|--------|
| **Piliers hors scope PME** | Export et Technologie sont pertinents pour des entreprises matures, pas pour une PME en diagnostic initial |
| **Questions trop sectorielles** | Questions pour "tech" (SaaS, CI/CD, LTV/CAC) excluent les PME non-tech |
| **Options à 3 niveaux non uniformes** | Chaque question a ses propres formulations, ce qui ralentit la compréhension |
| **Pas de formulaire d'identité simplifié** | L'inscription demande email + secteur + taille + téléphone avant de commencer |

### 2.3 Problèmes techniques

| Problème | Détail |
|---------|--------|
| **Fragmentation des données** | 9 fichiers sectoriels différents à maintenir |
| **Score max trompeur** | Formule moy×25 génère un max de 75 affiché comme /100 |
| **questionsDataFR** | Alias vers le même index que EN → pas de vrai support bilingue des questions |

---

## 3. Simplifications proposées

### 3.1 Tableau avant / après — Structure du questionnaire

| Dimension | Avant | Après (Niveau 1) |
|-----------|-------|-----------------|
| Piliers | 9 | **5** |
| Questions par pilier | 2 | **5** |
| Total questions | 18 | **25** |
| Fichiers sectoriels | 9 variantes | **1 fichier universel** |
| Labels d'options | Variables | **Oui / Partiellement / Non** |
| Scores | 0 / 1 / 3 | **4 / 2 / 0** |
| Score max par pilier | 75 (moy×25) | **100** (somme/20×100) |
| Score global max | 75 | **100** |
| Seuils | 3 (rouge/orange/vert) | **5 paliers** |

### 3.2 Mapping des piliers — fusion / suppression

| Pilier actuel | Action | Pilier cible |
|---------------|--------|-------------|
| Stratégie | Enrichi → renommé | **1. Leadership & Stratégie** |
| Finance | Conservé + enrichi | **2. Finance** |
| Ventes + Branding | Fusionnés | **3. Ventes & Marketing** |
| Opérations + Technologie | Fusionnés | **4. Opérations** |
| RH | Renommé + enrichi | **5. Personnel & Organisation** |
| Risques | **Supprimé** (intégré dans Opérations) | — |
| Export | **Supprimé** (hors scope PME Niveau 1) | — |

### 3.3 Nouveau système de scoring (Niveau 1)

```
Réponses : Non = 0 | Partiellement = 2 | Oui = 4

Par pilier (5 questions) :
  score_pilier = round((somme / 20) × 100)   → 0–100

Score global :
  score_global = round(moyenne des 5 scores piliers) → 0–100
```

**5 paliers :**

| Score | Label | Couleur |
|-------|-------|---------|
| 0 – 39 | Critique | Rouge |
| 40 – 59 | Vulnérable | Orange |
| 60 – 79 | Stable | Jaune |
| 80 – 89 | Prêt pour la croissance | Bleu |
| 90 – 100 | Haute performance | Vert |

### 3.4 Questions proposées (25 universelles)

> Ces questions s'adressent à toutes les PME, secteur indépendant. Elles couvrent chacune un point de contrôle clé du diagnostic Niveau 1.

#### Pilier 1 — Leadership & Stratégie (5Q)

| # | Question | Oui | Partiellement | Non |
|---|----------|-----|--------------|-----|
| 1 | Avez-vous des objectifs d'entreprise écrits à 1 an et à 3 ans ? | Objectifs chiffrés et datés | Objectifs généraux non formalisés | Aucun objectif défini |
| 2 | Évaluez-vous régulièrement les performances de votre entreprise face à ces objectifs ? | Revue mensuelle ou trimestrielle | Revue annuelle irrégulière | Jamais évalué |
| 3 | Disposez-vous d'un budget prévisionnel pour l'exercice en cours ? | Budget détaillé et suivi | Budget approximatif | Aucun budget |
| 4 | Suivez-vous au moins 3 indicateurs clés (KPI) de votre activité ? | KPI suivis et affichés régulièrement | KPI définis mais peu suivis | Aucun KPI |
| 5 | Avez-vous un plan de croissance ou de développement pour les 12 prochains mois ? | Plan documenté avec actions | Idées informelles | Aucun plan |

#### Pilier 2 — Finance (5Q)

| # | Question | Oui | Partiellement | Non |
|---|----------|-----|--------------|-----|
| 1 | Votre entreprise est-elle rentable et savez-vous quelle est votre marge nette ? | Rentable, marge connue | Rentable mais marge floue | Non rentable ou inconnue |
| 2 | Gérez-vous votre trésorerie avec un suivi mensuel des entrées et sorties ? | Tableau de trésorerie mensuel | Suivi irrégulier | Pas de suivi |
| 3 | Séparez-vous strictement les finances de l'entreprise et vos finances personnelles ? | Séparation totale, comptes distincts | Séparation partielle | Mélange fréquent |
| 4 | Disposez-vous d'états financiers (bilan, compte de résultat) à jour ? | Documents à jour, consultés régulièrement | Établis mais rarement consultés | Inexistants ou très anciens |
| 5 | Pouvez-vous faire face à 3 mois de charges fixes sans revenus (réserve de trésorerie) ? | Oui, réserve constituée | Partiellement (1–2 mois) | Non |

#### Pilier 3 — Ventes & Marketing (5Q)

| # | Question | Oui | Partiellement | Non |
|---|----------|-----|--------------|-----|
| 1 | Savez-vous combien vous coûte l'acquisition d'un nouveau client (CAC) ? | CAC calculé et optimisé | Estimation approximative | Inconnu |
| 2 | Avez-vous un processus pour convertir vos prospects en clients (pipeline de vente) ? | Processus défini et documenté | Processus informel | Aucun processus |
| 3 | Mesurez-vous votre taux de fidélisation client ou de recommande ? | Taux mesuré et objectif défini | Suivi ponctuel | Jamais mesuré |
| 4 | Avez-vous une présence en ligne active (site web + au moins un réseau social) ? | Présence active et mise à jour | Présence minimale ou dépassée | Absente |
| 5 | Disposez-vous d'objectifs de vente chiffrés pour l'année ? | Objectifs définis par période | Objectif annuel global | Aucun objectif |

#### Pilier 4 — Opérations (5Q)

| # | Question | Oui | Partiellement | Non |
|---|----------|-----|--------------|-----|
| 1 | Vos processus opérationnels clés sont-ils documentés (procédures, checklists) ? | Procédures écrites et accessibles | Quelques documents épars | Tout est dans la tête |
| 2 | Mesurez-vous régulièrement les retards ou erreurs dans votre production / service ? | Tableau de bord qualité actif | Suivi informel | Non mesuré |
| 3 | Les responsabilités sont-elles clairement définies pour chaque activité critique ? | Organigramme et rôles définis | Rôles partiellement définis | Confusion des responsabilités |
| 4 | Utilisez-vous des outils numériques pour gagner du temps (automatisation, cloud) ? | Outils intégrés et utilisés | Quelques outils isolés | Outils papier/manuels |
| 5 | Avez-vous mesuré la productivité de votre équipe / de votre activité ce trimestre ? | Productivité mesurée et objectivée | Impression générale | Non évaluée |

#### Pilier 5 — Personnel & Organisation (5Q)

| # | Question | Oui | Partiellement | Non |
|---|----------|-----|--------------|-----|
| 1 | Chaque collaborateur a-t-il des objectifs individuels clairs et écrits ? | Objectifs écrits et évalués | Objectifs communiqués oralement | Aucun objectif individuel |
| 2 | Réalisez-vous des entretiens d'évaluation réguliers avec votre équipe ? | Entretiens formels planifiés | Discussions informelles | Jamais |
| 3 | Votre taux de turnover est-il maîtrisé (< 15% par an) ? | Oui, fidélisation active | Taux moyen mais non suivi | Turnover élevé |
| 4 | Investissez-vous dans la formation et le développement des compétences ? | Budget formation dédié | Formation ponctuelle | Pas de formation |
| 5 | Avez-vous identifié un successeur ou un second pour les postes clés ? | Succession planifiée | Réflexion en cours | Aucun plan |

---

## 4. Nouveau parcours utilisateur

```
┌─────────────────────────────────────────────────────────────┐
│  PARCOURS UTILISATEUR — VitalCHECK Niveau 1 (Simplifié)    │
└─────────────────────────────────────────────────────────────┘

[Étape 0] Page d'accueil
   └─ CTA : "Diagnostiquer mon entreprise gratuitement" (≤ 10s)

[Étape 1] Formulaire d'entrée simplifié (1 écran, 3 champs)
   ├─ Nom de l'entreprise
   ├─ Email professionnel
   └─ Taille de l'entreprise (micro / PME / ETI)
   Note : secteur supprimé (questions universelles)
   Durée : ~30 sec

[Étape 2] Questionnaire — Navigation par catégorie
   ├─ Barre de progression globale (% + pilier courant)
   ├─ 5 piliers affichés en en-tête (indicateur de complétion)
   ├─ 1 question à la fois, 3 boutons : Oui | Partiellement | Non
   ├─ Réponse = passage automatique à la question suivante
   ├─ Navigation retour possible (question précédente)
   ├─ Sauvegarde automatique toutes les 3 questions
   └─ Durée estimée : ~5 min (25Q × 12s/question)

[Étape 3] Écran de transition (instantané, ≤ 3s)
   └─ Animation "Calcul de votre score" (UX, pas de délai réel)

[Étape 4] Page Résultats (mini-rapport 2 pages)
   ├─ PAGE 1 : Tableau de bord
   │   ├─ Score global (gauge visuelle, 0–100)
   │   ├─ Palier atteint (badge coloré + libellé)
   │   ├─ Radar/barres des 5 scores de piliers
   │   └─ Synthèse : 1 phrase personnalisée
   │
   └─ PAGE 2 : Actions recommandées
       ├─ Top 3 risques identifiés (rouge/orange)
       ├─ Top 2 opportunités (piliers les mieux notés)
       └─ 3 prochaines étapes concrètes
           └─ CTA : "Obtenir le rapport complet (Premium)"

[Optionnel] Téléchargement PDF 2 pages + email
```

---

## 5. Fonctionnalités conservées / modifiées / supprimées

### ✅ Conservées (sans changement)

| Fonctionnalité | Localisation |
|----------------|-------------|
| Authentification JWT client | `server/routes/clientAuth.js` |
| Modèle Assessment MongoDB | `server/models/Assessment.js` |
| Génération PDF | `server/utils/pdfGenerator.js` + `client/utils/pdfGeneratorClient.js` |
| Envoi email post-résultats | `server/utils/emailService.js` |
| Dashboard client (historique) | `client/pages/client/` |
| Interface admin | `client/pages/admin/` |
| Reprise d'évaluation (resumeToken) | `server/routes/assessments.js` |
| Limites par plan | `server/config/planLimits.js` |

### ✏️ Modifiées

| Fonctionnalité | Modification |
|----------------|-------------|
| **Fichiers de questions** | Remplacés par 1 fichier universel `questions-v2.js` (25Q, 5 piliers) |
| **Logique de scoring** | Mise à jour : scores 0/2/4, formule somme/20×100, 5 paliers |
| **AssessmentForm.jsx** | Suppression du champ "secteur" ; formulaire simplifié |
| **QuestionCard.jsx** | Boutons Oui/Partiellement/Non uniformes (remplace les labels variables) |
| **ResultsPage.jsx** | Affichage des 5 paliers + mini-rapport 2 pages |
| **ProgressBar.jsx** | Ajout indicateur de pilier courant en plus du % global |
| **scoring.js** | Nouvelle formule + 5 seuils |

### ❌ Supprimées / Désactivées pour Niveau 1

| Fonctionnalité | Raison |
|----------------|--------|
| Questions sectorielles (9 variantes) | Remplacées par questions universelles |
| Piliers Export, Risques, Branding, Technologie | Hors scope Niveau 1 ; Export et Risques en Niveau 2 |
| Sélecteur de secteur dans le formulaire | Inutile avec questions universelles |
| Statuts rouge/orange/vert (3 niveaux) | Remplacés par 5 paliers |

> **Note :** les fichiers sectoriels ne seront pas supprimés ; ils seront conservés et branché sur le moteur Niveau 2 (futur). La version simplifiée utilisera un nouveau point d'entrée (`/questions/v2`).

---

## 6. Impact sur le scoring et l'affichage des résultats

### Changement de formule

| | Avant | Après |
|--|-------|-------|
| Options | 0 / 1 / 3 | 0 / 2 / 4 |
| Calcul pilier | `(somme / nb_q) × 25` | `(somme / (nb_q × 4)) × 100` |
| Score pilier max | 75 | 100 |
| Score global | Moyenne des piliers (max 75) | Moyenne des piliers (max 100) |

### Nouveaux paliers (remplacement des 3 statuts)

| Avant | Score | Après | Couleur |
|-------|-------|-------|---------|
| Rouge (critical) | 0–39 | Critique | 🔴 Rouge |
| Orange (needs improvement) | 40–59 | Vulnérable | 🟠 Orange |
| — | 60–79 | Stable | 🟡 Jaune |
| Vert (healthy) | 40–100 était "amber" ou "green" | Prêt pour la croissance | 🔵 Bleu |
| — | 90–100 | Haute performance | 🟢 Vert |

### Compatibilité base de données

Les données existantes en base (assessments déjà complétés) utilisent l'ancien scoring. **Aucune migration de données n'est requise** : la version simplifiée génère de **nouveaux** assessments avec un champ `version: 'v2'` pour les distinguer. L'affichage du dashboard client adaptera l'UI selon ce champ.

---

## 7. Bénéfices attendus

| Bénéfice | Avant | Après |
|---------|-------|-------|
| Temps de complétion | ~4–5 min (18Q sectorielles) | **~5–6 min (25Q universelles)** |
| Friction à l'entrée | Formulaire 5 champs dont secteur | **3 champs** |
| Couverture diagnostique | 9 piliers, 2Q par pilier = superficiel | **5 piliers, 5Q = profondeur réelle** |
| Lisibilité du score | Score max réel = 75, affiché /100 = trompeur | **Score 0–100 exact** |
| Richesse des insights | 3 seuils | **5 paliers + top 3 risques + top 2 opportunités** |
| Maintenabilité | 9 fichiers de questions (× 2 langues = 18) | **1 fichier universel** |
| Taux de complétion | Inconnu, questions parfois inadaptées | Meilleur (questions universelles, UX simplifiée) |
| Conversion Niveau 1 → 2 | CTA générique | **CTA personnalisé sur les piliers faibles** |

---

## Points d'ambiguïté — Questions pour validation

1. **Langue :** Les 25 questions proposées sont en français. Faut-il prévoir simultanément la version anglaise, ou la v2 sera d'abord FR uniquement ?

2. **Secteur supprimé :** Le formulaire actuel collecte le secteur pour adapter les questions. Avec des questions universelles, le secteur ne sert plus à la sélection des questions. Doit-il rester collecté (pour les analytics/admin) ou être supprimé complètement ?

3. **Rétrocompatibilité dashboard :** Les résultats existants (ancien scoring) seront toujours visibles dans le dashboard client. Un badge « Ancienne version » suffira-t-il, ou faut-il une migration ?

4. **Email post-résultats :** L'email actuel envoie le PDF complet + mot de passe temporaire. Pour la v2 (Niveau 1 gratuit), faut-il envoyer : (a) PDF 2 pages directement, (b) lien vers la page résultats, ou (c) les deux ?

5. **Enregistrement obligatoire :** Actuellement l'évaluation crée un compte automatiquement (email requis). Pour maximiser les conversions, souhaitez-vous tester une version **sans compte obligatoire** (email facultatif, résultats affichés directement) ?

---

*Document soumis à validation avant toute implémentation.*
