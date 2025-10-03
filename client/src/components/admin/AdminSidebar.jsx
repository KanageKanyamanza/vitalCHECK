import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Mail, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Settings,
  UserCheck
} from 'lucide-react';
import Logo from '../../assets/Logo.png';

const AdminSidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      hoverColor: 'hover:bg-primary-100'
    },
    {
      name: 'Utilisateurs',
      path: '/admin/users',
      icon: Users,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      hoverColor: 'hover:bg-secondary-100'
    },
    {
      name: 'Évaluations',
      path: '/admin/assessments',
      icon: FileText,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      hoverColor: 'hover:bg-accent-100'
    },
    {
      name: 'En Cours',
      path: '/admin/draft-assessments',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      name: 'Blog',
      path: '/admin/blog',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      name: 'Visiteurs Blog',
      path: '/admin/blog-visitors',
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100'
    },
    {
      name: 'Emails',
      path: '/admin/emails',
      icon: Mail,
      color: 'text-earth-600',
      bgColor: 'bg-earth-50',
      hoverColor: 'hover:bg-earth-100'
    },
    {
      name: 'Rapports',
      path: '/admin/reports',
      icon: BarChart3,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      hoverColor: 'hover:bg-success-100'
    },
    {
      name: 'Paramètres',
      path: '/admin/settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'w-[80px]' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                <img 
                  src={Logo} 
                  alt="VitalCheck Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">Admin</h2>
                <p className="text-xs text-gray-500">Health Check</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                <img 
                  src={Logo} 
                  alt="VitalCheck Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Bouton collapse pour desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Bouton fermer pour mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? `${item.bgColor} ${item.color} shadow-sm` 
                    : `text-gray-600 hover:bg-gray-50 ${item.hoverColor}`
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 ${active ? item.color : 'text-gray-500'}`} />
                {!isCollapsed && (
                  <span className={`font-medium ${active ? item.color : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-danger-600 hover:bg-danger-50 transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="font-medium">Déconnexion</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
