import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import FormInput from './FormInput';
import { useLocation } from 'react-router-dom';

const ResetPasswordPage = ({ onResetSuccess }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const location = useLocation();
  const email = location.state?.email || "";
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
      const body={
        email:email,
        otp,
        newPassword:password
      }
      const result = await dispatch(resetPassword(body));
      
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
              <FormInput
                label="OTP (One-Time Password)"
                name="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError('');
                  setGeneralError('');
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                icon={Shield}
                error={otpError || generalError}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <FormInput
                label="New Password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                  setGeneralError('');
                }}
                placeholder="Enter new password"
                error={passwordError}
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                required
                rightIcon={showPassword ? Eye : EyeOff}
                onRightIconClick={() => setShowPassword(!showPassword)}
                rightIconClickable={true}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2"> 
                <FormInput
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                    setConfirmPasswordError('');
                    setGeneralError('');
                  }}  
                  placeholder="Confirm new password"
                  error={confirmPasswordError}
                  icon={Lock}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  rightIcon={showConfirmPassword ? Eye : EyeOff}
                  onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  rightIconClickable={true}
                />
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

