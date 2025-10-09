import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import NotificationDropdown from './NotificationDropdown';
import LanguageSelector from './LanguageSelector';

const AdminHeader = ({ onMenuClick, sidebarOpen, adminData, onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleSettingsClick = () => {
    navigate('/admin/settings');
    setShowMobileMenu(false);
  };

  // Fermer le menu mobile quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side - Admin icon on mobile, menu button on desktop */}
        <div className="flex items-center space-x-4">
          {/* Menu button for mobile */}
          {!sidebarOpen && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* VitalCheck Logo for mobile */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={Logo} 
                alt="VitalCheck Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="md:text-lg sm:text-md text-xs font-display font-semibold text-gray-900">
                 VitalCheck Admin
              </h1>
            </div>
          </div>


          {/* Title - hidden on mobile */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-display font-semibold text-gray-900">
              VitalCheck Admin
            </h1>
            <p className="text-sm text-gray-500">Gestion des utilisateurs et évaluations</p>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector - visible on all screens */}
          <LanguageSelector />

          {/* Notifications - visible on all screens */}
          <NotificationDropdown />

          {/* User info - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {adminData?.avatar?.url ? (
                <img 
                  src={adminData.avatar.url} 
                  alt={adminData?.name || 'Admin'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{adminData?.name}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>

          {/* Mobile user menu */}
          <div className="lg:hidden relative" ref={menuRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
            >
              {adminData?.avatar?.url ? (
                <img 
                  src={adminData.avatar.url} 
                  alt={adminData?.name || 'Admin'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </button>

            {/* Mobile dropdown menu */}
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{adminData?.name}</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <button
                  onClick={handleSettingsClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Desktop logout button */}
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center space-x-2 px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
