import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Upload, User as UserIcon, Camera } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthLoading, selectAuthError, selectAuthSuccess, updateUserProfile, clearError, clearSuccess } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null
  });
  const [fieldErrors, setFieldErrors] = useState({ name: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Default dummy user image
  const defaultUserImage = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=6366f1&color=fff&size=200';

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      const userImage = user.profileImage || user.image || null;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profileImage: null // Reset to null - only set when new file is selected
      });
      // Set image preview from user data or localStorage
      const savedImage = localStorage.getItem(`user_${user.id || user._id}_profileImage`);
      setImagePreview(userImage || savedImage || null);
    }
  }, [user]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      setIsEditing(false);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'name' && fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.name.trim()) {
      setFieldErrors((prev) => ({ ...prev, name: 'Name is required' }));
      toast.error('Name is required');
      return;
    }
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Prepare data for submission
    // Only include profileImage if it's a File object (new upload)
    // Don't send it if it's a string (existing URL) or null
    const submitData = {
      name: formData.name,
      ...(formData.profileImage instanceof File && { profileImage: formData.profileImage })
    };

   const response = await dispatch(updateUserProfile(submitData));
   if (updateUserProfile.fulfilled.match(response)) {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  }else{
    toast.error(response.payload.message);
  }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setImagePreview(imageUrl);
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      // Save to localStorage for persistence (frontend only)
      if (user?.id || user?._id) {
        localStorage.setItem(`user_${user.id || user._id}_profileImage`, imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
    // Remove from localStorage
    if (user?.id || user?._id) {
      localStorage.removeItem(`user_${user.id || user._id}_profileImage`);
    }
  };

  const handleCancel = () => {
    const userImage = user?.profileImage || user?.image || null;
    const savedImage = user?.id || user?._id ? localStorage.getItem(`user_${user.id || user._id}_profileImage`) : null;
    
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      profileImage: null // Reset to null
    });
    setImagePreview(userImage || savedImage || null);
    setFieldErrors({ name: '', email: '' });
    setIsEditing(false);
  };

  // Get display image URL
  const getDisplayImage = () => {
    if (imagePreview) {
      return imagePreview;
    }
    if (user?.profileImage || user?.image) {
      return user.profileImage || user.image;
    }
    return defaultUserImage;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-sorts-mill-gloudy text-black">
          Profile Information
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

      <form onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="mb-6 md:text-left text-center">
          <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
            Profile Picture
          </label>
          <div className="relative inline-block ">
            {/* Image Preview */}
            <div
              className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center group ${
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
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}

              {/* Upload Overlay - Only show when editing */}
              {isEditing && (
                <>
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                      dragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-white text-xs font-montserrat-medium-500">
                        {imagePreview ? 'Change' : 'Upload'}
                      </p>
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                </>
              )}

              {/* Remove Button - Show when image exists and editing */}
              {isEditing && imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-10"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Helper Text - Only show when editing */}
            {isEditing && (
              <p className="text-xs font-montserrat-regular-400 text-black-light mt-2 text-center">
                Click or drag to upload • PNG, JPG, WEBP up to 2MB
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed ${
              fieldErrors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-primary-light focus:ring-primary focus:border-primary'
            }`}
            />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          )}
          </div>

          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full curser-auto px-4 py-3 border bg-gray-100 border-primary-light rounded-lg  outline-none font-montserrat-regular-400 text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default ProfileForm;
