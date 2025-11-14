import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth, getUserProfile, refreshToken } from '../store/slices/authSlice';
import { isAccessTokenExpired, hasValidRefreshToken } from '../utils/tokenUtils';
import { TOKEN_KEYS } from '../constants/tokenKeys';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const refreshTokenValue = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    
    // If we have tokens, validate them
    if (accessToken || refreshTokenValue) {
      // Check if access token is expired
      if (isAccessTokenExpired()) {
        // If access token is expired but refresh token is valid, refresh it
        if (hasValidRefreshToken()) {
          dispatch(refreshToken())
            .unwrap()
            .then(() => {
              // After successful refresh, fetch user profile
              dispatch(getUserProfile());
            })
            .catch((error) => {
              console.error('Token refresh failed on app load:', error);
              // If refresh fails, user will be logged out by the interceptor
            });
        } else {
          // Both tokens are invalid, clear them
          localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(TOKEN_KEYS.USER);
        }
      } else {
        // Access token is still valid, fetch user profile
        dispatch(getUserProfile());
      }
    }
  }, [dispatch]);

  return children;
};

export default AuthInitializer;

