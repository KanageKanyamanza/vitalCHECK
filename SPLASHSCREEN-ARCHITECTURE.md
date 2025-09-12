# 🏗️ Architecture du Splash Screen UBB

## 📊 Diagramme de Fonctionnement

```
┌─────────────────────────────────────────────────────────────┐
│                    SPLASH SCREEN                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   LOGO UBB      │    │     GRAPHIQUES TOMBANTS         │ │
│  │   (Centre)      │    │  ┌─────┐ ┌─────┐ ┌─────┐       │ │
│  │                 │    │  │ 📊  │ │ 📈  │ │ 💼  │       │ │
│  │  ┌───────────┐  │    │  └─────┘ └─────┘ └─────┘       │ │
│  │  │ PROGRESS  │  │    │  ┌─────┐ ┌─────┐ ┌─────┐       │ │
│  │  │   BAR     │  │    │  │ 🏢  │ │ 👥  │ │ ⚡  │       │ │
│  │  └───────────┘  │    │  └─────┘ └─────┘ └─────┘       │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              MONTAGNE D'ACCUMULATION                    │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │ │
│  │  │ 📊  │ │ 📈  │ │ 💼  │ │ 🏢  │ │ 👥  │ │ ⚡  │     │ │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

```
1. DÉMARRAGE
   ↓
2. SPLASH SCREEN AFFICHÉ
   ↓
3. ANIMATIONS DÉMARRÉES
   ├── Graphiques tombants
   ├── Barre de progression
   └── Particules flottantes
   ↓
4. PING-PONG BACKEND
   ├── GET /api/ping (vérification santé)
   ├── POST /api/pong (test bidirectionnel)
   └── GET /api/loading-test (simulation chargement)
   ↓
5. CHARGEMENT PROGRESSIF
   ├── 0-30%: Initialisation
   ├── 30-60%: Connexion serveur
   ├── 60-90%: Préparation interface
   └── 90-100%: Finalisation
   ↓
6. FERMETURE SPLASH SCREEN
   ↓
7. APPLICATION PRINCIPALE
```

## 🎯 Composants Principaux

### Frontend (React)

```
SplashScreen.jsx
├── État local
│   ├── loading: boolean
│   ├── loadingProgress: number
│   ├── fallingElements: array
│   └── backendReady: boolean
├── Animations
│   ├── Logo UBB (Framer Motion)
│   ├── Graphiques tombants (rotation + chute)
│   ├── Barre de progression (width animation)
│   └── Particules flottantes (opacity + position)
└── Logique
    ├── createFallingElement()
    ├── animateFallingElements()
    └── simulateLoading()
```

### Backend (Node.js)

```
routes/ping.js
├── GET /api/ping
│   ├── Vérification santé serveur
│   ├── Calcul temps de réponse
│   └── Retour métriques système
├── POST /api/pong
│   ├── Réception message ping
│   ├── Validation données
│   └── Retour confirmation
└── GET /api/loading-test
    ├── Simulation délai configurable
    ├── Test charge serveur
    └── Retour statistiques
```

## 🎨 Système d'Animations

### Graphiques Tombants

```javascript
// Configuration des éléments
const chartElements = [
  { icon: BarChart3, color: '#3B82F6', size: 'w-8 h-8', delay: 0 },
  { icon: PieChart, color: '#10B981', size: 'w-6 h-6', delay: 0.5 },
  // ... 8 autres éléments
]

// Animation de chute
y: element.y + 3 + Math.random() * 2  // Vitesse variable
rotation: element.rotation + 2        // Rotation continue
scale: [0.5, 1.2, 0.9]               // Pulsation
```

### Barre de Progression

```javascript
// Étapes de chargement
const steps = [
  { name: 'Initialisation...', progress: 10 },
  { name: 'Connexion au serveur...', progress: 25 },
  { name: 'Chargement des questions...', progress: 40 },
  { name: 'Préparation de l\'interface...', progress: 60 },
  { name: 'Vérification des services...', progress: 80 },
  { name: 'Finalisation...', progress: 100 }
]
```

## 🔧 Configuration Technique

### Variables d'Environnement

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ubb-health-check
```

### Dépendances

```json
// Frontend
{
  "framer-motion": "^10.16.16",
  "lucide-react": "^0.294.0",
  "react": "^18.2.0"
}

// Backend
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

## 📱 Interface de Test

### Route /ping-test

```
┌─────────────────────────────────────────┐
│  🧪 Test Ping-Pong Backend             │
├─────────────────────────────────────────┤
│  [Ping Now] [Clear]                    │
├─────────────────────────────────────────┤
│  📊 Statistiques                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │ 15  │ │ 12  │ │ 45ms│ │ 32ms│     │
│  │Total│ │Succès│ │Moyen│ │Dernier│   │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
├─────────────────────────────────────────┤
│  📋 Recent Pings                       │
│  ✅ Success - 14:30:25 • 32ms         │
│  ✅ Success - 14:30:20 • 28ms         │
│  ❌ Failed - 14:30:15 • 0ms           │
└─────────────────────────────────────────┘
```

## ⚡ Optimisations

### Performance

- **Limite d'éléments** : Maximum 20 graphiques simultanés
- **Nettoyage automatique** : Suppression des éléments hors écran
- **Délais optimisés** : Équilibre fluidité/performance
- **Memoization** : Éviter les re-renders inutiles

### Mémoire

- **Garbage collection** : Suppression des éléments anciens
- **Pool d'objets** : Réutilisation des éléments graphiques
- **Lazy loading** : Chargement à la demande

## 🐛 Debugging

### Logs Frontend

```javascript
console.log('Splash screen started')
console.log('Backend ping result:', data)
console.log('Loading progress:', progress)
```

### Logs Backend

```javascript
console.log('Ping received:', req.body)
console.log('Response time:', responseTime)
console.log('Server health:', healthCheck)
```

## 🚀 Déploiement

### Production

1. **Build frontend** : `npm run build`
2. **Déployer backend** : Render.com
3. **Déployer frontend** : Vercel
4. **Configurer variables** : URLs de production

### Monitoring

- **Temps de réponse** : < 100ms
- **Taux de succès** : > 95%
- **Mémoire utilisée** : < 100MB
- **CPU usage** : < 10%

---

**Architecture Splash Screen UBB** - Design moderne et performant ! 🎨
