import axios from 'axios';

// Configuration de l'API
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://ubb-enterprise-health-check.onrender.com/api';
  }
  return import.meta.env.VITE_API_URL || 'https://ubb-enterprise-health-check.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Instance pour les requêtes admin
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token admin automatiquement
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

// Get all PDFs (admin protégé)
export const getPDFs = async (page = 1, limit = 20, search = '') => {
  try {
    const response = await adminApi.get('/admin/reports/pdfs', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des PDFs' };
  }
};

// Download PDF (public)
export const downloadPDF = async (assessmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/download/${assessmentId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du téléchargement du PDF' };
  }
};

// Resend PDF by email (admin protégé)
export const resendPDF = async (assessmentId) => {
  try {
    const response = await adminApi.post(`/admin/reports/resend/${assessmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du renvoi du PDF' };
  }
};

