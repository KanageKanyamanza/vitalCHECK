import { useState, useCallback, useRef } from 'react';
import { adminApiService, handleRateLimit } from '../services/api';

export const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestCache = useRef(new Map());
  const lastRequestTime = useRef(0);
  const minRequestInterval = 1000; // 1 seconde minimum entre les requêtes

  // Fonction générique pour exécuter les requêtes avec retry et cache
  const executeRequest = useCallback(async (requestFunction, retryCount = 0, cacheKey = null) => {
    try {
      // Vérifier le cache si une clé est fournie
      if (cacheKey && requestCache.current.has(cacheKey)) {
        const cached = requestCache.current.get(cacheKey);
        if (Date.now() - cached.timestamp < 30000) { // Cache valide 30 secondes
          return cached.data;
        }
      }

      // Respecter l'intervalle minimum entre les requêtes
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < minRequestInterval) {
        await new Promise(resolve => setTimeout(resolve, minRequestInterval - timeSinceLastRequest));
      }
      lastRequestTime.current = Date.now();

      setLoading(true);
      setError(null);
      
      const response = await requestFunction();
      const data = response.data;

      // Mettre en cache si une clé est fournie
      if (cacheKey) {
        requestCache.current.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (err) {
      // Gestion du rate limiting avec retry automatique (max 2 tentatives)
      if (err.response && err.response.status === 429 && retryCount < 2) {
        const retryAfter = err.response.headers['retry-after'] || 2;
        const delay = parseInt(retryAfter) * 1000 * Math.pow(2, retryCount); // Délai exponentiel
        
        console.log(`Rate limit atteint, retry dans ${delay}ms (tentative ${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeRequest(requestFunction, retryCount + 1, cacheKey);
      }
      
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonctions spécifiques pour les utilisateurs
  const getUsers = useCallback(async (params = {}) => {
    const cacheKey = `users-${JSON.stringify(params)}`;
    return executeRequest(() => adminApiService.getUsers(params), 0, cacheKey);
  }, [executeRequest]);

  const getUser = useCallback(async (userId) => {
    const cacheKey = `user-${userId}`;
    return executeRequest(() => adminApiService.getUser(userId), 0, cacheKey);
  }, [executeRequest]);

  const deleteUser = useCallback(async (userId) => {
    // Invalider le cache des utilisateurs
    requestCache.current.delete(`user-${userId}`);
    requestCache.current.forEach((value, key) => {
      if (key.startsWith('users-')) {
        requestCache.current.delete(key);
      }
    });
    return executeRequest(() => adminApiService.deleteUser(userId));
  }, [executeRequest]);

  // Fonctions spécifiques pour les évaluations
  const getAssessments = useCallback(async (params = {}) => {
    const cacheKey = `assessments-${JSON.stringify(params)}`;
    return executeRequest(() => adminApiService.getAssessments(params), 0, cacheKey);
  }, [executeRequest]);

  const getAssessment = useCallback(async (assessmentId) => {
    const cacheKey = `assessment-${assessmentId}`;
    return executeRequest(() => adminApiService.getAssessment(assessmentId), 0, cacheKey);
  }, [executeRequest]);

  const deleteAssessment = useCallback(async (assessmentId) => {
    // Invalider le cache des évaluations
    requestCache.current.delete(`assessment-${assessmentId}`);
    requestCache.current.forEach((value, key) => {
      if (key.startsWith('assessments-')) {
        requestCache.current.delete(key);
      }
    });
    return executeRequest(() => adminApiService.deleteAssessment(assessmentId));
  }, [executeRequest]);

  const getDraftAssessments = useCallback(async (params = {}) => {
    const cacheKey = `draft-assessments-${JSON.stringify(params)}`;
    return executeRequest(() => adminApiService.getDraftAssessments(params), 0, cacheKey);
  }, [executeRequest]);

  const getUserDraftAssessment = useCallback(async (userId) => {
    const cacheKey = `user-draft-assessment-${userId}`;
    return executeRequest(() => adminApiService.getUserDraftAssessment(userId), 0, cacheKey);
  }, [executeRequest]);

  // Fonctions pour les statistiques
  const getStats = useCallback(async () => {
    const cacheKey = 'stats';
    return executeRequest(() => adminApiService.getStats(), 0, cacheKey);
  }, [executeRequest]);

  // Fonctions pour les emails
  const sendReminderEmail = useCallback(async (userId, data) => {
    return executeRequest(() => adminApiService.sendReminderEmail(userId, data));
  }, [executeRequest]);

  const sendBulkEmails = useCallback(async (data) => {
    return executeRequest(() => adminApiService.sendBulkEmails(data));
  }, [executeRequest]);

  // Fonction pour l'export CSV
  const exportUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApiService.exportUsers();
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction générique pour télécharger des fichiers
  const downloadFile = useCallback(async (apiFunction, filename) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction();
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Exports Excel et PDF
  const exportUsersExcel = useCallback(() => 
    downloadFile(adminApiService.exportUsersExcel, 'utilisateurs-export.xlsx'), 
    [downloadFile]
  );

  const exportUsersPDF = useCallback(() => 
    downloadFile(adminApiService.exportUsersPDF, 'utilisateurs-rapport.pdf'), 
    [downloadFile]
  );

  const exportAssessmentsExcel = useCallback(() => 
    downloadFile(adminApiService.exportAssessmentsExcel, 'evaluations-export.xlsx'), 
    [downloadFile]
  );

  const exportAssessmentsPDF = useCallback(() => 
    downloadFile(adminApiService.exportAssessmentsPDF, 'evaluations-rapport.pdf'), 
    [downloadFile]
  );

  const exportStatsExcel = useCallback(() => 
    downloadFile(adminApiService.exportStatsExcel, 'statistiques-export.xlsx'), 
    [downloadFile]
  );

  const exportStatsPDF = useCallback(() => 
    downloadFile(adminApiService.exportStatsPDF, 'statistiques-rapport.pdf'), 
    [downloadFile]
  );

  // Fonctions pour les notifications
  const getNotifications = useCallback(async () => {
    const cacheKey = 'notifications';
    return executeRequest(() => adminApiService.getNotifications(), 0, cacheKey);
  }, [executeRequest]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    // Invalider le cache des notifications
    requestCache.current.delete('notifications');
    return executeRequest(() => adminApiService.markNotificationAsRead(notificationId));
  }, [executeRequest]);

  const markAllNotificationsAsRead = useCallback(async () => {
    // Invalider le cache des notifications
    requestCache.current.delete('notifications');
    return executeRequest(() => adminApiService.markAllNotificationsAsRead());
  }, [executeRequest]);

  // Fonction pour vider le cache
  // Fonctions spécifiques pour les blogs
  const getBlogs = useCallback(async (params = {}) => {
    const cacheKey = `blogs-${JSON.stringify(params)}`;
    return executeRequest(() => adminApiService.getBlogs(params), 0, cacheKey);
  }, [executeRequest]);

  const getBlog = useCallback(async (blogId) => {
    const cacheKey = `blog-${blogId}`;
    return executeRequest(() => adminApiService.getBlog(blogId), 0, cacheKey);
  }, [executeRequest]);

  const createBlog = useCallback(async (data) => {
    // Invalider le cache des blogs
    requestCache.current.forEach((value, key) => {
      if (key.startsWith('blogs-')) {
        requestCache.current.delete(key);
      }
    });
    return executeRequest(() => adminApiService.createBlog(data));
  }, [executeRequest]);

  const updateBlog = useCallback(async (id, data) => {
    // Invalider le cache des blogs
    requestCache.current.delete(`blog-${id}`);
    requestCache.current.forEach((value, key) => {
      if (key.startsWith('blogs-')) {
        requestCache.current.delete(key);
      }
    });
    return executeRequest(() => adminApiService.updateBlog(id, data));
  }, [executeRequest]);

  const deleteBlog = useCallback(async (id) => {
    // Invalider le cache des blogs
    requestCache.current.delete(`blog-${id}`);
    requestCache.current.forEach((value, key) => {
      if (key.startsWith('blogs-')) {
        requestCache.current.delete(key);
      }
    });
    return executeRequest(() => adminApiService.deleteBlog(id));
  }, [executeRequest]);

  const getBlogStats = useCallback(async () => {
    const cacheKey = 'blog-stats';
    return executeRequest(() => adminApiService.getBlogStats(), 0, cacheKey);
  }, [executeRequest]);

  const clearCache = useCallback(() => {
    requestCache.current.clear();
    console.log('Cache API vidé');
  }, []);

  return {
    loading,
    error,
    executeRequest,
    // Users
    getUsers,
    getUser,
    deleteUser,
    // Assessments
    getAssessments,
    getAssessment,
    deleteAssessment,
    getDraftAssessments,
    getUserDraftAssessment,
    // Stats
    getStats,
    // Emails
    sendReminderEmail,
    sendBulkEmails,
    // Exports
    exportUsers,
    exportUsersExcel,
    exportUsersPDF,
    exportAssessmentsExcel,
    exportAssessmentsPDF,
    exportStatsExcel,
    exportStatsPDF,
    // Notifications
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    // Blogs
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogStats,
    // Cache
    clearCache,
  };
};
