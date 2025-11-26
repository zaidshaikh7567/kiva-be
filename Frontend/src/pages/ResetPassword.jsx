// Updated Reset Password Page WITHOUT TOKEN FLOW (OTP-based only)

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail,Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetPassword,
  clearError,
  clearSuccess,
  selectAuthLoading,
  selectAuthSuccess,
  selectAuthSuccessType,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const success = useSelector(selectAuthSuccess);
  const successType = useSelector(selectAuthSuccessType);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: email,
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && successType === 'resetPassword') {
      setPasswordReset(true);
      dispatch(clearSuccess());
    }
  }, [success, successType, dispatch]);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?<>]).{8,}$/;

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.otp.trim()) newErrors.otp = 'OTP is required';

    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
const body ={
  email: formData.email,
  otp: formData.otp,
  newPassword: formData.password,
}
console.log('body :', body);
    const result = await dispatch(
      resetPassword(body)
    );

    if (resetPassword.rejected.match(result)) {
      toast.error(result.payload?.message)    
    }else{
      toast.success(result.payload?.message)
    }
  };

  if (passwordReset) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-sorts-mill-gloudy">Password Reset Successfully!</h2>
          <p className="text-sm text-black-light">You can now sign in with your new password.</p>

          <Link
            to="/sign-in"
            className="block w-full bg-primary text-white py-4 rounded-lg mt-6 hover:bg-primary-dark"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-sorts-mill-gloudy text-black">Reset Password</h2>
          <p className="text-sm text-black-light">Reset your password using OTP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput disabled label="Email *" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="Enter your email" icon={Mail} />

            <FormInput label="OTP *" name="otp" value={formData.otp} onChange={handleChange} error={errors.otp} placeholder="Enter OTP" icon={Lock} />

            <FormInput
              label="New Password *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              rightIcon={showPassword ? Eye : EyeOff}
              onRightIconClick={() => setShowPassword(!showPassword)}
              rightIconClickable={true}
              placeholder="Enter new password"
            />

            <FormInput
              label="Confirm Password *"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              rightIcon={showConfirmPassword ? Eye : EyeOff}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              rightIconClickable={true}
              placeholder="Confirm new password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
