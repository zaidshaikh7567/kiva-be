import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuthLoading, selectIsAuthenticated } from '../store/slices/authSlice';
import CustomCheckbox from '../components/CustomCheckbox';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleLogin } from '../services/googleAuth';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const remember = localStorage.getItem('rememberMe') === 'true';

    if (remember && savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ✅ Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ✅ Google Login Handler
  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        console.log('Authorization code received:', codeResponse.code);
        
        // Send authorization code to backend
        const result = await handleGoogleLogin(codeResponse.code);
        
        if (result.success) {
          // Save user data and token to localStorage or Redux store
          // TODO: Update based on your auth structure
          if (result.data.token) {
            localStorage.setItem('accessToken', result.data.token);
          }
          if (result.data.user) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
          }
          
          toast.success('Google login successful!');
          
          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          toast.error(result.error || 'Failed to login with Google');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Failed to login with Google');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    },
  });

  // ✅ Validate inputs
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));

    if (loginUser.fulfilled.match(result)) {
      // ✅ Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }

      navigate('/dashboard');
    } else if (loginUser.rejected.match(result)) {
      toast.error(result.payload?.message || 'Invalid email or password');
      // setErrors({
      //   email: result.payload?.message || 'Invalid email or password',
      //   password: result.payload?.message || 'Invalid email or password'
      // });
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-sorts-mill-gloudy text-black">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-sm sm:p-8 p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-black ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-light focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-montserrat-regular-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-black ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-light focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-montserrat-regular-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <CustomCheckbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Remember me"
                name="rememberMe"
                id="rememberMe"
              />
              <Link
                to="/forgot-password"
                className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-black font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-montserrat-regular-400 text-black-light">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
