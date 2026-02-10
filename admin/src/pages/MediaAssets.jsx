import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Image as ImageIcon,
  Video,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Search,
} from 'lucide-react';
import {
  fetchMediaAssets,
  deleteMediaAsset,
  updateMediaAsset,
  selectMediaAssets,
  selectMediaAssetsLoading,
  selectMediaAssetsFilters,
  setMediaFilters,
  createMediaAsset,
} from '../store/slices/mediaAssetsSlice';
import CustomDropdown from '../components/CustomDropdown';
import FormInput from '../components/FormInput';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import MediaAssetModal from '../components/MediaAssetModal';
import { PAGE_OPTIONS, TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants';

const MediaAssets = () => {
  const dispatch = useDispatch();
  const media = useSelector(selectMediaAssets);
  const loading = useSelector(selectMediaAssetsLoading);
  const filters = useSelector(selectMediaAssetsFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMediaAssets(filters));
  }, [dispatch, filters.page, filters.section, filters.type, filters.isActive]);

  const handleRefresh = () => {
    dispatch(fetchMediaAssets(filters));
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedMedia(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setModalMode('add');
  };

  const handleSubmitMedia = async (data) => {
    if (modalMode === 'add') {
      const response = await dispatch(createMediaAsset(data));
      if (createMediaAsset.fulfilled.match(response)) {
        handleCloseModal();
      } 
    } else if (selectedMedia) { 
      const response = await dispatch(updateMediaAsset({ id: selectedMedia._id, data }));
      if (updateMediaAsset.fulfilled.match(response)) {
        handleCloseModal();
      }
    }
  };

  const handleDeleteClick = async (item) => {
    setMediaToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (mediaToDelete) {
      await dispatch(deleteMediaAsset(mediaToDelete._id));
      setIsDeleteModalOpen(false);
      setMediaToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMediaToDelete(null);
  };

  const filteredMedia = useMemo(() => {
    if (!filters.search) return media;
    const term = filters.search.toLowerCase();
    return media.filter((item) => {
      return (
        item.title?.toLowerCase().includes(term) ||
        item.section?.toLowerCase().includes(term) ||
        item.key?.toLowerCase().includes(term)
      );
    });
  }, [media, filters.search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
            Media Library
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Manage images and videos used across your website pages
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm sm:text-base">Refresh</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">Add Media</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Page
            </label>
            <CustomDropdown
              options={PAGE_OPTIONS}
              value={filters.page}
              onChange={(val) => dispatch(setMediaFilters({ page: val }))}
              placeholder="Select page"
            />
          </div>

          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Type
            </label>
            <CustomDropdown
              options={TYPE_FILTER_OPTIONS}
              value={filters.type}
              onChange={(val) => dispatch(setMediaFilters({ type: val }))}
              placeholder="All types"
            />
          </div>

          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Status
            </label>
            <CustomDropdown
              options={STATUS_FILTER_OPTIONS}
              value={filters.isActive}
              onChange={(val) => dispatch(setMediaFilters({ isActive: val }))}
              placeholder="All status"
            />
          </div>

          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Search
            </label>
            <FormInput
              type="text"
              placeholder="Search by title, section or key..."
              value={filters.search}
              onChange={(e) =>
                dispatch(setMediaFilters({ search: e.target.value }))
              }
              icon={Search}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        {filteredMedia.length === 0 && !loading ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Media Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light mb-4">
              Start by uploading images or videos for your pages
            </p>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Media</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                className="group border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || item.section || 'Media'}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  )}
                  <div className="absolute top-2 left-2 inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-montserrat-medium-500">
                    {item.type === 'video' ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <ImageIcon className="w-3 h-3" />
                    )}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-montserrat-medium-500 ${
                        item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-3 space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <h3 className="text-sm font-montserrat-semibold-600 text-black truncate capitalize">
                      {item.title || item.page || 'Untitled media'}
                    </h3>
                    {/* {typeof item.sortOrder === 'number' && (
                      <span className="text-xs font-montserrat-regular-400 text-black-light">
                        #{item.sortOrder}
                      </span>
                    )} */}
                  </div>
                  {/* <p className="text-xs font-montserrat-regular-400 text-black-light truncate">
                    {item.description || 'No description'}
                  </p> */}
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {/* {item.page && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-montserrat-medium-500">
                        Page: {item.page}
                      </span>
                    )} */}
                    {item.section && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-montserrat-medium-500">
                        Section: {item.section}
                      </span>
                    )}
                    {/* {item.key && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-montserrat-medium-500">
                        Key: {item.key}
                      </span>
                    )} */}
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                  <button
                    onClick={() =>
                      dispatch(
                        updateMediaAsset({
                          id: item._id,
                          data: { isActive: !item.isActive },
                        })
                      )
                    }
                    className="text-xs font-montserrat-medium-500 text-primary hover:text-primary-dark"
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <MediaAssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMedia}
        loading={loading}
        initialData={selectedMedia}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Media"
        message="Are you sure you want to delete this media asset?"
        itemName={mediaToDelete?.title || mediaToDelete?.key}
        itemType="media asset"
      />
    </div>
  );
};

export default MediaAssets;


