import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { fetchMetals, createMetal, updateMetal, deleteMetal, selectMetals, selectMetalsLoading, selectMetalsPagination } from '../store/slices/metalsSlice';
import MetalModal from '../components/MetalModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';

const Metals = () => {
  const dispatch = useDispatch();
  const metals = useSelector(selectMetals);
  const loading = useSelector(selectMetalsLoading);
  const pagination = useSelector(selectMetalsPagination);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [metalToDelete, setMetalToDelete] = useState(null);


  // Fetch metals on component mount and when page changes
  useEffect(() => {
    dispatch(fetchMetals({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);


  // Handle add metal
  const handleAddMetal = () => {
    setSelectedMetal(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Handle edit metal
  const handleEditMetal = (metal) => {
    setSelectedMetal(metal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle delete metal
  const handleDeleteMetal = (metal) => {
    setMetalToDelete(metal);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (metalToDelete) {
      dispatch(deleteMetal(metalToDelete._id));
      setIsDeleteModalOpen(false);
      setMetalToDelete(null);
    }
  };

  // Handle modal submit
  const handleModalSubmit = (metalData) => {
    if (modalMode === 'add') {
      dispatch(createMetal(metalData));
    } else {
      dispatch(updateMetal({ metalId: selectedMetal._id, data: metalData }));
    }
    setIsModalOpen(false);
    setSelectedMetal(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetal(null);
  };


  return (
    <div className=" bg-secondary min-h-screen">
      {/* Header */}
 

      <div className="flex flex-row items-center justify-end gap-4 mb-8">
        {/* <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
          Metal Management
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Manage jewelry metal options and pricing
          </p>
        </div> */}
        <div className="flex items-center space-x-3">
        <button
            onClick={handleAddMetal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Metal
          </button>
        </div>
      </div>


      {/* Metals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto ">
          <table className="w-full min-w-[800px]">
          <thead className="bg-primary-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                  Metal Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                  Color
                </th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                  Purity Levels
                </th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
                      <span className="text-gray-500">Loading metals...</span>
                    </div>
                  </td>
                </tr>
              ) : metals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg font-medium mb-2">No metals found</div>
                      <div className="text-sm">Get started by adding your first metal option</div>
                    </div>
                  </td>
                </tr>
              ) : (
                metals.map((metal) => (
                  <tr key={metal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 capitalize">{metal.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: metal.color }}
                        ></div>
                        <span className="text-sm text-gray-900">{metal.colorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {metal.purityLevels && metal.purityLevels.length > 0 ? (
                          metal.purityLevels.filter(level => level.active !== false).map((level, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {level.karat}K (x{level.priceMultiplier})
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No purity levels</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        metal.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {metal.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditMetal(metal)}
                          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMetal(metal)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalRecords}
            itemsPerPage={pagination.limit}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Metal Modal */}
      <MetalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        loading={loading}
        metalData={selectedMetal}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Metal"
        message={`Are you sure you want to delete "${metalToDelete?.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </div>
  );
};

export default Metals;
