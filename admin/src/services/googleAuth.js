import axios from 'axios';
import { API_METHOD } from './apiMethod';

const GOOGLE_AUTH_ENDPOINT = API_METHOD.auth.google;
const URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Send Google authorization code to backend for admin authentication
 * @param {string} code - The authorization code from Google
 * @returns {Promise} - Response from backend with admin data and token
 */
export const exchangeGoogleCode = async (code) => {
  try {
    const response = await axios.post(`${URL}${GOOGLE_AUTH_ENDPOINT}`, {
      code: code,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Google auth error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to authenticate with Google',
    };
  }
};

/**
 * Handle Google login flow for admin
 * @param {string} code - The authorization code from Google
 * @returns {Promise} - Admin data and auth token
 */
export const handleGoogleLogin = async (code) => {
  return await exchangeGoogleCode(code);
};
