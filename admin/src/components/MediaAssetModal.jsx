import React, { useEffect, useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import FormInput from './FormInput';
import CustomCheckbox from '../../../Frontend/src/components/CustomCheckbox';
import { PAGE_OPTIONS, TYPE_FILTER_OPTIONS } from '../constants';
import { createPortal } from 'react-dom';

const MediaAssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData = null,
  mode = 'add',
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    page: 'home',
    section: '',
    key: '',
    type: 'image',
    isActive: true,
    sortOrder: '',
    file: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        page: initialData.page || 'home',
        section: initialData.section || '',
        key: initialData.key || '',
        type: initialData.type || 'image',
        isActive: initialData.isActive ?? true,
        sortOrder:
          initialData.sortOrder !== undefined && initialData.sortOrder !== null
            ? String(initialData.sortOrder)
            : '',
        file: null,
      });
    } else {
      setForm({
        title: '',
        description: '',
        page: 'home',
        section: '',
        key: '',
        type: 'image',
        isActive: true,
        sortOrder: '',
        file: null,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('file', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      sortOrder:
        form.sortOrder === '' || form.sortOrder === null
          ? undefined
          : Number(form.sortOrder),
    };
    onSubmit(payload);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  p-4" style={{ zIndex: 999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-sorts-mill-gloudy font-bold text-black">
              {mode === 'add' ? 'Add Media Asset' : 'Edit Media Asset'}
            </h2>
            <p className="text-sm font-montserrat-regular-400 text-black-light">
              Upload images or videos for your site sections
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto sm:px-6 px-4 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Page
              </label>
              <CustomDropdown
                options={PAGE_OPTIONS}
                value={form.page}
                onChange={(val) => handleChange('page', val)}
                placeholder="Select page"
              />
            </div>

            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Section (e.g. hero, contact-banner)
              </label>
              <FormInput
                type="text"
                value={form.section}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="Section identifier"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Key (optional, for specific slot)
              </label>
              <FormInput
                type="text"
                value={form.key}
                onChange={(e) => handleChange('key', e.target.value)}
                placeholder="e.g. mainHeroImage"
              />
            </div> */}

            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Type
              </label>
              <CustomDropdown
                options={TYPE_FILTER_OPTIONS}
                value={form.type}
                onChange={(val) => handleChange('type', val)}
                placeholder="Select type"
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Title
              </label>
              <FormInput
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Optional title / label"
              />
            </div>

            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Sort Order
              </label>
              <FormInput
                type="number"
                value={form.sortOrder}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                placeholder="0"
              />
            </div>
          </div> */}

          {/* <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-montserrat-regular-400 text-black outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[80px]"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Short description (optional)"
            />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                File
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 cursor-pointer hover:border-primary hover:bg-primary-light/20 transition-colors">
                <UploadCloud className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-montserrat-medium-500 text-black">
                  Click to upload
                </span>
                <span className="text-xs font-montserrat-regular-400 text-black-light mt-1">
                  JPG, PNG, WEBP, MP4, MOV (max 20MB)
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
              {form.file && (
                <p className="mt-2 text-xs font-montserrat-regular-400 text-black-light truncate">
                  Selected: {form.file.name}
                </p>
              )}
            </div>

            {initialData?.url && (
              <div className="space-y-2">
                <p className="text-sm font-montserrat-medium-500 text-black">
                  Current Preview
                </p>
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {initialData.type === 'video' ? (
                    <video
                      src={initialData.url}
                      controls
                      className="w-full max-h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={initialData.url}
                      alt={initialData.title || 'Media'}
                      className="w-full max-h-48 object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row  justify-between pt-4 border-t border-gray-100 mt-2">
            <div> 
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <CustomCheckbox   
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                label="Active"
                name="isActive"
                id="isActive"
              />
            </label>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 text-sm font-montserrat-medium-500 text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-montserrat-medium-500 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Add Media' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default MediaAssetModal;


