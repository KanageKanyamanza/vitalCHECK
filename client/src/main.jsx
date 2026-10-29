import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'
import { registerSW, installPWA } from './utils/registerSW'
import { inject } from '@vercel/analytics'

// Mesure d'audience (pages vues, visiteurs) - suit aussi les changements de page de l'application
inject()

// Enregistrer le Service Worker
registerSW()

// Installer le PWA
installPWA()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
