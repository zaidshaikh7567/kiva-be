import React, { useState, useEffect } from 'react';
import { X, Package, Save, AlertCircle, Plus } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onSubmit, loading, error, categoryData, mode = 'add', categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentId: null
  });

  // Update form data when categoryData changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && categoryData) {
      setFormData({
        name: categoryData.name || '',
        parentId: categoryData.parent?._id || categoryData.parentId || null
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        parentId: null
      });
    }
  }, [categoryData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      parentId: null
    });
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Category' : 'Add New Category';
  const subtitle = isEditMode ? 'Update category information' : 'Create a new jewelry category';
  const buttonText = isEditMode ? 'Update Category' : 'Create Category';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
              required
              disabled={loading}
            />
          </div>

          {/* Parent Category (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Parent Category (Optional)
            </label>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
              disabled={loading}
            >
              <option value="">No parent category</option>
              {categories
                .filter(cat => !cat.parent) // Only show categories that don't have a parent (top-level categories)
                .filter(cat => mode === 'add' || cat._id !== categoryData?._id) // In edit mode, don't show the current category as its own parent
                .map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
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
              disabled={loading || !formData.name.trim()}
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
    </div>
  );
};

export default CategoryModal;
