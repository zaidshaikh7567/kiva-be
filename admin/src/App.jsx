
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Layout from './components/Layout';

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = () => {
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

  useEffect(() => {
    // Give time for Redux to initialize auth state from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
