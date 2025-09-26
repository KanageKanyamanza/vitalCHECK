import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import Logo from '../../assets/Logo.png';
import NotificationDropdown from './NotificationDropdown';
import LanguageSelector from './LanguageSelector';

const AdminHeader = ({ onMenuClick, adminData, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side - Admin icon on mobile, menu button on desktop */}
        <div className="flex items-center space-x-4">
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
              <h1 className="text-lg font-display font-semibold text-gray-900">
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{adminData?.name}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>

          {/* Logout button - icon only on mobile, full button on desktop */}
          <button
            onClick={onLogout}
            className="lg:hidden flex items-center space-x-2 px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            {/* <span className="hidden lg:inline text-sm font-medium">Déconnexion</span> */}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
