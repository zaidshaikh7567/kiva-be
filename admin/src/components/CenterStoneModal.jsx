import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Gem, Save, AlertCircle, Plus } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import { fetchCategories, selectCategories, selectCategoriesLoading } from '../store/slices/categoriesSlice';

const CenterStoneModal = ({ isOpen, onClose, onSubmit, loading, error, centerStoneData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    status: 'active'
  });

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);



  // Update form data when modal opens or centerStoneData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && centerStoneData) {
      setFormData({
        name: centerStoneData.name || '',
        price: centerStoneData.price?.toString() || '',
        categoryId: centerStoneData.categoryId || '',
        status: centerStoneData.status || 'active'
      });
    } else if (isOpen && mode === 'add') {
      // Reset form for add mode when modal opens
      setFormData({
        name: '',
        price: '',
        categoryId: '',
        status: 'active'
      });
    }
  }, [isOpen, centerStoneData, mode]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  // Get ring subcategories from categories
  const getRingSubcategories = () => {
    // Find Ring category (parent: null, name: "Ring")
    const ringCategory = categories.find(cat => cat.name?.toLowerCase() === 'ring' && !cat.parent);
    console.log('categories :', categories);
    console.log('ringCategory :', ringCategory);
    
    if (ringCategory) {
      // Find all subcategories where parent._id matches Ring category ID
      const ringSubcategories = categories.filter(cat => 
        cat.parent && cat.parent._id === ringCategory._id
      );
      
      console.log('ringSubcategories :', ringSubcategories);
      
      return ringSubcategories.map(sub => ({
        value: sub._id, // Use subcategory ID
        label: sub.name // Display subcategory name
      }));
    }
    
    // Fallback to hardcoded options if no categories found
    return [
      { value: '68e36f191cc55f0b0587b695', label: 'round' },
      { value: '68e36dce1cc55f0b0587b686', label: 'Oval' },
      { value: '68e4998dc848309a6bea0674', label: 'Emerald' },
      { value: '68e499a2c848309a6bea067b', label: 'Cushion' },
      { value: '68e499b6c848309a6bea0682', label: 'Radiant' }
    ];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.price && formData.categoryId) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (mode === 'edit' && centerStoneData) {
        // Edit mode - send ID and data
        onSubmit({
          id: centerStoneData._id || centerStoneData.id,
          data: submitData
        });
      } else {
        // Add mode - send data only
        onSubmit(submitData);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      categoryId: '',
      status: 'active'
    });
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Center Stone' : 'Add New Center Stone';
  const subtitle = isEditMode ? 'Update center stone information' : 'Create a new center stone';
  const buttonText = isEditMode ? 'Update Center Stone' : 'Create Center Stone';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
              {isEditMode ? (
                <Gem className="w-5 h-5 text-white" />
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
                {typeof error === 'string' ? error : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the center stone`}
              </span>
            </div>
          )}

          {/* Center Stone Name */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Center Stone Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter center stone name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none
               focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
              required
              disabled={loading}
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Category *
              </label>
              <CustomDropdown
                options={getRingSubcategories()}
                value={formData.categoryId}
                onChange={handleCategoryChange}
                placeholder={categoriesLoading ? "Loading categories..." : "Select Category"}
                searchable={false}
                disabled={categoriesLoading}
              />
            </div>

            {/* Price */}
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
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Status *
            </label>
            <CustomDropdown
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              placeholder="Select Status"
              searchable={false}
              disabled={loading}
            />
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
              disabled={loading || !formData.name.trim() || !formData.price || !formData.categoryId}
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

export default CenterStoneModal;
