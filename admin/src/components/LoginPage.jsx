import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = ({ onLogin, onForgotPassword }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login({ email, password }));
      
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
              <label className="text-sm font-montserrat-medium-500 text-black block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              {/* <div className="flex items-center justify-between"> */}
                <label className="text-sm font-montserrat-medium-500 text-black block">
                  Password
                </label>
                
              {/* </div> */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                  placeholder="Enter your password"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-200"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
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
                )}</div>
               
            </div>

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
