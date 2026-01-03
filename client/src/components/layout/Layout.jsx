import React from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar, BackToTop } from '../navigation'
import { ChatWidget } from '../chat'
import { Footer } from './index'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Vérifier si on est sur une page admin
  const isAdminPage = location?.pathname?.startsWith('/admin') || false
  
  // Vérifier si on est sur la page d'accueil
  const isHomePage = location?.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar seulement si ce n'est pas une page admin */}
      {!isAdminPage && <Navbar />}
      
      {/* Contenu principal */}
      <main className={`flex-1 ${!isAdminPage ? '' : ''}`}>
        {children}
      </main>
      
      {/* Footer seulement si ce n'est pas une page admin et pas la page d'accueil */}
      {!isAdminPage && !isHomePage && <Footer />}
      
      {/* Chatbot - accessible sur toutes les pages sauf admin */}
      {!isAdminPage && <ChatWidget />}
      
      {/* Bouton Back to Top global - seulement si ce n'est pas une page admin */}
      {/* Apparaît seulement quand on scroll (scrollY > 0) */}
      {!isAdminPage && <BackToTop showAfter={0} />}
    </div>
  )
}

export default Layout

