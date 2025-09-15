import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Mail, 
  BarChart3, 
  Settings
} from 'lucide-react';

const AdminBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      name: 'Utilisateurs',
      path: '/admin/users',
      icon: Users,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    {
      name: 'Évaluations',
      path: '/admin/assessments',
      icon: FileText,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      name: 'Emails',
      path: '/admin/emails',
      icon: Mail,
      color: 'text-earth-600',
      bgColor: 'bg-earth-50'
    },
    {
      name: 'Rapports',
      path: '/admin/reports',
      icon: BarChart3,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      name: 'Paramètres',
      path: '/admin/settings',
      icon: Settings,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="grid grid-cols-6 h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center space-y-1 transition-all duration-200
                ${active 
                  ? `${item.bgColor} ${item.color}` 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? item.color : ''}`} />
              <span className={`text-[10px] pb-3 font-medium ${active ? item.color : 'text-gray-500'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomNav;
