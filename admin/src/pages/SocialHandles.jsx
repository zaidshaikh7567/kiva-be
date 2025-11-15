import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, RefreshCw, Link2, Share2, Calendar } from 'lucide-react';
import { fetchSocialHandles, createSocialHandle, updateSocialHandle, deleteSocialHandle, selectSocialHandles, selectSocialHandlesLoading, selectSocialHandlesPagination } from '../store/slices/socialHandlesSlice';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import CustomDropdown from '../components/CustomDropdown';
import CustomCheckbox from '../../../Frontend/src/components/CustomCheckbox';
import Pagination from '../components/Pagination';

const PLATFORM_OPTIONS = ['Instagram', 'Facebook'];

const SocialHandleModal = ({ isOpen, onClose, onSubmit, loading, data, mode }) => {
  const [preview, setPreview] = useState(data?.image || '');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(data?.url || '');
  const [platform, setPlatform] = useState(data?.platform || PLATFORM_OPTIONS[0]);
  const [isActive, setIsActive] = useState(mode === 'edit' ?Boolean(data?.isActive) : true);

  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(f);
  };

  useEffect(() => {
    if (isOpen) {
      setPreview(data?.image || '');
      setFile(null);
      setUrl(data?.url || '');
      setPlatform(data?.platform || PLATFORM_OPTIONS[0]);
      setIsActive(mode === 'edit' ? Boolean(data?.isActive) : true);
    }
  }, [isOpen, data]);


    useEffect(() => {
      if(isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }, [isOpen]);
    
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 mx-2">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-w-xl bg-white rounded-2xl p-6 mt-16 shadow-xl">
        <h3 className="text-xl font-sorts-mill-gloudy text-black mb-4">{mode === 'edit' ? 'Edit Social Handle' : 'Add Social Handle'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">Image</label>
            {preview && (
              <div className="mb-3 w-full h-40 border rounded-xl overflow-hidden bg-gray-50">
                <img alt="preview" src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)} className="w-full h-full object-cover" />
              </div>
            )}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isDragging ? 'border-primary bg-primary-light/20' : 'border-gray-300 bg-gray-50'}`}
              onClick={() => document.getElementById('social-image-input')?.click()}
            >
              <p className="text-sm font-montserrat-regular-400 text-black-light">Drag & drop image here, or click to browse</p>
              <input id="social-image-input" type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-1">Platform</label>
            <CustomDropdown
              options={PLATFORM_OPTIONS.map(p => ({ label: p, value: p }))}
              value={platform}
              onChange={setPlatform}
              placeholder="Select platform"
            />
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-1">URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <label className="inline-flex items-center space-x-2">
            <CustomCheckbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              label="Active"
              name="isActive"
              id="isActive"
            />
          </label>
          <div className="flex justify-end space-x-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button disabled={loading} onClick={() => onSubmit({ image: file, url, platform, isActive })} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialHandles = () => {
  const dispatch = useDispatch();
  const socialItems = useSelector(selectSocialHandles);
  const loading = useSelector(selectSocialHandlesLoading);
  const pagination = useSelector(selectSocialHandlesPagination);

  // Pagination state
  const currentPage = pagination?.currentPage || 1;
  const limit = pagination?.limit || 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [current, setCurrent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Fetch social handles from API
  useEffect(() => {
    dispatch(fetchSocialHandles({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const openAdd = () => { setMode('add'); setCurrent(null); setIsModalOpen(true); };
  const openEdit = (item) => { setMode('edit'); setCurrent(item); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setCurrent(null); setMode('add'); };

  const submit = async (data) => {
    if (mode === 'add') {
      const res = await dispatch(createSocialHandle(data));
      if (createSocialHandle.fulfilled.match(res)) {
        closeModal();
        // Refresh the list after create
        dispatch(fetchSocialHandles({ page: currentPage, limit }));
      }
    } else {
      const res = await dispatch(updateSocialHandle({ id: current._id ,data }));
      if (updateSocialHandle.fulfilled.match(res)) {
        closeModal();
        // Refresh the list after update
        dispatch(fetchSocialHandles({ page: currentPage, limit }));
      }
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await dispatch(deleteSocialHandle(toDelete._id || toDelete.id));
    if (deleteSocialHandle.fulfilled.match(res)) { 
      setIsDeleteModalOpen(false); 
      setToDelete(null);
      // Refresh the list after delete
      dispatch(fetchSocialHandles({ page: currentPage, limit }));
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchSocialHandles({ page, limit }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-end gap-2">
        <button onClick={() => dispatch(fetchSocialHandles({ page: currentPage, limit }))} disabled={loading} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Social Handle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {socialItems?.map((item) => (
          <div key={item._id || item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-40 bg-gray-50 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.platform || 'social'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400"><Share2 className="w-8 h-8" /></div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-montserrat-semibold-600 capitalize">{item.platform || 'Social'}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-black-light break-all">
                <Link2 className="w-4 h-4 mr-1" /> {item.url}
              </a>
              <div className="flex flex-col space-y-1 pt-2">
                <div className="flex items-center space-x-1 text-xs text-black-light">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-black-light">
                  <Calendar className="w-3 h-3" />
                  <span>Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => { setIsDeleteModalOpen(true); setToDelete(item); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalRecords}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      <SocialHandleModal
        key={`${mode}-${current?._id || current?.id || 'new'}`}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submit}
        loading={loading}
        data={current}
        mode={mode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setToDelete(null); }}
        onConfirm={confirmDelete}
        loading={loading}
        title="Delete Social Handle"
        message="Are you sure you want to delete this social handle?"
        itemName={toDelete?.platform || toDelete?.url}
        itemType="social handle"
      />
    </div>
  );
};

export default SocialHandles;


