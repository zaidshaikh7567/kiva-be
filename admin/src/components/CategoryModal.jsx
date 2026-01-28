import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Save, AlertCircle, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import FormInput from './FormInput';

const CategoryModal = ({ isOpen, onClose, onSubmit, loading, error, categoryData, mode = 'add', categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentId: null,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  
  const [dragActive, setDragActive] = useState(false);

  // Update form data when modal opens or categoryData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && categoryData) {
      setFormData({
        name: categoryData.name || '',
        parentId: categoryData.parent?._id || categoryData.parentId || null,
        image: null
      });
      // Set existing image preview if available
      if (categoryData.image) {
        setImagePreview(categoryData.image);
      } else {
        setImagePreview(null);
      }
    } else if (isOpen && mode === 'add') {
      // Reset form for add mode when modal opens
      setFormData({
        name: '',
        parentId: null,
        image: null
      });
      setImagePreview(null);
      setDragActive(false);
    }
  }, [isOpen, categoryData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParentCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      parentId: value || null
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
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
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(mode === 'edit' && categoryData?.image ?null : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (mode === 'edit' && categoryData) {
        // Edit mode - send ID and data
        onSubmit({
          id: categoryData._id || categoryData.id,
          data: formData
        });
      } else {
        // Add mode - send data only
        onSubmit(formData);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      parentId: null,
      image: null
    });
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  
  const title = isEditMode ? 'Edit Category' : 'Add New Category';
  const subtitle = isEditMode ? 'Update category information' : 'Create a new jewelry category';
  const buttonText = isEditMode ? 'Update Category' : 'Create Category';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';


  
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
              {isEditMode ? (
                <Package className="w-5 h-5 text-white" />
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-sorts-mill-gloudy font-bold text-black">
                {title}
              </h2>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-black-light" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-montserrat-medium-500">
                {typeof error === 'string' ? error : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the category`}
              </span>
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-2">
            <FormInput
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              error={error}
              icon={Package}
              required
              disabled={loading}
              inputMode="text"
              maxlength={100}
              minLength={3}
            />
          </div>

          {/* Parent Category (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Parent Category (Optional)
            </label>
            <CustomDropdown
              options={categories
                .filter(cat => !cat.parent) // Only show categories that don't have a parent (top-level categories)
                .filter(cat => mode === 'add' || cat._id !== categoryData?._id) // In edit mode, don't show the current category as its own parent
                .map(category => ({
                  value: category._id,
                  label: category.name
                }))}
              value={formData.parentId || ''}
              onChange={handleParentCategoryChange}
              placeholder="Select parent category"
              disabled={loading}
            />
          </div>

          {/* Category Image */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Category Image (Optional)
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img 
                  src={imagePreview} 
                  alt="Category preview" 
                  className="w-full h-full object-cover"
                />
                {!loading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Upload Button with Drag and Drop */}
            {!imagePreview && (
              <div 
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary bg-primary-light/10' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="categoryImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="categoryImage"
                  className={`flex flex-col items-center justify-center w-full h-32 cursor-pointer transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className={`w-8 h-8 mb-2 transition-colors ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`text-sm font-montserrat-medium-500 transition-colors ${dragActive ? 'text-primary' : 'text-black-light'}`}>
                    {dragActive ? 'Drop image here' : 'Click to upload image or drag and drop'}
                  </span>
                  <span className="text-xs font-montserrat-regular-400 text-gray-400 mt-1">
                    PNG, JPG, JPEG (Max 5MB)
                  </span>
                </label>
              </div>
            )}

            {/* Change Image Button with Drag and Drop */}
            {imagePreview && formData.image && (
              <div 
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary bg-primary-light/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="categoryImageChange"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="categoryImageChange"
                  className={`flex items-center justify-center space-x-2 w-full px-4 py-2 cursor-pointer transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ImageIcon className={`w-4 h-4 transition-colors ${dragActive ? 'text-primary' : 'text-gray-600'}`} />
                  <span className={`text-sm font-montserrat-medium-500 transition-colors ${dragActive ? 'text-primary' : 'text-gray-600'}`}>
                    {dragActive ? 'Drop to replace image' : 'Change Image'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="block sm:flex items-center justify-end  pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 sm:w-auto w-full border border-gray-200 rounded-lg font-montserrat-medium-500 text-black-light hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={`flex sm:ml-2 sm:mt-0 mt-2 justify-center  sm:w-auto w-full items-center space-x-2 px-6 py-3 bg-gradient-to-r ${iconColor} text-white rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{buttonText}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CategoryModal;
