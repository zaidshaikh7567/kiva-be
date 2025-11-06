/**
 * Token utility functions for JWT token management
 */

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if token expires in less than 1 minute (buffer time)
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime + 60; // 60 seconds buffer
};

/**
 * Check if access token is expired
 * @returns {boolean} - True if access token is expired or doesn't exist
 */
export const isAccessTokenExpired = () => {
  const accessToken = localStorage.getItem('accessToken');
  return isTokenExpired(accessToken);
};

/**
 * Check if refresh token exists and is valid
 * @returns {boolean} - True if refresh token exists and is not expired
 */
export const hasValidRefreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  
  // Check if refresh token is expired
  return !isTokenExpired(refreshToken);
};

