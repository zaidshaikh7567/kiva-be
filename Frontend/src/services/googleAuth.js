import axios from 'axios';

// TODO: Replace with your actual backend endpoint when ready
const GOOGLE_AUTH_ENDPOINT = '/api/auth/google';
const URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Send Google authorization code to backend
 * @param {string} code - The authorization code from Google
 * @returns {Promise} - Response from backend with user data and token
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
 * Handle Google login flow
 * @param {string} code - The authorization code from Google
 * @returns {Promise} - User data and auth token
 */
export const handleGoogleLogin = async (code) => {
  return await exchangeGoogleCode(code);
};
