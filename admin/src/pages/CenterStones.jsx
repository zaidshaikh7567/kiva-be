import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Gem, Plus, Edit, Trash2, RefreshCw, Eye } from 'lucide-react';
import { clearError, deleteCenterStone, fetchCenterStones, createCenterStone, updateCenterStone, updateCenterStoneStatus, selectCenterStones, selectCenterStonesLoading } from '../store/slices/centerStonesSlice';
import CenterStoneModal from '../components/CenterStoneModal';
import CenterStoneViewModal from '../components/CenterStoneViewModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const CenterStones = () => {
  const dispatch = useDispatch();
  const centerStones = useSelector(selectCenterStones);
  
  const loading = useSelector(selectCenterStonesLoading);
  
  // Pagination state
  const [currentPage] = useState(1);
  const [limit] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [centerStoneToDelete, setCenterStoneToDelete] = useState(null);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [centerStoneToView, setCenterStoneToView] = useState(null);

  // Fetch center stones on component mount
  useEffect(() => {
    dispatch(fetchCenterStones());
  }, [dispatch]);



  const handleRefresh = () => {
    dispatch(fetchCenterStones());
  };

  const handleDeleteCenterStone = (centerStone) => {
    setCenterStoneToDelete(centerStone);
    setIsDeleteModalOpen(true);
  };

  const handleStatusToggle = (centerStone) => {
    const newActive = !centerStone.active;
    dispatch(updateCenterStoneStatus({ id: centerStone._id, active: newActive }));
  };

  const handleConfirmDelete = async () => {
    if (centerStoneToDelete) {
      try {
        const result = await dispatch(deleteCenterStone(centerStoneToDelete._id));
        if (deleteCenterStone.fulfilled.match(result)) {
          setIsDeleteModalOpen(false);
          setCenterStoneToDelete(null);
          // Refresh the list
          dispatch(fetchCenterStones({ page: currentPage, limit }));
        }
      } catch (error) {
        console.error('Error deleting stone:', error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCenterStoneToDelete(null);
  };

  // View modal handlers
  const handleOpenViewModal = (centerStone) => {
    setCenterStoneToView(centerStone);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCenterStoneToView(null);
  };

  const handleEditFromView = (centerStone) => {
    setModalMode('edit');
    setSelectedCenterStone(centerStone);
    setIsModalOpen(true);
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedCenterStone(null);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleOpenEditModal = (centerStone) => {
    setModalMode('edit');
    setSelectedCenterStone(centerStone);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCenterStone(null);
    setModalMode('add');
    dispatch(clearError());
  };

  const handleSubmitCenterStone = async (data) => {
  console.log('data :', data);
    if (modalMode === 'add') {
      // Add mode
      try {
        const result = await dispatch(createCenterStone(data));
        if (createCenterStone.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCenterStone(null);
          setModalMode('add');
          // Refresh the list
          dispatch(fetchCenterStones({ page: currentPage, limit }));
        }
      } catch (error) {
        console.error('Error creating center stone:', error);
      }
    } else {
      // Edit mode
      try {
        const result = await dispatch(updateCenterStone(data));
        if (updateCenterStone.fulfilled.match(result)) {
          setIsModalOpen(false);
          setSelectedCenterStone(null);
          setModalMode('add');
          // Refresh the list
          dispatch(fetchCenterStones({ page: currentPage, limit }));
        }
      } catch (error) {
        console.error('Error updating center stone:', error);
      }
    }
  };

  // Show loading state
  if (loading && centerStones.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
              Center Stones
            </h1>
            <p className="font-montserrat-regular-400 text-black-light">
              Manage your center stone inventory
            </p>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-montserrat-regular-400 text-black-light">Loading center stones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-end gap-4">
        {/* <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
            Center Stones
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Manage your center stone inventory
          </p>
        </div> */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Center Stone</span>
          </button>
        </div>
      </div>


      {/* Center Stones Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {centerStones.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Gem className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Center Stones Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light mb-4">
              Get started by creating your first center stone
            </p>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-montserrat-medium-500 hover:shadow-lg transition-all mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Center Stone</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-primary-light border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Center Stone Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Shape
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {centerStones.map((centerStone) => (
                  <tr key={centerStone._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[100px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <Gem className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 
                            onClick={() => handleOpenViewModal(centerStone)}
                            className="text-sm font-montserrat-medium-500 font-bold text-black capitalize cursor-pointer hover:text-primary transition-colors truncate"
                          >
                            {centerStone.name || 'Unnamed Center Stone'} CT
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-montserrat-medium-500 text-black capitalize">
                        {centerStone.shape || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-montserrat-semibold-600 text-primary">
                        ${centerStone.price?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(centerStone)}
                        className={`inline-flex px-3 py-1 text-xs font-montserrat-medium-500 rounded-full transition-colors duration-200 ${
                          centerStone.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title={`Click to ${centerStone.active ? 'deactivate' : 'activate'}`}
                      >
                        {centerStone.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenViewModal(centerStone)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(centerStone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Center Stone"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCenterStone(centerStone)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Center Stone"
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


      {/* Center Stone Modal */}
      <CenterStoneModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCenterStone}
        loading={loading}
        centerStoneData={selectedCenterStone}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Center Stone"
        message="Are you sure you want to delete this center stone?"
        itemName={centerStoneToDelete?.name}
        itemType="center stone"
      />

      {/* Center Stone View Modal */}
      <CenterStoneViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        centerStone={centerStoneToView}
        onEdit={handleEditFromView}
      />
    </div>
  );
};

export default CenterStones;
