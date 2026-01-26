import axios from 'axios';
import { TOKEN_KEYS } from '../constants/tokenKeys';

const URL = import.meta.env.VITE_API_BASE_URL;
// Create axios instance with base configuration
const api = axios.create({
  // Use empty baseURL for development - Vite proxy will handle the routing
  baseURL: URL,
  // timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json",
  },
  // Add CORS configuration
  // withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If data is FormData, remove Content-Type header to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle common error cases
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Create a new axios instance without interceptors to avoid infinite loop
        const refreshAxios = axios.create({
          baseURL: URL,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const response = await refreshAxios.post('/api/auth/refresh', {
          refreshToken
        });

        // Handle both response structures
        const accessToken = response.data?.data?.accessToken || response.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;
        
        if (!accessToken) {
          throw new Error('No access token in response');
        }

        // Update both tokens in localStorage
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and redirect to login
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.USER);
        
        // Only redirect if not already on sign-in page
        if (window.location.pathname !== '/sign-in') {
          window.location.href = '/sign-in';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 500) {
      // Server error occurred
      console.error('Server error:', error);
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request timeout:', error);
    }
    
    return Promise.reject(error);
  }
);


export default api;
