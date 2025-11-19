
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, initializeAuth, refreshToken, getUserProfile } from './store/slices/authSlice';
import { isAccessTokenExpired, hasValidRefreshToken } from './utils/tokenUtils';
import { TOKEN_KEYS } from './constants/tokenKeys';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Layout from './components/Layout';

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
    // This will be handled by Redux state change
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
}

function ForgotPasswordWrapper() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/');
  };

  return <ForgotPasswordPage onBackToLogin={handleBackToLogin} />;
}

function ResetPasswordWrapper() {
  const navigate = useNavigate();

  const handleResetSuccess = () => {
    navigate('/');
  };

  return <ResetPasswordPage onResetSuccess={handleResetSuccess} />;
}

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth and validate tokens
    const initializeAuthFlow = async () => {
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
            try {
              await dispatch(refreshToken()).unwrap();
              // After successful refresh, fetch user profile
              dispatch(getUserProfile());
            } catch (error) {
              console.error('Token refresh failed on app load:', error);
              // If refresh fails, user will be logged out by the interceptor
            }
          } else {
            // Both tokens are invalid, clear them
            localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(TOKEN_KEYS.USER);
            localStorage.removeItem(TOKEN_KEYS.AUTHENTICATED);
          }
        } else {
          // Access token is still valid, fetch user profile
          dispatch(getUserProfile());
        }
      }
      
      // Give time for Redux to initialize auth state
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    initializeAuthFlow();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary to-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-montserrat-regular-400 text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
          <Route path="/reset-password" element={<ResetPasswordWrapper />} />
          <Route path="*" element={<LoginWrapper />} />
        </Routes>
      ) : (
        <Layout />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
