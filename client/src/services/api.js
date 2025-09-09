import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  getUser: (email) => api.get(`/auth/user/${email}`),
}

// Assessment API
export const assessmentAPI = {
  getLanguages: () => api.get('/assessments/languages'),
  getQuestions: (language = 'en') => api.get(`/assessments/questions?lang=${language}`),
  submitAssessment: (assessmentData) => api.post('/assessments/submit', assessmentData),
  getUserAssessments: (userId) => api.get(`/assessments/user/${userId}`),
  getAssessment: (assessmentId) => api.get(`/assessments/${assessmentId}`),
}

// Reports API
export const reportsAPI = {
  generateReport: (assessmentId) => api.post(`/reports/generate/${assessmentId}`),
  getReportStatus: (assessmentId) => api.get(`/reports/status/${assessmentId}`),
}

export default api
