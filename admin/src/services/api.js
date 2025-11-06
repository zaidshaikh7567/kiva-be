import axios from 'axios';

// Create axios instance with base configuration
const URL =import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh attempts
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


// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
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

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminAuthenticated');
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update both tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Process queued requests
          processQueue(null, accessToken);
          isRefreshing = false;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          // Refresh failed, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('adminAuthenticated');
          processQueue(error, null);
          isRefreshing = false;
          window.location.href = '/';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminAuthenticated');
        processQueue(refreshError, null);
        isRefreshing = false;
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 500) {
      // Server error occurred
      console.error('Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);


export default api;
