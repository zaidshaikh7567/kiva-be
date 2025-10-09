import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      alert('New password must be different from current password');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPasswordChanged(true);
    }, 2000);
  };

  if (passwordChanged) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-sorts-mill-gloudy text-black">
              Password Changed Successfully!
            </h2>
            <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
              Your password has been updated successfully.
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center space-y-4">
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                You can now use your new password to sign in to your account.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  Back to Dashboard
                </button>
                
                <Link
                  to="/sign-in"
                  className="block w-full border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 text-center"
                >
                  Sign In Again
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-sorts-mill-gloudy text-black">
            Change Password
          </h2>
          <p className="mt-2 text-sm font-montserrat-regular-400 text-black-light">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Change Password Form */}
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
                  required
                  className="w-full pl-11 pr-12 py-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                  required
                  minLength="8"
                  className="w-full pl-11 pr-12 py-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
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
                  required
                  minLength="8"
                  className="w-full pl-11 pr-12 py-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-light hover:text-black transition-colors duration-300"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-primary-light rounded-lg p-4">
              <h4 className="text-sm font-montserrat-semibold-600 text-black mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs font-montserrat-regular-400 text-black-light space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Mix of letters and numbers</li>
                <li>• Different from current password</li>
                <li>• Avoid common passwords</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          {/* Back to Dashboard Link */}
          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
