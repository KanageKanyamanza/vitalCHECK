import React from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar, BackToTop } from '../navigation'
import { ChatWidget } from '../chat'
import { Footer } from './index'
import PromoPopup from '../ui/PromoPopup'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Pages avec leur propre layout (navbar/footer gérés par le composant)
  const isAdminPage = location?.pathname?.startsWith('/admin') || false
  // L'inscription (/client/register) est une page publique : elle garde la navbar et le pied de page
  const isClientPage = (location?.pathname?.startsWith('/client') && location.pathname !== '/client/register') || false
  // Parcours du diagnostic : mode « focus », la page gère son propre en-tête
  // (pas de navbar, de pied de page ni de boutons flottants pendant les questions)
  const isFocusPage = location?.pathname === '/diagnostic'
  const isShellPage = isAdminPage || isClientPage || isFocusPage

  // Vérifier si on est sur la page d'accueil
  const isHomePage = location?.pathname === '/'
  // Outils F1 (pertes cachées) et F2 (signaux d'alerte) : formulaire plein écran, sans pied de page
  // ni bulle de l'assistant (elle recouvrirait les champs sur téléphone)
  const isCalculatorPage = ['/diagnostic/pertes-cachees', '/diagnostic/signaux-alerte'].includes(location?.pathname)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isShellPage && <Navbar />}

      {/* L'en-tête est fixe : décaler le contenu de sa hauteur */}
      <main className={`flex-1 ${isShellPage ? '' : 'pt-ubb-header'}`}>
        {children}
      </main>

      {!isShellPage && !isHomePage && !isCalculatorPage && <Footer />}
      {!isShellPage && !isCalculatorPage && <ChatWidget />}
      {!isShellPage && <BackToTop showAfter={0} />}
      {!isShellPage && <PromoPopup />}
    </div>
  )
}

export default Layout

