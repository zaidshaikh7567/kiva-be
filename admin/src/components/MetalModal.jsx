import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const MetalModal = ({ isOpen, onClose, onSubmit, loading, error, metalData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    carat: '',
    color: '',
    priceMultiplier: 1,
    gradient: 'from-gray-200 to-gray-300',
    borderColor: 'border-gray-200',
    backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
    isActive: true
  });
  
  console.log('formData MODAL :', formData);

  // Color options
  const colorOptions = [
    { value: 'white', label: 'White Gold',  gradient: 'from-gray-200 to-gray-300', backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)' },
    { value: 'yellow', label: 'Yellow Gold', gradient: 'from-yellow-50 to-yellow-100', backgroundColor: 'linear-gradient(to right, #fffbeb, #fefce8)' },
    { value: 'rose', label: 'Rose Gold', gradient: 'from-pink-50 to-pink-100', backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)' },
    // { value: 'platinum', label: 'Platinum', gradient: 'from-gray-100 to-gray-200', backgroundColor: 'linear-gradient(to right, #f3f4f6, #e5e7eb)' },
  ];

  // Carat options
  const caratOptions = [
    { value: '10k', label: '10K' },
    { value: '14k', label: '14K' },
    { value: '18k', label: '18K' },
    { value: '22k', label: '22K' },
  ];

  // Update form data when modal opens or metalData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && metalData) {
      setFormData({
        carat: metalData.carat || '',
        color: metalData.color || '',
        priceMultiplier: metalData.priceMultiplier || 1,
        gradient: metalData.gradient || 'from-gray-200 to-gray-300',
        borderColor: metalData.borderColor || 'border-gray-200',
        backgroundColor: metalData.backgroundColor || 'linear-gradient(to right, #e5e7eb, #d1d5db)',
        isActive: metalData.isActive !== undefined ? metalData.isActive : true
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        carat: '',
        color: '',
        priceMultiplier: 1,
        gradient: 'from-gray-200 to-gray-300',
        borderColor: 'border-gray-200',
        backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
        isActive: true
      });
    }
  }, [isOpen, metalData, mode]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorSelect = (value) => {
    console.log('Color selected:', value);
    const selectedColor = colorOptions.find(option => option.value === value);
    setFormData(prev => ({
      ...prev,
      color: value,
      gradient: selectedColor.gradient,
      backgroundColor: selectedColor.backgroundColor
    }));
  };

  const handleCaratSelect = (value) => {
    console.log('Carat selected:', value);
    setFormData(prev => ({ ...prev, carat: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent any form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (formData.carat && formData.color && formData.priceMultiplier) {
      onSubmit({
        ...formData,
        priceMultiplier: parseFloat(formData.priceMultiplier)
      });
    }
    
    return false;
  };

  const handleClose = () => {
    setFormData({
      carat: '',
      color: '',
      priceMultiplier: 1,
      gradient: 'from-gray-200 to-gray-300',
      borderColor: 'border-gray-200',
      backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
      isActive: true
    });
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Metal' : 'Add New Metal';
  const subtitle = isEditMode ? 'Update metal information' : 'Create a new metal option';
  const buttonText = isEditMode ? 'Update Metal' : 'Create Metal';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${iconColor} flex items-center justify-center`}>
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
              e.preventDefault();
            }
          }}
          className="p-6 space-y-6" 
          noValidate
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {typeof error === 'string' ? error : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the metal`}
              </span>
            </div>
          )}


          {/* Carat and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Carat *
              </label>
              <CustomDropdown
                options={caratOptions}
                value={formData.carat}
                onChange={handleCaratSelect}
                placeholder="Select carat"
                disabled={loading}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Color *
              </label>
              <CustomDropdown
                options={colorOptions}
                value={formData.color}
                onChange={handleColorSelect}
                placeholder="Select color"
                disabled={loading}
              />
            </div>
          </div>

          {/* Price Multiplier */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Multiplier *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="priceMultiplier"
                value={formData.priceMultiplier}
                onChange={handleInputChange}
                placeholder="1.0"
                step="0.1"
                min="0.1"
                max="10"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
              <div className="text-sm text-gray-500">
                {(formData.priceMultiplier * 100).toFixed(0)}% markup
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter a multiplier for pricing (e.g., 1.2 = 20% markup, 1.5 = 50% markup)
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Preview
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${formData.gradient} border border-gray-200 relative flex items-center justify-center shadow-md`}
                  style={{ background: formData.backgroundColor }}
                >
                  <div className="font-bold text-lg text-gray-800 drop-shadow-sm">
                    {formData.carat || 'K'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {formData.carat && formData.color ? `${formData.carat} ${colorOptions.find(c => c.value === formData.color)?.label || formData.color}` : 'Select carat and color'}
                  </div>
                  <div className="text-sm text-primary font-medium">
                    +{((formData.priceMultiplier - 1) * 100).toFixed(0)}% price
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Status
            </label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={loading}
                    />
                    <div className={`w-16 h-7 rounded-full transition-all duration-300 ease-in-out shadow-inner ${
                      formData.isActive 
                        ? 'bg-primary shadow-primary-darks' 
                        : 'bg-gray-300 shadow-gray-200'
                    } group-hover:shadow-md`}>
                      <div className={`w-7 h-7 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
                        formData.isActive 
                          ? 'translate-x-8' 
                          : 'translate-x-1'
                      } mt-1 flex items-center justify-center`}>
                        {formData.isActive && (
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {!formData.isActive && (
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`text-base font-semibold transition-colors duration-200 ${
                      formData.isActive ? 'text-primary' : 'text-gray-600'
                    }`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.isActive 
                        ? 'Available for product selection' 
                        : 'Hidden from product selection'
                      }
                    </div>
                  </div>
                </label>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.isActive 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {formData.isActive ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.carat || !formData.color || !formData.priceMultiplier}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${iconColor} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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

export default MetalModal;
