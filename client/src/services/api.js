import axios from 'axios';
import { toast } from 'react-hot-toast';

// Configuration de base d'Axios
const getApiBaseUrl = () => {
  // En production, utiliser l'URL du serveur backend
  if (import.meta.env.PROD) {
    return 'https://ubb-enterprise-health-check.onrender.com/api';
  }
  // En développement, utiliser l'URL locale ou celle définie dans .env
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Instance Axios principale
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instance Axios pour les requêtes admin
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token admin
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
const setupResponseInterceptor = (instance, isAdmin = false) => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Gestion des erreurs HTTP
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            if (isAdmin) {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminData');
              window.location.href = '/admin/login';
            }
            toast.error('Session expirée. Veuillez vous reconnecter.');
            break;
            
          case 403:
            toast.error('Accès refusé. Permissions insuffisantes.');
            break;
            
          case 429:
            toast.error('Trop de requêtes. Veuillez patienter un moment.');
            break;
            
          case 500:
            toast.error('Erreur serveur. Veuillez réessayer plus tard.');
            break;
            
          default:
            if (data && data.message) {
              toast.error(data.message);
            } else {
              toast.error('Une erreur est survenue.');
            }
        }
      } else if (error.request) {
        // Erreur réseau
        toast.error('Problème de connexion. Vérifiez votre réseau.');
      } else {
        // Autre erreur
        toast.error('Une erreur inattendue est survenue.');
      }
      
      return Promise.reject(error);
    }
  );
};

// Configuration des intercepteurs
setupResponseInterceptor(api, false);
setupResponseInterceptor(adminApi, true);

// Fonctions API publiques
export const publicApi = {
  // Auth
  register: (data) => api.post('/auth/register', data),
  getUser: (email) => api.get(`/auth/user/${email}`),
  
  // Assessments
  getQuestions: (lang = 'fr') => api.get(`/assessments/questions?lang=${lang}`),
  submitAssessment: (data) => api.post('/assessments/submit', data),
  getUserAssessments: (userId) => api.get(`/assessments/user/${userId}`),
  getAssessment: (assessmentId) => api.get(`/assessments/${assessmentId}`),
  
  // Reports
  generateReport: (assessmentId) => api.get(`/reports/${assessmentId}`),
  downloadReport: (assessmentId) => api.get(`/reports/download/${assessmentId}`, {
    responseType: 'blob',
  }),
  
  // Health check
  healthCheck: () => api.get('/health'),
};

// Alias pour compatibilité
export const authAPI = publicApi;
export const assessmentAPI = publicApi;
export const reportsAPI = publicApi;

// Fonctions API admin
export const adminApiService = {
  // Auth Admin
  login: (credentials) => adminApi.post('/admin/login', credentials),
  
  // Stats
  getStats: () => adminApi.get('/admin/stats'),
  
  // Users
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/admin/users?${queryParams}`);
  },
  getUser: (userId) => adminApi.get(`/admin/users/${userId}`),
  deleteUser: (userId) => adminApi.delete(`/admin/users/${userId}`),
  
  // Assessments
  getAssessments: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/admin/assessments?${queryParams}`);
  },
  getAssessment: (assessmentId) => adminApi.get(`/admin/assessments/${assessmentId}`),
  deleteAssessment: (assessmentId) => adminApi.delete(`/admin/assessments/${assessmentId}`),
  
  // Emails
  sendReminderEmail: (userId, data) => adminApi.post(`/admin/users/${userId}/remind`, data),
  sendBulkEmails: (data) => adminApi.post('/admin/users/remind-bulk', data),
  
    // Export
    exportUsers: () => adminApi.get('/admin/export/users', {
      responseType: 'blob',
    }),
    
  // Notifications
  getNotifications: () => adminApi.get('/admin/notifications'),
  markNotificationAsRead: (notificationId) => adminApi.put(`/admin/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: () => adminApi.put('/admin/notifications/read-all'),
};

// Fonction utilitaire pour gérer les erreurs de rate limiting
export const handleRateLimit = (error, retryFunction, maxRetries = 3) => {
  if (error.response && error.response.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || 1;
    const delay = parseInt(retryAfter) * 1000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(retryFunction());
      }, delay);
    });
  }
  
  return Promise.reject(error);
};

// Fonction pour vérifier la connexion
export const checkConnection = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Fonction pour réinitialiser la connexion
export const resetConnection = () => {
  // Nettoyer les tokens
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  
  // Rediriger vers la page de connexion
  window.location.href = '/admin/login';
};

export default api;
