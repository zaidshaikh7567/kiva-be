import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePassword,
  clearError,
  clearSuccess,
  selectAuthError,
  selectAuthLoading,
  selectAuthSuccess,
  selectAuthSuccessType,
} from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import FormInput from '../FormInput';

const ChangePasswordForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);
  const success = useSelector(selectAuthSuccess);
  const successType = useSelector(selectAuthSuccessType);

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
    if (success && successType === 'changePassword') {
      toast.success(success);
      setPasswordChanged(true);
      dispatch(clearSuccess());
    }
  }, [success, successType, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long';
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, number, and special character';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
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
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-sorts-mill-gloudy text-black">
            Password Changed Successfully!
          </h2>
          <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
            Your password has been updated successfully.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => (onSuccess ? onSuccess() : null)}
              className="bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <FormInput
            type={showPasswords.current ? 'text' : 'password'}
            label="Current Password *"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            icon={Lock}
            placeholder="Enter your current password"
            rightIcon={showPasswords.current ? Eye : EyeOff}
            onRightIconClick={() => togglePasswordVisibility('current')}
            rightIconClickable={true}
          />
        </div>

        <div>         
          <FormInput
            type={showPasswords.new ? 'text' : 'password'}
            label="New Password *"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            icon={Lock}
            placeholder="Enter your new password"
            rightIcon={showPasswords.new ? Eye : EyeOff}
            onRightIconClick={() => togglePasswordVisibility('new')}
            rightIconClickable={true}
          />
        </div>

        <div>
          <FormInput
            type={showPasswords.confirm ? 'text' : 'password'}
            label="Confirm New Password *"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
            placeholder="Confirm your new password"
            rightIcon={showPasswords.confirm ? Eye : EyeOff}
            onRightIconClick={() => togglePasswordVisibility('confirm')}
            rightIconClickable={true}
          />
        </div>  

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;


