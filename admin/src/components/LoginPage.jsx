import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthLoading, selectAuthError, clearError, initializeAuth } from '../store/slices/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleLogin } from '../services/googleAuth';
import toast from 'react-hot-toast';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import FormInput from './FormInput';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin, onForgotPassword }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ✅ Validation logic
  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // ✅ Google Login Handler for Admin
  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        console.log('Admin authorization code received:', codeResponse.code);
        
        // Send authorization code to backend
        const redirectUri = window.location.origin;
        const result = await handleGoogleLogin(codeResponse.code, redirectUri);
        
        if (result.success && result.data?.data) {
          // Save admin data and token to localStorage
          if (result.data.data.accessToken) {
            localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, result.data.data.accessToken);
            localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, result.data.data.refreshToken);
          }
          if (result.data.data.user) {
            localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(result.data.data.user));
          }
          localStorage.setItem(TOKEN_KEYS.AUTHENTICATED, 'true');
          dispatch(initializeAuth());
          
          toast.success('Google admin login successful!');
          navigate('/dashboard');
          // Call the onLogin callback to handle successful login
          onLogin();
        } else {
          toast.error(result.error || 'Failed to login with Google');
        }
      } catch (error) {
        console.error('Google admin login error:', error);
        toast.error('Failed to login with Google');
      }
    },
    onError: (error) => {
      console.error('Google admin login error:', error);
      toast.error('Failed to login with Google');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validate()) {
      return;
    }
    
    try {
      const result = await dispatch(login({ email, password, role: 'admin' }));
      
      if (login.fulfilled.match(result)) {
        toast.success('Login successful!');
        onLogin();
      } else {
        toast.error(result.payload || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
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
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-2">
              Jewelry Admin
            </h1>
            <p className="text-black-light font-montserrat-regular-400">
              Sign in to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <FormInput
                label="Email Address"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
                icon={Mail} 
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <FormInput
                label="Password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                required
                rightIcon={showPassword ? Eye : EyeOff}
                onRightIconClick={() => setShowPassword(!showPassword)}
                rightIconClickable={true}
              />
            </div>  
              <div className="flex items-center justify-end mt-2 relative">
                {onForgotPassword && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-primary text-right hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                )}
              </div >

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-montserrat-medium-500">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-black-light font-montserrat-regular-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-black font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-black-light font-montserrat-light-300">
              Secure admin access for jewelry management
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {/* <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-sm font-montserrat-medium-500 text-black mb-2">Demo Credentials:</p>
          <div className="text-xs font-montserrat-regular-400 text-black-light space-y-1">
            <p>Email: admin@mailinator.com</p>
            <p>Password: Admin@123</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
