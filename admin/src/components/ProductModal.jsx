import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Save, AlertCircle, Plus, Upload, Image as ImageIcon } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSubmit, loading, error, productData, mode = 'add', categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Update form data when productData changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && productData) {
      setFormData({
        title: productData.title || '',
        description: productData.description || '',
        price: productData.price?.toString() || '',
        quantity: productData.quantity?.toString() || '',
        categoryId: productData.category?._id || productData.categoryId || '',
        images: []
      });

      // Set image previews for existing images
      if (productData.images && productData.images.length > 0) {
        setImagePreviews(productData.images.map(img => ({
          url: img.url || img,
          isExisting: true
        })));
      } else {
        setImagePreviews([]);
      }
    } else {
      // Reset form for add mode
      setFormData({
        title: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        images: []
      });
      setImagePreviews([]);
    }
  }, [productData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const addImages = (files) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select only image files');
      return;
    }

    const newImages = [...formData.images, ...imageFiles];
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));

    // Create previews for new images
    const newPreviews = imageFiles.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false,
      file: file
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
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
      const files = Array.from(e.dataTransfer.files);
      addImages(files);
    }
  };

  const removeImage = (index) => {
    // Clean up object URL if it's a new file
    const preview = imagePreviews[index];
    if (preview && !preview.isExisting && preview.url) {
      URL.revokeObjectURL(preview.url);
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.price && formData.quantity && formData.categoryId) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (mode === 'edit' && productData) {
        // Edit mode - send ID and data
        onSubmit({
          id: productData._id || productData.id,
          data: submitData
        });
      } else {
        // Add mode - send data only
        onSubmit(submitData);
      }
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    imagePreviews.forEach(preview => {
      if (!preview.isExisting && preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setFormData({
      title: '',
      description: '',
      price: '',
      quantity: '',
      categoryId: '',
      images: []
    });
    setImagePreviews([]);
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Product' : 'Add New Product';
  const subtitle = isEditMode ? 'Update product information' : 'Create a new jewelry product';
  const buttonText = isEditMode ? 'Update Product' : 'Create Product';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                {typeof error === 'string' ? error : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the product`}
              </span>
            </div>
          )}

          {/* Product Title */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none
               focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400 resize-none"
              required
              disabled={loading}
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Category */}
         <div className="space-y-2">
  <label className="block text-sm font-montserrat-medium-500 text-black">
    Category *
  </label>
  <select
    name="categoryId"
    value={formData.categoryId}
    onChange={handleInputChange}
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
    required
    disabled={loading}
  >
    <option value="">Select a category</option>

    {/* Group by parent category */}
    {categories
      .filter(cat => !cat.parent) // main categories
      .map(parentCat => (
        <optgroup key={parentCat._id} label={parentCat.name}>
          {/* Parent option itself */}
          <option value={parentCat._id}>{parentCat.name}</option>

          {/* Its subcategories */}
          {categories
            .filter(sub => sub.parent?._id === parentCat._id)
            .map(subCat => (
              <option key={subCat._id} value={subCat._id}>
                &nbsp;&nbsp;- {subCat.name}
              </option>
            ))}
        </optgroup>
      ))}
  </select>
</div>


          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Product Images ({imagePreviews.length} uploaded)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragActive
                  ? 'border-primary bg-primary-light/10'
                  : 'border-gray-200 hover:border-primary'
                }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${dragActive ? 'text-primary' : 'text-gray-400'
                  }`} />
                <p className={`text-sm mb-1 transition-colors ${dragActive ? 'text-primary font-medium' : 'text-gray-600'
                  }`}>
                  {dragActive ? 'Drop images here' : 'Click to upload images or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each • Multiple images supported
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-montserrat-medium-500 text-black">
                  Uploaded Images ({imagePreviews.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        {preview.isExisting && (
                          <div className="absolute top-1 left-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                            Existing
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {preview.file?.name || `Image ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-200 rounded-lg font-montserrat-medium-500 text-black-light hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.price || !formData.quantity || !formData.categoryId}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${iconColor} text-white rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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

export default ProductModal;
