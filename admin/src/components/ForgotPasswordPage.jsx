import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import FormInput from './FormInput';

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    try {
      const result = await dispatch(forgotPassword(email));
      
      if (forgotPassword.fulfilled.match(result)) {
        toast.success('Password reset email sent successfully!');
        setEmail('');
        // Redirect to reset password page
        navigate('/reset-password');
      } else {
        toast.error(result.payload || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary to-primary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Forgot Password Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-2">
              Forgot Password
            </h1>
            <p className="text-black-light font-montserrat-regular-400">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <FormInput
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError('');
                  dispatch(clearError());
                }}
                error={validationError || error}
                icon={Mail}
                placeholder="Enter your email"
                inputMode="email"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="text-primary hover:text-primary-dark font-montserrat-medium-500 flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

