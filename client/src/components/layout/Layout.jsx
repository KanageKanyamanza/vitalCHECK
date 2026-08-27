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
  const isClientPage = location?.pathname?.startsWith('/client') || false
  const isShellPage = isAdminPage || isClientPage

  // Vérifier si on est sur la page d'accueil
  const isHomePage = location?.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isShellPage && <Navbar />}

      <main className="flex-1">
        {children}
      </main>

      {!isShellPage && !isHomePage && <Footer />}
      {!isShellPage && <ChatWidget />}
      {!isShellPage && <BackToTop showAfter={0} />}
      {!isShellPage && <PromoPopup />}
    </div>
  )
}

export default Layout

