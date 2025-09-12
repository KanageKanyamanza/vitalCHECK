# 🎨 Splash Screen UBB Enterprise Health Check

## 📋 Vue d'ensemble

Le splash screen est un écran de chargement animé qui s'affiche au démarrage de l'application. Il présente le logo UBB au centre avec des graphiques d'entreprise qui tombent en arrière-plan et s'accumulent pour former une montagne.

## ✨ Fonctionnalités

### 🎯 Animations Principales
- **Logo UBB** : Affiché au centre avec animation d'apparition
- **Graphiques tombants** : 10 types d'icônes d'entreprise qui tombent
- **Montagne d'accumulation** : Les graphiques s'empilent en bas d'écran
- **Barre de progression** : Indique l'avancement du chargement
- **Particules flottantes** : Effet de profondeur en arrière-plan

### 🔄 Système Ping-Pong
- **Route `/api/ping`** : Vérification de la santé du serveur
- **Route `/api/pong`** : Réponse aux pings
- **Route `/api/loading-test`** : Test de chargement avec délai
- **Ping automatique** : Vérification périodique du backend

## 🛠️ Installation et Configuration

### 1. Backend (Routes Ping-Pong)

Les routes sont déjà configurées dans `server/routes/ping.js` :

```javascript
// Route ping
GET /api/ping

// Route pong  
POST /api/pong

// Test de chargement
GET /api/loading-test?delay=1000
```

### 2. Frontend (Composant SplashScreen)

Le composant est intégré dans `App.jsx` :

```jsx
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  
  return (
    <div>
      {showSplash && (
        <SplashScreen onLoadingComplete={() => setShowSplash(false)} />
      )}
      {/* Reste de l'application */}
    </div>
  )
}
```

## 🎨 Personnalisation

### Modifier les Graphiques

Dans `SplashScreen.jsx`, modifiez le tableau `chartElements` :

```javascript
const chartElements = [
  { icon: BarChart3, color: '#3B82F6', size: 'w-8 h-8', delay: 0 },
  { icon: PieChart, color: '#10B981', size: 'w-6 h-6', delay: 0.5 },
  // Ajoutez vos icônes ici
]
```

### Modifier les Couleurs

Changez les couleurs dans les classes Tailwind :

```javascript
// Couleurs des graphiques
color: '#3B82F6'  // Bleu
color: '#10B981'  // Vert
color: '#F59E0B'  // Ambre

// Couleurs du logo
from-orange-500 to-blue-600

// Couleurs de la barre de progression
from-orange-500 to-blue-600
```

### Modifier la Durée de Chargement

Dans `SplashScreen.jsx`, ajustez les délais :

```javascript
// Délai entre les étapes de chargement
await new Promise(resolve => setTimeout(resolve, 100))

// Délai entre les pings
await new Promise(resolve => setTimeout(resolve, 500))
```

## 🧪 Tests

### Test Automatique

Utilisez le script de test :

```bash
# Installer node-fetch si nécessaire
npm install node-fetch

# Lancer les tests
node test-splashscreen.js
```

### Test Manuel

1. **Démarrer le backend** :
   ```bash
   cd server
   npm run dev
   ```

2. **Démarrer le frontend** :
   ```bash
   cd client
   npm run dev
   ```

3. **Tester les routes** :
   - `http://localhost:5000/api/ping`
   - `http://localhost:5173/ping-test` (interface de test)

## 📱 Interface de Test

Accédez à `/ping-test` pour voir l'interface de test en temps réel :

- **Ping automatique** : Toutes les 5 secondes
- **Statistiques** : Total, succès, temps de réponse
- **Historique** : 10 derniers pings
- **Contrôles** : Ping manuel, effacer les résultats

## 🔧 Configuration Avancée

### Variables d'Environnement

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api

# Backend (.env)
NODE_ENV=development
PORT=5000
```

### Personnalisation des Animations

Modifiez les paramètres d'animation dans `SplashScreen.jsx` :

```javascript
// Vitesse de chute des graphiques
y: element.y + 3 + Math.random() * 2

// Rotation des graphiques
rotation: element.rotation + 2

// Délai entre les nouveaux graphiques
setInterval(() => { /* ... */ }, 800)
```

## 🐛 Résolution de Problèmes

### Le Splash Screen ne se ferme pas

1. Vérifiez que le backend est démarré
2. Vérifiez l'URL de l'API dans `.env`
3. Consultez la console pour les erreurs

### Les Graphiques ne tombent pas

1. Vérifiez que Framer Motion est installé
2. Vérifiez les imports des icônes Lucide
3. Vérifiez la configuration Tailwind

### Erreurs de Ping-Pong

1. Vérifiez que les routes sont bien enregistrées
2. Vérifiez la configuration CORS
3. Vérifiez les logs du serveur

## 📊 Performance

### Optimisations

- **Limite d'éléments** : Maximum 20 graphiques simultanés
- **Nettoyage automatique** : Suppression des éléments hors écran
- **Délais optimisés** : Équilibre entre fluidité et performance

### Métriques

- **Temps de chargement** : ~5-10 secondes
- **Mémoire** : ~50MB pour les animations
- **CPU** : Faible impact grâce aux optimisations

## 🎯 Utilisation en Production

### Recommandations

1. **Désactiver en développement** : Ajouter une condition
2. **Optimiser les images** : Utiliser des formats WebP
3. **Précharger les ressources** : Charger les icônes en avance
4. **Monitoring** : Surveiller les temps de réponse

### Code de Production

```javascript
// Désactiver le splash screen en développement
const [showSplash, setShowSplash] = useState(
  process.env.NODE_ENV === 'production'
)
```

## 📝 Changelog

### v1.0.0
- ✅ Splash screen avec animations de graphiques
- ✅ Système ping-pong backend/frontend
- ✅ Interface de test en temps réel
- ✅ Documentation complète

---

**Splash Screen UBB** - Une expérience de chargement immersive ! 🚀
