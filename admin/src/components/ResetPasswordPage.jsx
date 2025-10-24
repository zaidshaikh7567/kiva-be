import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ResetPasswordPage = ({ onResetSuccess }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    // OTP validation
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setOtpError('OTP must contain only numbers');
      return;
    }

    // Client-side validation
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      const result = await dispatch(resetPassword({
        otp,
        newPassword: password,
        confirmPassword,
      }));
      
      if (resetPassword.fulfilled.match(result)) {
        toast.success('Password reset successfully!');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
        onResetSuccess();
      } else {
        toast.error(result.payload || 'Password reset failed');
      }
    } catch (err) {
      console.error('Reset password error:', err);
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
        {/* Reset Password Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-2">
              Reset Password
            </h1>
            <p className="text-black-light font-montserrat-regular-400">
              Enter OTP and your new password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Field */}
            <div className="space-y-2">
              <label className="text-sm font-montserrat-medium-500 text-black block">
                OTP (One-Time Password)
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setOtpError('');
                    setGeneralError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 outline-none transition-all duration-200 font-montserrat-regular-400 tracking-widest ${
                    otpError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-primary focus:border-transparent'
                  }`}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                 
                />
              </div>
              {(otpError || generalError) && (
                <p className="text-red-500 text-xs mt-1 font-montserrat-regular-400">
                  {otpError || generalError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-montserrat-medium-500 text-black block">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                    setGeneralError('');
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-1 outline-none transition-all duration-200 font-montserrat-regular-400 ${
                    passwordError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-primary focus:border-transparent'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-200"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 font-montserrat-regular-400">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-montserrat-medium-500 text-black block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError('');
                    setGeneralError('');
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-1 outline-none transition-all duration-200 font-montserrat-regular-400 ${
                    confirmPasswordError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-primary focus:border-transparent'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-200"
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1 font-montserrat-regular-400">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* General API Error Message */}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

