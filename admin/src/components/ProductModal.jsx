import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Save, AlertCircle, Plus, Upload, ChevronDown, Check, DollarSign } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import CustomDropdown from './CustomDropdown';
import MultiSelectDropdown from './MultiSelectDropdown';
import {
  CARE_OPTIONS,
  SHAPE_OPTIONS,
  COLOR_OPTIONS,
  CLARITY_OPTIONS,
  CERTIFICATE_OPTIONS,
  EMPTY_LEXICAL_STATE
} from '../constants';
import CustomCheckbox from '../../../Frontend/src/components/CustomCheckbox';
import FormInput from './FormInput';

function getSafeLexicalState(val) {
  // If it's already an object, convert it to string first
  if (typeof val === "object" && val !== null) {
    val = JSON.stringify(val);
  }

  if (typeof val === "string" && val.trim() && val !== "null") {
    try {
      const parsed = JSON.parse(val);
      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.root &&
        parsed.root.type === "root" &&
        Array.isArray(parsed.root.children) &&
        parsed.root.children.length > 0
      ) {
        return val;
      }
    } catch {
      // Invalid JSON, fall through to return empty
    }
  }
  return EMPTY_LEXICAL_STATE;
}

const ProductModal = ({ isOpen, onClose, onSubmit, loading, error, productData, mode = 'add', categories = [], metals = [], stones = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subDescription: '',
    price: '',
    quantity: '',
    categoryId: '',
    stoneTypeId: '',
    careInstruction: '',
    images: [],
    metalOptions: [],
    shape: '',
    color: '',
    clarity: [],
    certificate: [],
    isBand: false
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [careDropdownOpen, setCareDropdownOpen] = useState(false);
  const [metalOptionsOpen, setMetalOptionsOpen] = useState(false);
  const [stoneDropdownOpen, setStoneDropdownOpen] = useState(false);

  // Metals are now passed as props from Products page

  // Update form data when modal opens or productData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && productData) {
      // Process description once during initialization
      const processedDescription = getSafeLexicalState(productData.description);
      
      setFormData({
        title: productData.title || '',
        description: processedDescription,
        subDescription: productData.subDescription || '',
        price: productData.price?.toString() || '',
        quantity: productData.quantity?.toString() || '',
        categoryId: productData.category?._id || productData.categoryId || '',
        stoneTypeId: productData.stoneType?._id || productData.stoneTypeId || '',
        careInstruction: productData.careInstruction || '',
        images: [],
        metalOptions: productData.metals?.map(m => m._id) || [],
        shape: productData.shape || '',
        color: productData.color || '',
        clarity: Array.isArray(productData.clarity) ? productData.clarity : [],
        certificate: Array.isArray(productData.certificate) ? productData.certificate : [],
        isBand: productData.isBand !== undefined ? Boolean(productData.isBand) : false
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
    } else if (isOpen && mode === 'add') {
      // Reset form for add mode when modal opens
      setFormData({
        title: '',
        description: EMPTY_LEXICAL_STATE,
        subDescription: '',
        price: '',
        quantity: '',
        categoryId: '',
        stoneTypeId: '',
        careInstruction: '',
        images: [],
        metalOptions: [],
        shape: '',
        color: '',
        clarity: [],
        certificate: [],
        isBand: false
      });
      setImagePreviews([]);
      // Reset dropdowns
      setCategoryDropdownOpen(false);
      setCareDropdownOpen(false);
      setMetalOptionsOpen(false);
      setStoneDropdownOpen(false);
    }
  }, [isOpen, productData, mode]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownOpen && !event.target.closest('.category-dropdown-container')) {
        setCategoryDropdownOpen(false);
      }
      if (careDropdownOpen && !event.target.closest('.care-dropdown-container')) {
        setCareDropdownOpen(false);
      }
      if (metalOptionsOpen && !event.target.closest('.metal-options-container') && !event.target.closest('.metal-options-section')) {
        setMetalOptionsOpen(false);
      }
      if (stoneDropdownOpen && !event.target.closest('.stone-dropdown-container')) {
        setStoneDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownOpen, careDropdownOpen, metalOptionsOpen, stoneDropdownOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCareSelect = (care) => {
    setFormData(prev => ({ ...prev, careInstruction: care }));
    setCareDropdownOpen(false);
  };

  const toggleMetalOption = (metalId) => {
    // Only allow toggling active metals
    const metal = metals.find(m => m._id === metalId);
    if (!metal || !metal.active) return;
    
    setFormData(prev => ({
      ...prev,
      metalOptions: prev.metalOptions.includes(metalId)
        ? prev.metalOptions.filter(id => id !== metalId)
        : [...prev.metalOptions, metalId]
    }));
  };

  const calculateMetalPrice = (metalId, purityLevel) => {
    const metal = metals.find(m => m._id === metalId);
    if (!metal || !formData.price) return 0;
    // Use the provided purity level's price multiplier for calculation
    const multiplier = purityLevel ? purityLevel.priceMultiplier : 1;
    return (parseFloat(formData.price) * multiplier).toFixed(2);
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

  // Helper function to convert image URL to File object
  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      // Extract file extension from URL or use default
      const extension = url.split('.').pop().split('?')[0] || 'jpg';
      const file = new File([blob], filename || `image.${extension}`, { type: blob.type || 'image/jpeg' });
      return file;
    } catch (error) {
      console.error('Error converting URL to File:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.price && formData.quantity && formData.categoryId) {
      let allImages = []; // Will contain all images as File objects

      // In edit mode, convert existing images (that should be kept) to File objects
      if (mode === 'edit') {
        const existingPreviews = imagePreviews.filter(preview => preview.isExisting);
        if (existingPreviews.length > 0) {
          const existingImageFiles = await Promise.all(
            existingPreviews.map(async (preview, index) => {
              const file = await urlToFile(preview.url, `existing-image-${index}.jpg`);
              return file;
            })
          );
          // Filter out any null values (failed conversions)
          const validExistingFiles = existingImageFiles.filter(file => file !== null);
          allImages = [...validExistingFiles];
        }
      }

      // Add new images to the array
      allImages = [...allImages, ...formData.images];

      const submitData = {
        title: formData.title,
        description: formData.description,
        subDescription: formData.subDescription || '',
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId,
        metals: formData.metalOptions, // Map metalOptions to metalIds
        careInstruction: formData.careInstruction || '', // Use careInstruction directly
        images: allImages, // All images as binary files (existing converted + new, or empty array if all removed)
        shape: formData.shape || '',
        color: formData.color || '',
        clarity: formData.clarity.length > 0 ? JSON.stringify(formData.clarity) : undefined,
        certificate: formData.certificate.length > 0 ? JSON.stringify(formData.certificate) : undefined,
        stoneTypeId:formData.stoneTypeId,
        isBand: formData.isBand
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
      description: EMPTY_LEXICAL_STATE,
      subDescription: '',
      price: '',
      quantity: '',
      categoryId: '',
      stoneTypeId: '',
      careInstruction: '',
      images: [],
      metalOptions: [],
      shape: '',
      color: '',
      clarity: [],
      certificate: [],
      isBand: false
    });
    setImagePreviews([]);
    // Reset dropdowns
    setCategoryDropdownOpen(false);
    setCareDropdownOpen(false);
    setMetalOptionsOpen(false);
    setStoneDropdownOpen(false);
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <FormInput
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
              required
              disabled={loading}
              icon={Package}
            />
          </div>

          {/* Description - Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Product Description <span className="text-red-500">*</span>
            </label>
            {(mode === 'add' || (mode === 'edit' && formData.description)) && (
              <RichTextEditor
                key={`${mode}-${productData?._id || 'new'}`}
                value={formData.description}
                onChange={(contentJson) => setFormData(prev => ({ ...prev, description: contentJson }))}
                placeholder="Enter a detailed product description... (Use the toolbar to format text)"
                disabled={loading}
              />
            )}
            <p className="text-xs text-black-light font-montserrat-regular-400 mt-1">
              Use the toolbar above to format your text with bold, italic, lists, and more.
            </p>
          </div>

          {/* Sub Description */}
          <div className="space-y-2">
            <FormInput
              label="Sub Description"
              name="subDescription"
              value={formData.subDescription}
              onChange={handleInputChange}
              placeholder="Enter a brief sub description or tagline..."
              rows="3"
              textarea={true}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400 resize-none"
              disabled={loading}
            />
            
            <p className="text-xs text-black-light font-montserrat-regular-400">
              A short summary or tagline for the product (optional)
            </p>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormInput
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required={true}
                disabled={loading}
                icon={DollarSign}
                inputMode="number"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                required
                disabled={loading}
                icon={Package}
              />
            </div>
          </div>

          {/* Category - Beautiful Custom Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative category-dropdown-container">
              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`w-full px-4 py-3 border-2 rounded-lg text-left flex items-center justify-between transition-all duration-300 font-montserrat-regular-400
                  ${formData.categoryId 
                    ? 'border-primary bg-primary-light/10 text-black' 
                    : 'border-gray-200 text-black-light'
                  }
                  ${categoryDropdownOpen ? 'ring-1 ring-primary ring-opacity-20' : ''}
                  hover:border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                <span className={formData.categoryId ? 'text-black font-montserrat-medium-500' : 'text-black-light'}>
                  {formData.categoryId 
                    ? (() => {
                        const selected = categories.find(cat => cat._id === formData.categoryId);
                        if (!selected) return 'Select a category';
                        const parent = selected.parent 
                          ? categories.find(cat => cat._id === selected.parent._id)
                          : null;
                        return parent 
                          ? `${parent.name} → ${selected.name}`
                          : selected.name;
                      })()
                    : 'Select a category'
                  }
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-light rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                  <div className="py-2">
                    {/* Main Categories with Subcategories */}
                    {categories
                      .filter(cat => !cat.parent)
                      .map(parentCat => {
                        const subCategories = categories.filter(
                          sub => sub.parent?._id === parentCat._id
                        );
                        
                        return (
                          <div key={parentCat._id} className="mb-2 last:mb-0">
                            {/* Parent Category */}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, categoryId: parentCat._id }));
                                setCategoryDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group
                                ${formData.categoryId === parentCat._id
                                  ? 'bg-primary text-white font-montserrat-semibold-600'
                                  : 'hover:bg-primary-light text-black font-montserrat-medium-500'
                                }`}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full transition-all duration-200
                                  ${formData.categoryId === parentCat._id
                                    ? 'bg-white'
                                    : 'bg-primary group-hover:bg-primary-dark'
                                  }`}
                                />
                                <span>{parentCat.name}</span>
                              </div>
                              {subCategories.length > 0 && (
                                <span className={`text-xs px-2 py-1 rounded-full
                                  ${formData.categoryId === parentCat._id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-primary-light text-primary group-hover:bg-primary group-hover:text-white'
                                  }`}>
                                  {subCategories.length}
                                </span>
                              )}
                            </button>

                            {/* Subcategories */}
                            {subCategories.length > 0 && (
                              <div className="bg-secondary">
                                {subCategories.map(subCat => (
                                  <button
                                    key={subCat._id}
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, categoryId: subCat._id }));
                                      setCategoryDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 pl-10 text-left transition-all duration-200 flex items-center space-x-2 group
                                      ${formData.categoryId === subCat._id
                                        ? 'bg-primary-dark text-white font-montserrat-medium-500'
                                        : 'hover:bg-primary-light text-black-light font-montserrat-regular-400 hover:text-black'
                                      }`}
                                  >
                                    <div className="flex items-center space-x-2 flex-1">
                                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                                        ${formData.categoryId === subCat._id
                                          ? 'bg-white'
                                          : 'bg-primary-dark group-hover:bg-primary'
                                        }`}
                                      />
                                      <span>→</span>
                                      <span>{subCat.name}</span>
                                    </div>
                                    {formData.categoryId === subCat._id && (
                                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-primary-dark rounded-full"></div>
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    
                    {/* No Categories Message */}
                    {categories.length === 0 && (
                      <div className="px-4 py-3 text-center text-black-light font-montserrat-regular-400 text-sm">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stone Type - Optional Field */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Stone Type (Optional)
            </label>
            <div className="relative stone-dropdown-container">
              <button
                type="button"
                onClick={() => setStoneDropdownOpen(!stoneDropdownOpen)}
                className={`w-full px-4 py-3 border-2 rounded-lg text-left flex items-center justify-between transition-all duration-300 font-montserrat-regular-400
                  ${formData.stoneTypeId
                    ? 'border-primary bg-primary-light/10 text-black' 
                    : 'border-gray-200 text-black-light'
                  }
                  ${stoneDropdownOpen ? 'ring-1 ring-primary ring-opacity-20' : ''}
                  hover:border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                <span className={formData.stoneTypeId ? 'text-black font-montserrat-medium-500' : 'text-black-light'}>
                  {formData.stoneTypeId
                    ? stones.find(stone => stone._id === formData.stoneTypeId)?.name || 'Select stone type'
                    : 'Select stone type'
                  }
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                    stoneDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {stoneDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-light rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, stoneTypeId: '' });
                        setStoneDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group hover:bg-primary-light ${
                        !formData.stoneTypeId ? 'bg-primary-light' : ''
                      }`}
                    >
                      <span className="text-black font-montserrat-regular-400">None</span>
                      {!formData.stoneTypeId && <Check className="w-5 h-5 text-primary" />}
                    </button>
                    {stones.map((stone) => (
                      <button
                        key={stone._id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, stoneTypeId: stone._id });
                          setStoneDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group hover:bg-primary-light ${
                          formData.stoneTypeId === stone._id ? 'bg-primary-light' : ''
                        }`}
                      >
                        <span className="text-black font-montserrat-regular-400">{stone.name}</span>
                        {formData.stoneTypeId === stone._id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Care Instructions - Single Select Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Care Instructions
            </label>
            <div className="relative care-dropdown-container">
              <button
                type="button"
                onClick={() => setCareDropdownOpen(!careDropdownOpen)}
                className={`w-full px-4 py-3 border-2 rounded-lg text-left flex items-center justify-between transition-all duration-300 font-montserrat-regular-400
                  ${formData.careInstruction
                    ? 'border-primary bg-primary-light/10 text-black' 
                    : 'border-gray-200 text-black-light'
                  }
                  ${careDropdownOpen ? 'ring-1 ring-primary ring-opacity-20' : ''}
                  hover:border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                <span className={formData.careInstruction ? 'text-black font-montserrat-medium-500' : 'text-black-light'}>
                  {formData.careInstruction || 'Select care instructions'}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                    careDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {careDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-light rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  <div className="py-2">
                    {CARE_OPTIONS.map((care) => (
                      <button
                        key={care}
                        type="button"
                        onClick={() => handleCareSelect(care)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group
                          ${formData.careInstruction === care
                            ? 'bg-primary text-white font-montserrat-medium-500'
                            : 'hover:bg-primary-light text-black font-montserrat-regular-400'
                          }`}
                      >
                        <span>{care}</span>
                        {formData.careInstruction === care && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shape and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shape */}
            <div className="space-y-2">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Shape
              </label>
              <CustomDropdown
                options={SHAPE_OPTIONS}
                value={formData.shape}
                onChange={(value) => setFormData(prev => ({ ...prev, shape: value }))}
                placeholder="Select shape"
                disabled={loading}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Color
              </label>
              <CustomDropdown
                options={COLOR_OPTIONS}
                value={formData.color}
                onChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                placeholder="Select color"
                disabled={loading}
              />
            </div>
          </div>

          {/* Clarity - Multi-select */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Clarity
            </label>
            <MultiSelectDropdown
              options={CLARITY_OPTIONS}
              value={formData.clarity}
              onChange={(value) => setFormData(prev => ({ ...prev, clarity: value }))}
              placeholder="Select clarity options"
              disabled={loading}
            />
          </div>

          {/* Certificate - Multi-select */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Certificate
            </label>
            <MultiSelectDropdown
              options={CERTIFICATE_OPTIONS}
              value={formData.certificate}
              onChange={(value) => setFormData(prev => ({ ...prev, certificate: value }))}
              placeholder="Select certificate options"
              disabled={loading}
            />
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

          {/* Metal Options Section */}
          <div className="space-y-4 metal-options-section">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-montserrat-semibold-600 text-black">
                Metal Options & Pricing
              </h3>
              {/* <button
                type="button"
                onClick={() => setMetalOptionsOpen(!metalOptionsOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                <span className="text-sm font-montserrat-medium-500">
                  {metalOptionsOpen ? 'Hide Options' : 'Configure Metals'}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    metalOptionsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button> */}
            </div>

            {/* {metalOptionsOpen && ( */}
              <div className="space-y-6 p-4 bg-gray-50 rounded-xl border border-gray-200 metal-options-container">

                {/* Metal Options Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-montserrat-medium-500 text-black">
                    Available Metal Options
                  </h4>
                  {metals.filter(metal => metal.active).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-lg font-medium mb-2">No Active Metals Available</div>
                      <div className="text-sm">Please add or activate metal options in the Metals section</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {metals.filter(metal => metal.active).map((metal) => (
                      <div
                        key={metal._id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg group
                          ${formData.metalOptions.includes(metal._id)
                            ? 'border-primary bg-primary-light 1 ring-primary ring-opacity-30'
                            : 'border-gray-200 bg-white hover:border-primary-light'
                          }`}
                        onClick={() => toggleMetalOption(metal._id)}
                      >
                        {/* Metal Color Preview */}
                        <div 
                          className="w-full h-12 rounded-lg mb-3 border border-gray-200 relative flex items-center justify-center shadow-md"
                          style={{ backgroundColor: metal.color }}
                        >
                          <div className="font-montserrat-bold-700 text-lg text-black drop-shadow-sm capitalize">
                            {metal.name}
                          </div>
                        </div>
                        
                        {/* Metal Info */}
                        <div className="text-center mb-3">
                          <div className="font-montserrat-semibold-600 text-black text-sm leading-tight capitalize">
                            {metal.name}
                          </div>
                          <div className="text-xs font-montserrat-medium-500 text-black-light mt-1">
                            {metal.purityLevels && metal.purityLevels.length > 0 && (
                              <span>{metal.purityLevels.filter(pl => pl.active !== false).map(pl => `${pl.karat}K`).join(', ')}</span>
                            )}
                          </div>
                        </div>

                        {/* Price Display */}
                        {formData.price && metal.purityLevels && metal.purityLevels.length > 0 && (
                          <div className="text-center space-y-1">
                            <div className="text-xs font-montserrat-regular-400 text-black-light">
                              Prices:
                            </div>
                            {metal.purityLevels.filter(pl => pl.active !== false).map((pl, idx) => (
                              <div key={pl._id || idx} className="text-xs font-montserrat-semibold-600 text-black">
                                {pl.karat}K: ${calculateMetalPrice(metal._id, pl)}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {formData.metalOptions.includes(metal._id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  )}
                </div>

                {/* Selected Metals Summary */}
                {formData.metalOptions.length > 0 && (
                  <div className="bg-primary-light rounded-lg p-4 border border-primary border-opacity-20">
                    <h4 className="text-sm font-montserrat-semibold-600 text-black mb-3">
                      Selected Metal Options ({formData.metalOptions.filter(metalId => {
                        const metal = metals.find(m => m._id === metalId);
                        return metal && metal.active;
                      }).length})
                    </h4>
                    <div className="space-y-3">
                      {formData.metalOptions.map(metalId => {
                        const metal = metals.find(m => m._id === metalId);
                        // Only show active metals in the summary
                        if (!metal || !metal.active) return null;
                        return (
                          <div key={metalId} className="bg-white rounded-lg p-3 border border-white">
                            <div className="flex items-center space-x-3 mb-2">
                              <div 
                                className="w-8 h-8 rounded-lg border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: metal.color }}
                              ></div>
                              <div className="font-montserrat-medium-500 text-black text-sm capitalize">
                                {metal.name}
                              </div>
                            </div>
                            {metal.purityLevels && metal.purityLevels.length > 0 && (
                              <div className="space-y-1 pl-11">
                                {metal.purityLevels.filter(pl => pl.active !== false).map((pl, idx) => (
                                  <div key={pl._id || idx} className="flex items-center justify-between text-xs">
                                    <span className="font-montserrat-regular-400 text-black-light">
                                      {pl.karat}K (x{pl.priceMultiplier})
                                    </span>
                                    {formData.price && (
                                      <span className="font-montserrat-semibold-600 text-primary">
                                        ${calculateMetalPrice(metalId, pl)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            {/* )} */}
          </div>

          {/* Is Band Checkbox */}
          <div className="space-y-2">
            <CustomCheckbox
              checked={formData.isBand}
              onChange={(e) => setFormData(prev => ({ ...prev, isBand: e.target.checked }))}
              label="Is Band"
              name="isBand"
              id="isBand"
              disabled={loading}
            />
            <p className="text-xs text-black-light font-montserrat-regular-400">
              Check this if the product is a band (optional)
            </p>
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
