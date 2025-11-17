import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Mail, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateProfile, selectUser, selectAuthLoading, selectAuthError, selectAuthSuccess, clearSuccess } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null,
    removeProfileImage: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profileImage: null,
        removeProfileImage: false
      });
      setImagePreview(user.profileImage || user.image || null);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
    }
  }, [error, success, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let payload;
    if (formData.profileImage instanceof File) {
      payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('profileImage', formData.profileImage);
      if (formData.removeProfileImage) {
        payload.append('removeProfileImage', 'true');
      }
    } else {
      payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.removeProfileImage ? { removeProfileImage: true } : {})
      };
    }

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      profileImage: null,
      removeProfileImage: false
    });
    setImagePreview(user.profileImage || user.image || null);
    setDragActive(false);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        removeProfileImage: false
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      removeProfileImage: true
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    handleDrag(e);
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    handleDrag(e);
    setDragActive(false);
  };

  const handleDrop = (e) => {
    handleDrag(e);
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange({ target: { files: [file] } });
    }
  };

  const getDisplayImage = () => {
    if (imagePreview) return imagePreview;
    if (user?.profileImage || user?.image) return user.profileImage || user.image;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=E0C0B0&color=051F34&size=200`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-sorts-mill-gloudy font-bold mb-3">
          My Profile
        </h1>
        <p className="font-montserrat-regular-400 opacity-90 text-lg">
          Manage your profile information
        </p>
      </div> */}

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-sorts-mill-gloudy text-black">
            {user.name} Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-w-2xl">
            {/* Profile Image */}
            <div className="mb-8">
              <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                Profile Picture
              </label>
              <div
                className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center group ${
                  isEditing ? 'cursor-pointer' : ''
                }`}
                onDragEnter={isEditing ? handleDragIn : undefined}
                onDragLeave={isEditing ? handleDragOut : undefined}
                onDragOver={isEditing ? handleDrag : undefined}
                onDrop={isEditing ? handleDrop : undefined}
              >
                {getDisplayImage() ? (
                  <img
                    src={getDisplayImage()}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}

                {isEditing && (
                  <>
                    <div
                      className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-2 text-white transition-opacity duration-300 ${
                        dragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-xs font-montserrat-medium-500">
                        {imagePreview ? 'Change photo' : 'Upload photo'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={loading}
                    />
                  </>
                )}

                {isEditing && imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              {isEditing && (
                <p className="text-xs font-montserrat-regular-400 text-black-light mt-2">
                  JPG, PNG or WEBP, max 2MB • Drag & drop supported
                </p>
              )}
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 ${
                    !isEditing ? 'bg-gray-100 border-gray-200' : 'border-gray-200 focus:ring-primary focus:border-transparent'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 ${
                    !isEditing ? 'bg-gray-100 border-gray-200' : 'border-gray-200 focus:ring-primary focus:border-transparent'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg hover:from-primary-dark hover:to-primary font-montserrat-medium-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center space-x-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-montserrat-medium-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
