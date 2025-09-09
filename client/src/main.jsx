import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'
import { registerSW, installPWA } from './utils/registerSW'

// Enregistrer le Service Worker
registerSW()

// Installer le PWA
installPWA()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
