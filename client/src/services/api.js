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
  createDraft: (data) => api.post('/assessments/draft', data),
  resumeAssessment: (token) => api.get(`/assessments/resume/${token}`),
  saveProgress: (assessmentId, data) => api.put(`/assessments/progress/${assessmentId}`, data),
  
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
  getUserDraftAssessment: (userId) => adminApi.get(`/admin/users/${userId}/draft-assessment`),
  
  // Assessments
  getAssessments: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/admin/assessments?${queryParams}`);
  },
  getAssessment: (assessmentId) => adminApi.get(`/admin/assessments/${assessmentId}`),
  deleteAssessment: (assessmentId) => adminApi.delete(`/admin/assessments/${assessmentId}`),
  getDraftAssessments: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/admin/draft-assessments?${queryParams}`);
  },
  
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
  
  // Blogs
  getBlogs: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/blogs/admin/blogs?${queryParams}`);
  },
  getBlog: (id) => adminApi.get(`/blogs/admin/blogs/${id}`),
  createBlog: (data) => adminApi.post('/blogs/admin/blogs', data),
  updateBlog: (id, data) => adminApi.put(`/blogs/admin/blogs/${id}`, data),
  deleteBlog: (id) => adminApi.delete(`/blogs/admin/blogs/${id}`),
  getBlogStats: () => adminApi.get('/blogs/admin/stats'),
  
  // Exports
  exportUsersExcel: () => adminApi.get('/admin/export/users/excel', { responseType: 'blob' }),
  exportUsersPDF: () => adminApi.get('/admin/export/users/pdf', { responseType: 'blob' }),
  exportAssessmentsExcel: () => adminApi.get('/admin/export/assessments/excel', { responseType: 'blob' }),
  exportAssessmentsPDF: () => adminApi.get('/admin/export/assessments/pdf', { responseType: 'blob' }),
  exportStatsExcel: () => adminApi.get('/admin/export/stats/excel', { responseType: 'blob' }),
  exportStatsPDF: () => adminApi.get('/admin/export/stats/pdf', { responseType: 'blob' }),
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

// ===== SERVICES BLOG =====

// Services publics pour les blogs
export const blogApiService = {
  // Récupérer tous les blogs publiés
  getBlogs: (params = {}) => api.get('/blogs', { params }),
  
  // Récupérer un blog par slug
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
  
  // Liker un blog
  likeBlog: (id) => api.post(`/blogs/${id}/like`),
  
  // Tracker une visite
  trackVisit: (visitId, data) => api.post(`/blogs/track`, {
    visitId,
    ...data
  }),
  
  // Rechercher des blogs
  searchBlogs: (query) => api.get('/blogs', { 
    params: { search: query, limit: 20 } 
  })
};

// Services admin pour les blogs
export const adminBlogApiService = {
  // Récupérer tous les blogs (admin)
  getBlogs: (params = {}) => adminApi.get('/blogs/admin/blogs', { params }),
  
  // Récupérer un blog par ID (admin)
  getBlog: (id) => adminApi.get(`/blogs/admin/blogs/${id}`),
  
  // Créer un blog
  createBlog: (data) => adminApi.post('/blogs/admin/blogs', data),
  
  // Mettre à jour un blog
  updateBlog: (id, data) => adminApi.put(`/blogs/admin/blogs/${id}`, data),
  
  // Supprimer un blog
  deleteBlog: (id) => adminApi.delete(`/blogs/admin/blogs/${id}`),
  
  // Récupérer tous les blogs (admin)
  getAllBlogs: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/blogs/admin/blogs?${queryParams}`);
  },
  
  // Récupérer les statistiques
  getStats: () => {
    console.log('Getting blog stats...')
    const token = localStorage.getItem('adminToken')
    console.log('Admin token present:', !!token)
    return adminApi.get('/blogs/admin/stats')
  },
  
  // Récupérer les visites d'un blog
  getBlogVisits: (blogId) => adminApi.get(`/blogs/admin/blogs/${blogId}/visits`),
  
  // Récupérer toutes les visites
  getAllVisits: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return adminApi.get(`/blogs/admin/visits?${queryParams}`);
  }
};

export default api;
