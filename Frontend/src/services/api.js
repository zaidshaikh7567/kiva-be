import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Use empty baseURL for development - Vite proxy will handle the routing
  baseURL: import.meta.env.DEV ? '' : 'https://kiva-be.onrender.com',
  // timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': "application/json",
  },
  // Add CORS configuration
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
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
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You can dispatch logout action here if needed
    } else if (error.response?.status === 500) {
      // Server error occurred
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
    }
    
    return Promise.reject(error);
  }
);


export default api;
