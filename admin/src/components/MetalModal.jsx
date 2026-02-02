import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle, Edit2, Check,PaintBucket,Zap} from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import CustomCheckbox from '../../../Frontend/src/components/CustomCheckbox';
import { METAL_COLOR_OPTIONS, KARAT_OPTIONS, calculateCumulativePriceMultiplier } from '../constants';
import FormInput from './FormInput';

// Use constants from constants file
const colorOptions = METAL_COLOR_OPTIONS;
const karatOptions = KARAT_OPTIONS;

const MetalModal = ({ isOpen, onClose, onSubmit, loading, error, metalData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    colorName: '',
    purityLevels: [],
    active: true
  });
  
  const [newPurityLevel, setNewPurityLevel] = useState({
    karat: '',
    priceMultiplier: 1,
    active: true
  });
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPurityLevel, setEditPurityLevel] = useState({
    karat: '',
    priceMultiplier: 1,
    active: true
  });

  // Helper function to calculate cumulative multiplier for display
  // Uses the shared calculateCumulativePriceMultiplier function
  const calculateCumulativeMultiplier = (targetKarat) => {
    // Create a metal-like object from formData for the shared function
    const metalObject = {
      purityLevels: formData.purityLevels || []
    };
    return calculateCumulativePriceMultiplier(metalObject, targetKarat);
  };

  // Update form data when modal opens or metalData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && metalData) {
      // Find the color option that matches the hex code or name
      const colorOption = colorOptions.find(opt => 
        opt.value === metalData.color || opt.colorName === metalData.color
      );
      
      setFormData({
        name: metalData.name || '',
        color: colorOption?.value || metalData.color || '',
        colorName: colorOption?.colorName || '',
        purityLevels: metalData.purityLevels || [],
        active: metalData.active !== undefined ? metalData.active : true
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        name: '',
        color: '',
        colorName: '',
        purityLevels: [],
        active: true
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

  const handleColorSelect = (e) => {
    const value = e.target.value; // ✅ FIX
    
    const selectedColor = colorOptions?.find(opt => opt.value === value);

    setFormData(prev => ({
      ...prev,
      color: value,
      colorName: selectedColor?.colorName || ''
    }));
  };

  const handleAddPurityLevel = () => {
    if (newPurityLevel.karat && newPurityLevel.priceMultiplier) {
      setFormData(prev => ({
        ...prev,
        purityLevels: [...prev.purityLevels, { ...newPurityLevel }]
      }));
      setNewPurityLevel({ karat: '', priceMultiplier: 1, active: true });
    }
  };

  const handleRemovePurityLevel = (index) => {
    setFormData(prev => ({
      ...prev,
      purityLevels: prev.purityLevels.filter((_, i) => i !== index)
    }));
  };

  const handleStartEdit = (index) => {
    const level = formData.purityLevels[index];
    setEditingIndex(index);
    setEditPurityLevel({
      karat: level.karat,
      priceMultiplier: level.priceMultiplier,
      active: level.active !== undefined ? level.active : true
    });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editPurityLevel.karat && editPurityLevel.priceMultiplier) {
      setFormData(prev => ({
        ...prev,
        purityLevels: prev.purityLevels.map((level, index) => 
          index === editingIndex ? { ...editPurityLevel } : level
        )
      }));
      setEditingIndex(null);
      setEditPurityLevel({ karat: '', priceMultiplier: 1, active: true });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditPurityLevel({ karat: '', priceMultiplier: 1, active: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (formData.name && formData.color && formData.purityLevels.length > 0) {
      onSubmit({
        ...formData,
        purityLevels: formData.purityLevels.map(level => ({
          karat: Number(level.karat),
          priceMultiplier: Number(level.priceMultiplier),
          active: level.active !== undefined ? level.active : true
        }))
      });
    }
    
    return false;
  };

  const handleClose = () => {
    setFormData({
      name: '',
      color: '',
      colorName: '',
      purityLevels: [],
      active: true
    });
    setNewPurityLevel({ karat: '', priceMultiplier: 1, active: true });
    setEditingIndex(null);
    setEditPurityLevel({ karat: '', priceMultiplier: 1, active: true });
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Metal' : 'Add New Metal';
  const subtitle = isEditMode ? 'Update metal information' : 'Create a new metal option';
  const buttonText = isEditMode ? 'Update Metal' : 'Create Metal';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto" style={{ zIndex: 999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
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


          {/* Metal Name */}
          <div className="space-y-2">
            <FormInput
              label="Metal Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Gold, Silver, Platinum"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
              disabled={loading}
              icon={Zap}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <FormInput
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleColorSelect}
              placeholder="Select color"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
              disabled={loading}
              icon={PaintBucket}
            />
          </div>

          {/* Purity Levels */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Purity Levels <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Existing Purity Levels */}
              {formData.purityLevels.map((level, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {editingIndex === index ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row  sm:items-flex-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CustomDropdown
                            options={karatOptions}
                            value={editPurityLevel.karat}
                            onChange={(value) => setEditPurityLevel(prev => ({ ...prev, karat: value }))}
                            placeholder="Select Carat"
                            disabled={loading}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="space-y-1">
                            <input
                              type="number"
                              placeholder="Price Multiplier"
                              value={editPurityLevel.priceMultiplier}
                              onChange={(e) => setEditPurityLevel(prev => ({ ...prev, priceMultiplier: e.target.value }))}
                              step="0.01"
                              min="0.01"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary"
                              disabled={loading}
                            />
                            <p className="text-xs text-gray-500">
                              Multiplier (e.g., 1.15 = +15% from previous level)
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-10 h-10"
                            disabled={loading}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-10 h-10"
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Active Checkbox for Edit Mode */}
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                        <CustomCheckbox
                          checked={editPurityLevel.active}
                          onChange={(e) => setEditPurityLevel(prev => ({ ...prev, active: e.target.checked }))}
                          label="Active"
                          name={`edit-purity-active-${index}`}
                          id={`edit-purity-active-${index}`}
                          disabled={loading}
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          editPurityLevel.active 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {editPurityLevel.active ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">{level.karat}K</span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          (Multiplier: {level.priceMultiplier} = +{((level.priceMultiplier - 1) * 100).toFixed(0)}%)
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (level.active !== undefined ? level.active : true)
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {(level.active !== undefined ? level.active : true) ? 'Active' : 'Inactive'}
                        </span>
                        <div className="ml-auto flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(index)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePurityLevel(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                        Cumulative multiplier: {calculateCumulativeMultiplier(level.karat).toFixed(2)} 
                        (e.g., base price × {calculateCumulativeMultiplier(level.karat).toFixed(2)})
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add New Purity Level */}
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row  sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CustomDropdown
                      options={karatOptions}
                      value={newPurityLevel.karat}
                      onChange={(value) => setNewPurityLevel(prev => ({ ...prev, karat: value }))}
                      placeholder="Select Carat"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                      <input
                        type="number"
                        placeholder="Price Multiplier"
                        value={newPurityLevel.priceMultiplier}
                        onChange={(e) => setNewPurityLevel(prev => ({ ...prev, priceMultiplier: e.target.value }))}
                        step="0.01"
                        min="0.01"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500">
                        Multiplier (e.g., 1.15 = +15% from previous level)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPurityLevel}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
                {/* Active Checkbox for Add Mode */}
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                  <CustomCheckbox
                    checked={newPurityLevel.active}
                    onChange={(e) => setNewPurityLevel(prev => ({ ...prev, active: e.target.checked }))}
                    label="Active"
                    name="new-purity-active"
                    id="new-purity-active"
                    disabled={loading}
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    newPurityLevel.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {newPurityLevel.active ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Status
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={loading}
                    />
                    <div className={`w-16 h-7 rounded-full transition-all duration-300 ease-in-out shadow-inner ${
                      formData.active 
                        ? 'bg-primary shadow-primary-darks' 
                        : 'bg-gray-300 shadow-gray-200'
                    } group-hover:shadow-md`}>
                      <div className={`w-7 h-7 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
                        formData.active 
                          ? 'translate-x-8' 
                          : 'translate-x-1'
                      } mt-1 flex items-center justify-center`}>
                        {formData.active && (
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {!formData.active && (
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                      formData.active ? 'text-primary' : 'text-gray-600'
                    }`}>
                      {formData.active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {formData.active 
                        ? 'Available for product selection' 
                        : 'Hidden from product selection'
                      }
                    </div>
                  </div>
                </label>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                formData.active 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {formData.active ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.color || formData.purityLevels.length === 0}
              className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r ${iconColor} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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

