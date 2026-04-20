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
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        {/* Left side - Admin icon on mobile, menu button on desktop */}
        <div className="flex items-center space-x-3">
          {/* Menu button for mobile */}
          {!sidebarOpen && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* vitalCHECK Logo for mobile */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={Logo} 
                alt="vitalCHECK Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold text-gray-900">
                 vitalCHECK 
              </h1>
            </div>
          </div>


          {/* Title - hidden on mobile */}
          <div className="hidden lg:block leading-tight">
            <h1 className="text-lg font-black text-gray-900 leading-none">
              vitalCHECK Admin
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-0.5">Tableau de bord stratégique</p>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          <NotificationDropdown />

          {/* User info - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
              {adminData?.avatar?.url ? (
                <img 
                  src={adminData.avatar.url} 
                  alt={adminData?.name || 'Admin'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="leading-none">
              <p className="text-xs font-black text-gray-900">{adminData?.name}</p>
              <p className="text-[10px] font-bold text-primary-600/60 uppercase mt-0.5">{adminData?.role || 'Administrateur'}</p>
            </div>
          </div>

          {/* Mobile user menu */}
          <div className="lg:hidden relative" ref={menuRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              {adminData?.avatar?.url ? (
                <img 
                  src={adminData.avatar.url} 
                  alt={adminData?.name || 'Admin'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-900">{adminData?.name}</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <button
                  onClick={handleSettingsClick}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2 text-gray-400" />
                  Paramètres
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-gray-200 hidden lg:block mx-1"></div>

          {/* Desktop logout button */}
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
            title="Déconnexion"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black uppercase tracking-wider">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
