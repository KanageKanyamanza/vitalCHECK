# 🔍 SEO & Optimisation pour les Moteurs de Recherche

vitalCHECK intègre des mécanismes avancés pour assurer une bonne visibilité sur les moteurs de recherche.

## 🧠 Fonctionnalités Clés

- **Sitemap Dynamique** : Génération automatique du fichier `sitemap.xml` incluant les pages statiques et les articles de blog.
- **Fichier `robots.txt`** : Directives claires pour les robots d'indexation (Google, Bing, etc.) et blocage des bots malveillants.
- **Meta Tags Dynamiques** : Gestion des titres, descriptions et mots-clés par page.
- **Données Structurées** : Intégration de JSON-LD pour aider les moteurs à comprendre le contenu.

---

## ⚙️ Implémentation Backend

Le backend sert les fichiers nécessaires aux moteurs de recherche.

### Fichiers Principaux

- `server/routes/sitemap.js` : Gère les requêtes vers `/sitemap.xml` et `/robots.txt`.

### Routes API

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/sitemap.xml` | Sert le sitemap statique ou le génère dynamiquement en interrogeant la base de données (blogs). |
| `GET` | `/robots.txt` | Sert les règles d'accès pour les robots. |

### Logique du Sitemap Dynamique

Si le fichier statique n'existe pas :

1. Le serveur liste les pages principales (`/`, `/assessment`, `/blog`, etc.).
2. Il récupère tous les articles de blog publiés et génère leurs URLs.
3. Il construit un flux XML valide respectant le protocole sitemap.

---

## 🎨 Implémentation Frontend

Le frontend gère l'affichage des balises dans le `<head>` de la page.

### Fichiers Principaux

- `client/src/components/seo/SEOHead.jsx` : Composant inséré dans les pages pour injecter les balises meta.
- `client/src/utils/seoData.js` : Fonctions retournant les données structurées (JSON-LD) adaptées à chaque page.

### Exemple d'Utilisation

Sur la page d'évaluation :

```jsx
<SEOHead
  title="Évaluation de Santé d'Entreprise - vitalCHECK"
  description="Commencez votre évaluation gratuite..."
  structuredData={getAssessmentPageStructuredData()}
/>
```

Le composant utilise `react-helmet` (ou équivalent) pour modifier le titre de l'onglet et les balises OpenGraph pour le partage sur les réseaux sociaux.
