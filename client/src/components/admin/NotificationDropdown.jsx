import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, FileText, Clock, ChevronRight } from 'lucide-react';
import { useAdminApi } from '../../hooks/useAdminApi';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useAdminApi();

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charger les notifications
  const loadNotifications = async (isBackground = false) => {
    try {
      if (isBackground) {
        setBackgroundLoading(true);
      } else {
        setLoading(true);
      }
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      if (isBackground) {
        setBackgroundLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Charger les notifications au montage et périodiquement
  useEffect(() => {
    // Charger immédiatement
    loadNotifications();
    
    // Mettre à jour toutes les 30 secondes en arrière-plan
    const interval = setInterval(() => loadNotifications(true), 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Recharger les notifications à l'ouverture du dropdown
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notification) => {
    try {
      const notificationId = notification.id || notification._id;
      const assessmentId = notification.assessment?.id || notification.assessment?._id;
      
      if (!notificationId) {
        console.error('ID de notification manquant:', notification);
        return;
      }
      
      if (!assessmentId) {
        console.error('ID d\'évaluation manquant:', notification);
        return;
      }
      
      // Marquer la notification comme lue côté serveur
      await markNotificationAsRead(notificationId);
      
      // Mettre à jour l'état local
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          (n.id || n._id) === notificationId ? { ...n, read: true } : n
        )
      );
      
      setIsOpen(false);
      // Naviguer vers les détails de l'évaluation
      navigate(`/admin/assessments/${assessmentId}`);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      // Mettre à jour l'état local même en cas d'erreur
      const notificationId = notification.id || notification._id;
      if (notificationId) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            (n.id || n._id) === notificationId ? { ...n, read: true } : n
          )
        );
      }
      setIsOpen(false);
      const assessmentId = notification.assessment?.id || notification.assessment?._id;
      if (assessmentId) {
        navigate(`/admin/assessments/${assessmentId}`);
      }
    }
  };

  // Gérer le clic sur le bouton de notification
  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      // Mettre à jour l'état local même en cas d'erreur
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <Bell className={`w-5 h-5 text-gray-600 ${backgroundLoading ? 'animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {backgroundLoading && unreadCount === 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute sm:right-0 -right-6 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-sm">Aucune nouvelle notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {unreadNotifications.map((notification, index) => (
                  <div
                    key={notification.id || notification._id || index}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group bg-blue-50 border-l-4 border-l-primary-500"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icône */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary-600" />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="font-medium">Score:</span>
                          <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full">
                            {notification.assessment.score}/100
                          </span>
                          <span className="ml-2 font-medium">Statut:</span>
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            notification.assessment.status === 'excellent' ? 'bg-success-100 text-success-800' :
                            notification.assessment.status === 'good' ? 'bg-primary-100 text-primary-800' :
                            notification.assessment.status === 'average' ? 'bg-warning-100 text-warning-800' :
                            'bg-danger-100 text-danger-800'
                          }`}>
                            {notification.assessment.status}
                          </span>
                        </div>
                      </div>

                      {/* Flèche */}
                      <div className="flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {unreadNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/assessments');
                }}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir toutes les évaluations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
