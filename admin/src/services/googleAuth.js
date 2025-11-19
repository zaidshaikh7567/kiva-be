import axios from 'axios';
import { API_METHOD } from './apiMethod';

const GOOGLE_AUTH_ENDPOINT = API_METHOD.auth.google;
const URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Send Google authorization code to backend for admin authentication
 * @param {string} code - The authorization code from Google
 * @param {string} redirectUri - The redirect URI used to obtain the code (optional)
 * @returns {Promise} - Response from backend with admin data and token
 */
export const exchangeGoogleCode = async (code, redirectUri = null) => {
  try {
    const requestBody = { code };
    
    // Include redirect URI if provided (must match what was used in the OAuth flow)
    if (redirectUri) {
      requestBody.redirectUri = redirectUri;
    }
    
    const response = await axios.post(`${URL}${GOOGLE_AUTH_ENDPOINT}`, requestBody, {
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
export const handleGoogleLogin = async (code, redirectUri = null) => {
  return await exchangeGoogleCode(code, redirectUri);
};
