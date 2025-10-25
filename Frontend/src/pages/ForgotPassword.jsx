import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, selectAuthLoading, selectAuthSuccess, selectIsAuthenticated } from '../store/slices/authSlice';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const success = useSelector(selectAuthSuccess);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (success) {
      setEmailSent(true);
    }
  }, [success]);

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Stop if validation fails

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.rejected.match(result)) {
      setErrors({
        email: result.payload?.message || 'Failed to send reset email. Please try again.'
      });
    }
  };

  // ✅ Success UI
  if (emailSent) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-sorts-mill-gloudy text-black">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-sm sm:p-8 p-4">
            <div className="text-center space-y-4">
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Please check your email and click the link to reset your password. 
                If you don't see the email, check your spam folder.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  Try Another Email
                </button>
                
                <Link
                  to="/sign-in"
                  className="block w-full border-2 border-primary text-primary font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Forgot password form UI
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-sorts-mill-gloudy text-black">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Forgot Password Form */}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-black ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-light focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-montserrat-regular-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Tip Message */}
            {/* <div className="bg-primary-light rounded-lg p-4">
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                <strong>Tip:</strong> Make sure to check your spam folder if you don't receive the email within a few minutes.
              </p>
            </div> */}
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-montserrat-regular-400 text-black-light">
              Remember your password?{' '}
              <Link
                to="/sign-in"
                className="font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
