import axios from 'axios';

// Configure base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:5001');

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Export helper functions for common API calls
export const apiHelpers = {
  // Health endpoints
  health: {
    getAssessments: () => apiClient.get('/health/assessments'),
    createAssessment: (data: any) => apiClient.post('/health/assessments', data),
    getAssessment: (id: string) => apiClient.get(`/health/assessments/${id}`),
  },
  
  // Auth endpoints
  auth: {
    login: (credentials: any) => apiClient.post('/auth/login', credentials),
    register: (userData: any) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
  },
  
  // Chat endpoints
  chat: {
    sendMessage: (message: any) => apiClient.post('/chat/message', message),
    getHistory: () => apiClient.get('/chat/history'),
  },
  
  // Config endpoints
  config: {
    getAI: () => apiClient.get('/config/ai'),
    updateAI: (config: any) => apiClient.put('/config/ai', config),
    getWooCommerce: () => apiClient.get('/config/woocommerce'),
    updateWooCommerce: (config: any) => apiClient.put('/config/woocommerce', config),
  },
  
  // Upload endpoints
  upload: {
    uploadFile: (formData: FormData) => 
      apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
  },
  
  // Admin endpoints
  admin: {
    getUsers: () => apiClient.get('/admin/users'),
    getStatistics: () => apiClient.get('/admin/statistics'),
    getReports: () => apiClient.get('/admin/reports'),
  },
};