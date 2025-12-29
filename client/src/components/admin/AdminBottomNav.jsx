import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Mail, 
  BarChart3, 
  Clock,
  BookOpen,
  Settings,
  Download,
  MessageCircle
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
      name: 'En Cours',
      path: '/admin/draft-assessments',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Emails',
      path: '/admin/emails',
      icon: Mail,
      color: 'text-earth-600',
      bgColor: 'bg-earth-50'
    },
    {
      name: 'Blog',
      path: '/admin/blog',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Blog Visitors',
      path: '/admin/blog-visitors',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Rapports',
      path: '/admin/reports',
      icon: BarChart3,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      name: 'PDFs',
      path: '/admin/pdfs',
      icon: Download,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Chatbot',
      path: '/admin/chatbot',
      icon: MessageCircle,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      name: 'Paramètres',
      path: '/admin/settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed-bottom-nav bg-white border-t border-gray-200 shadow-lg lg:hidden safe-area-pb">
      <div className="flex justify-between gap-2 h-16 pb-safe overflow-x-auto w-full whitespace-nowrap px-2">
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
              <span className={`text-[8px] pb-3 font-medium ${active ? item.color : 'text-gray-500'}`}>
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
