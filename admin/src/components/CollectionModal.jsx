import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle, Plus, Upload, Image as ImageIcon, Video, Images } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import CustomCheckbox from '../../../Frontend/src/components/CustomCheckbox';
import FormInput from './FormInput';

const CollectionModal = ({ isOpen, onClose, onSubmit, loading, error, collectionData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    video: '',
    isNew: false,
    isActive: true,
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [videoInputType, setVideoInputType] = useState('url'); // 'url' or 'file'

  // Category options - you can update these based on your needs
  const categoryOptions = [
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' },
  ];

  // Update form data when modal opens or collectionData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && collectionData) {
      setFormData({
        title: collectionData.title || '',
        category: collectionData.category || '',
        video: collectionData.video || '',
        isNew: collectionData.isNew !== undefined ? collectionData.isNew : false,
        isActive: collectionData.isActive !== undefined ? collectionData.isActive : true,
        images: []
      });
      // Set existing image previews if available
      if (collectionData.images && collectionData.images.length > 0) {
        setImagePreviews(collectionData.images.map(img => ({
          url: typeof img === 'string' ? img : img.url || img,
          isExisting: true
        })));
      } else {
        setImagePreviews([]);
      }
      // Set existing video preview if available
      if (collectionData.video) {
        setVideoPreview(collectionData.video);
        setVideoInputType('url');
      } else {
        setVideoPreview(null);
      }
      setVideoFile(null);
    } else if (isOpen && mode === 'add') {
      // Reset form for add mode when modal opens
      setFormData({
        title: '',
        category: '',
        video: '',
        isNew: false,
        isActive: true,
        images: []
      });
      setImagePreviews([]);
      setDragActive(false);
      setVideoFile(null);
      setVideoPreview(null);
      setVideoInputType('url');
    }
  }, [isOpen, collectionData, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const addImages = (files) => {
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

  // Video upload handlers
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const processVideoFile = (file) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    setVideoFile(file);
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
    setFormData(prev => ({
      ...prev,
      video: videoURL // Temporary URL for preview, will be replaced with file on submit
    }));
  };

  // Video drag and drop handlers
  const handleVideoDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVideoDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(true);
  };

  const handleVideoDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processVideoFile(file);
    }
  };

  const removeVideo = () => {
    if (videoPreview && videoFile) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setFormData(prev => ({
      ...prev,
      video: ''
    }));
  };

  const removeImage = (index) => {
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
    const videoValue = videoInputType === 'file' && videoFile ? videoFile : formData.video;
    
    if (formData.category) {
      const submitData = {
        title: formData.title,
        category: formData.category,
        isNew: formData.isNew,
        isActive: formData.isActive,
        images: formData.images
      };

      // If video is a file, add it separately
      // if i delete the video, then videoValue will be empty string
      // if (videoValue !== '' && videoValue !== null) {
        submitData.video = videoValue;
      // }
      
      if (videoInputType === 'file' && videoFile) {
        submitData.videoFile = videoFile;
      }

      if (mode === 'edit' && collectionData) {
        onSubmit({
          id: collectionData._id || collectionData.id,
          data: submitData
        });
      } else {
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

    // Clean up video URL
    if (videoPreview && videoFile) {
      URL.revokeObjectURL(videoPreview);
    }

    setFormData({
      title: '',
      category: '',
      video: '',
      isNew: false,
      isActive: true,
      images: []
    });
    setImagePreviews([]);
    setDragActive(false);
    setVideoFile(null);
    setVideoPreview(null);
    setVideoInputType('url');
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Collection' : 'Add New Collection';
  const subtitle = isEditMode ? 'Update collection information' : 'Create a new collection';
  const buttonText = isEditMode ? 'Update Collection' : 'Create Collection';
  const iconColor = isEditMode ? 'from-blue-500 to-blue-600' : 'from-primary to-primary-dark';

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
              {isEditMode ? (
                <Video className="w-5 h-5 text-white" />
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
                {typeof error === 'string' ? error : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the collection`}
              </span>
            </div>
          )}

          {/* Collection Title */}
          <div className="space-y-2">          
            <FormInput
            label="Collection Title (Optional)"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Youth Collection"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
            disabled={loading}
            inputMode="text"
            error={error}
            icon={Images}
          />
          
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Category <span className="text-red-500">*</span>
            </label>
            <CustomDropdown
              options={categoryOptions}
              value={formData.category}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              disabled={loading}
            />
          </div>

          {/* Video Upload/URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-montserrat-medium-500 text-black">
                Video (Optional) 
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setVideoInputType('url');
                    setVideoFile(null);
                    setVideoPreview(null);
                    setFormData(prev => ({ ...prev, video: '' }));
                  }}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    videoInputType === 'url'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoInputType('file');
                    setFormData(prev => ({ ...prev, video: '' }));
                  }}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    videoInputType === 'file'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>

            {videoInputType === 'url' ? (
              <div>
                <input
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
                  // required={!videoFile}
                  disabled={loading}
                />
                <p className="text-xs text-black-light font-montserrat-regular-400 mt-1">
                  Enter the full video URL
                </p>
              </div>
            ) : (
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    videoDragActive
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleVideoDragIn}
                  onDragLeave={handleVideoDragOut}
                  onDragOver={handleVideoDrag}
                  onDrop={handleVideoDrop}
                >
                  <input
                    type="file"
                    id="collection-video"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="collection-video"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Video className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-montserrat-medium-500 text-black mb-1">
                      Click to upload or drag and drop video
                    </p>
                    <p className="text-xs font-montserrat-regular-400 text-black-light">
                      MP4, MOV, AVI up to 50MB
                    </p>
                  </label>
                </div>

                {/* Video Preview */}
                {videoPreview && (
                  <div className="mt-4 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 rounded-lg border border-gray-200 bg-black"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                      title="Remove video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {videoFile && (
                      <p className="text-xs text-black-light font-montserrat-regular-400 mt-2">
                        File: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-montserrat-medium-500 text-black">
              Images (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="collection-images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="collection-images"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-montserrat-medium-500 text-black mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs font-montserrat-regular-400 text-black-light">
                  PNG, JPG, WEBP up to 2MB each
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-flow-cols-1 sm:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
                <CustomCheckbox
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  label="Mark as New"
                  name="isNew"
                  id="isNew"
                />
              
            </div>
            {/* <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={loading}
              />
              <label htmlFor="isActive" className="text-sm font-montserrat-medium-500 text-black">
                Active
              </label>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="block sm:flex items-center justify-end pt-4 border-t border-gray-200">
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
              disabled={loading || !formData.category }
              className={`flex sm:ml-2 sm:mt-0 mt-2  sm:w-auto w-full items-center space-x-2 px-6 py-3 bg-gradient-to-r ${iconColor} text-white rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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

export default CollectionModal;
