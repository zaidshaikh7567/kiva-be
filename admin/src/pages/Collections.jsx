import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Video, Plus, Edit, Trash2, RefreshCw, Eye, Search, Calendar } from 'lucide-react';
import { 
  clearError, 
  deleteCollection, 
  fetchCollections, 
  createCollection, 
  updateCollection, 
  selectCollections, 
  selectCollectionsLoading, 
  selectCollectionsError, 
  selectCollectionsPagination, 
  setPagination 
} from '../store/slices/collectionsSlice';
import CollectionModal from '../components/CollectionModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';

const Collections = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const collectionsPagination = useSelector(selectCollectionsPagination);
  const loading = useSelector(selectCollectionsLoading);
  const error = useSelector(selectCollectionsError);
  
  // Use pagination from Redux
  const currentPage = collectionsPagination?.currentPage || 1;
  const limit = collectionsPagination?.limit || 10;
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  // Fetch collections on component mount
  useEffect(() => {
    dispatch(fetchCollections({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleRefresh = () => {
    dispatch(fetchCollections({ page: currentPage, limit }));
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ currentPage: page }));
    dispatch(fetchCollections({ page, limit }));
  };

  const handleDeleteCollection = (collection) => {
    setCollectionToDelete(collection);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (collectionToDelete) {
      try {
        const result = await dispatch(deleteCollection(collectionToDelete._id));
        if (deleteCollection.fulfilled.match(result)) {
          setIsDeleteModalOpen(false);
          setCollectionToDelete(null);
          // Refresh collections after deletion
          if (collections.length === 1 && currentPage > 1) {
            dispatch(setPagination({ currentPage: currentPage - 1 }));
            dispatch(fetchCollections({ page: currentPage - 1, limit }));
          } else {
            dispatch(fetchCollections({ page: currentPage, limit }));
          }
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCollectionToDelete(null);
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedCollection(null);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleOpenEditModal = (collection) => {
    setModalMode('edit');
    setSelectedCollection(collection);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollection(null);
    setModalMode('add');
    dispatch(clearError());
  };

  const handleSubmitCollection = async (data) => {
    if (modalMode === 'add') {
      // Add mode - data is the collection data directly
      try {
        const result = await dispatch(createCollection(data));
        if (createCollection.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCollection(null);
          setModalMode('add');
          // Refresh collections
          dispatch(setPagination({ currentPage: 1 }));
          dispatch(fetchCollections({ page: 1, limit }));
        }
      } catch (error) {
        console.error('Error creating collection:', error);
      }
    } else {
      // Edit mode - data is { id, data }
      try {
        const result = await dispatch(updateCollection(data));
        if (updateCollection.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCollection(null);
          setModalMode('add');
          // Refresh collections
          dispatch(fetchCollections({ page: currentPage, limit }));
        }
      } catch (error) {
        console.error('Error updating collection:', error);
      }
    }
  };

  // Show loading state
  if (loading && collections.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
              Collections
            </h1>
            <p className="font-montserrat-regular-400 text-black-light">
              Manage your collections
            </p>
          </div>
        </div> */}

        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-montserrat-regular-400 text-black-light">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center justify-center sm:justify-start space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {collections?.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Collections Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light mb-4">
              Get started by creating your first collection
            </p>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-primary-light border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Collection
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Video
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Images
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    isNew
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {collections.map((collection) => (
                  <tr key={collection?._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-montserrat-medium-500 font-bold text-black capitalize">
                            {collection?.title || 'Unnamed Collection'}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black capitalize">
                        {collection?.category || 'No category'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={collection?.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-montserrat-medium-500 text-primary hover:underline truncate max-w-xs block"
                      >
                        View Video
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black-light">
                        {collection?.images?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {collection?.isNew ? (
                        <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-montserrat-medium-500 rounded-full">
                          New
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1  text-gray-800 text-xs font-montserrat-medium-500 rounded-full">
                         -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(collection)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Collection"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCollection(collection)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Collection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {collectionsPagination && collectionsPagination?.totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={collectionsPagination?.totalPages}
          totalItems={collectionsPagination?.totalRecords}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      {/* Collection Modal */}
      <CollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCollection}
        loading={loading}
        error={error}
        collectionData={selectedCollection}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Collection"
        message="Are you sure you want to delete this collection?"
        itemName={collectionToDelete?.title}
        itemType="collection"
      />
    </div>
  );
};

export default Collections;
