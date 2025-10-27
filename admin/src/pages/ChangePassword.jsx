import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, selectAuthError, selectAuthLoading, selectAuthSuccess, clearError, clearSuccess } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);
  const success = useSelector(selectAuthSuccess);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success(success);
      setPasswordChanged(true);
      dispatch(clearSuccess());
    }
  }, [error, success, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long';
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must include uppercase, lowercase, number, and special character';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword =
        'New password must be different from current password';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }));
  };

  if (passwordChanged) {
    return (
      <div className="space-y-8">
        {/* <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-8">
          <h1 className="text-4xl font-sorts-mill-gloudy font-bold mb-3">
            Password Changed
          </h1>
          <p className="font-montserrat-regular-400 opacity-90 text-lg">
            Your password has been updated successfully
          </p>
        </div> */}

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-2">
              Password Changed Successfully!
            </h2>
            <p className="text-sm font-montserrat-regular-400 text-black-light mb-6">
              You can now use your new password to sign in to your account.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary to-primary-dark text-white font-montserrat-medium-500 px-8 py-3 rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-sorts-mill-gloudy font-bold mb-3">
          Change Password
        </h1>
        <p className="font-montserrat-regular-400 opacity-90 text-lg">
          Update your password to keep your account secure
        </p>
      </div> */}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 ${
                  errors.currentPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-primary focus:border-transparent'
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
              >
                {showPasswords.current ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1 font-montserrat-regular-400">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 ${
                  errors.newPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-primary focus:border-transparent'
                }`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
              >
                {showPasswords.new ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1 font-montserrat-regular-400">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-primary focus:border-transparent'
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
              >
                {showPasswords.confirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1 font-montserrat-regular-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-montserrat-semibold-600 hover:from-primary-dark hover:to-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
