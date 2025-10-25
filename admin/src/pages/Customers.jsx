import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Star,
  MoreVertical,
  Download,
  RotateCcw,
  UserPlus,
  Filter,
  XCircle,
  Trash2
} from 'lucide-react';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { createPortal } from 'react-dom';
import { 
  fetchUsers, 
  selectUsers, 
  selectUsersLoading, 
  selectUsersError, 
  toggleUserStatus,
  deleteUser
} from '../store/slices/usersSlice';
import { useDispatch, useSelector } from 'react-redux';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingUser, setTogglingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when debounced search term or status filter changes
  useEffect(() => {
    dispatch(fetchUsers({ 
      page: 1, 
      limit: 10, // Fetch more users for client-side filtering
      search: debouncedSearchTerm,
      active: statusFilter === 'all' ? '' : statusFilter === 'active' ? 'true' : 'false'
    }));
  }, [dispatch, debouncedSearchTerm, statusFilter]);

  const getStatusColor = (active) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // Handle user status toggle
  const handleToggleStatus = async (userId, currentStatus) => {
    setTogglingUser(userId);
    try {
      await dispatch(toggleUserStatus({ userId, active: !currentStatus }));
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setTogglingUser(null);
    }
  };

  // Handle user deletion
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Confirm user deletion
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        await dispatch(deleteUser(userToDelete._id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Cancel user deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Handle page change (client-side pagination)
  const handlePageChange = (page) => {
    // Update pagination state for client-side pagination
    // The actual pagination is handled by the paginatedUsers useMemo
    // We can store the current page in local state if needed
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Client-side filtering for better performance
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user._id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.active === isActive);
    }

    return filtered;
  }, [users, searchTerm, statusFilter]);

  // Pagination for filtered results
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const customerStats = {
    total: filteredUsers.length,
    active: filteredUsers.filter(u => u.active).length,
    inactive: filteredUsers.filter(u => !u.active).length,
    totalRevenue: 0 // This would need to be calculated from orders data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Customers</h1> */}
        <p className="font-montserrat-regular-400 text-black-light">Manage your customer database and track customer activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Total Customers</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-black">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Active Customers</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-green-600">{customerStats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Inactive Customers</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-gray-600">{customerStats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Total Revenue</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-primary">${customerStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                placeholder="Search customers by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 focus:ring-primary outline-none focus:border-primary font-montserrat-regular-400 text-black min-w-0"
                maxLength={100}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <CustomDropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Reset Button */}
            <button 
              onClick={handleResetFilters}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <RotateCcw className="w-5 h-5 text-black-light" />
              <span className="font-montserrat-medium-500 text-black">Reset</span>
            </button>

            {/* Export Button */}
            {/* <button className="flex items-center space-x-2 px-4 py-3 border border-primary-light rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <Download className="w-5 h-5 text-black-light" />
              <span className="font-montserrat-medium-500 text-black">Export</span>
            </button> */}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <span className="text-sm font-montserrat-medium-500 text-black-light whitespace-nowrap">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500 max-w-xs">
                      <Search className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">"{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"</span>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-primary-dark transition-colors duration-300 flex-shrink-0"
                        title="Remove search filter"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500">
                      <Filter className="w-4 h-4 flex-shrink-0" />
                      <span className="capitalize">{statusFilter}</span>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="ml-1 hover:text-primary-dark transition-colors duration-300 flex-shrink-0"
                        title="Remove status filter"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300 whitespace-nowrap self-start sm:self-auto"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-light">  
              <tr>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">User</th>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Contact</th>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Status</th>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Role</th>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Created</th>
                <th className="px-4 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Updated</th>
                {/* <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Last Activity</th> */}
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2 text-black-light">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-red-600">
                    Error: {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-black-light">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 min-w-10 min-h-10 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-sm font-montserrat-semibold-600 text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                        </div>
                        <div>
                          <p className="font-montserrat-semibold-600 text-black">{user.name}</p>
                          {/* <p className="text-sm font-montserrat-regular-400 text-black-light">{user._id}</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-montserrat-medium-500 text-black">{user.email}</p>
                        {/* <p className="text-sm font-montserrat-regular-400 text-black-light">{user._id}</p> */}
                      </div>
                    </td>
                   
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.active}
                            onChange={() => handleToggleStatus(user._id, user.active)}
                            disabled={togglingUser === user._id}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${togglingUser === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {togglingUser === user._id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </label>
                        <span className={`text-sm font-montserrat-medium-500 ${user.active ? 'text-green-600' : 'text-gray-500'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                  </td>
                    <td className="px-4 py-4">
                      <span className="font-montserrat-semibold-600 text-black capitalize">{user.role}</span>
                    </td>
                    {/* <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-black-light" />
                        <span className="font-montserrat-regular-400 text-black">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                    </td> */}
                    <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-black-light" />
                        <span className="font-montserrat-regular-400 text-black">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  </td>
                    <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                          {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center ">
                      <button
                          onClick={() => handleViewCustomer(user)}
                          className="flex items-center space-x-1 px-2 py-2 text-sm font-montserrat-medium-500 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-300"
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
      {Math.ceil(filteredUsers.length / itemsPerPage) > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                  User Details - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <XCircle className="w-6 h-6 text-black-light" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-medium-500 text-black">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">Role: {selectedCustomer.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-montserrat-regular-400 text-black">ID: {selectedCustomer._id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Created: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Updated: {new Date(selectedCustomer.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-montserrat-regular-400 text-black">
                        Status: {selectedCustomer.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Account Status</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat-medium-500 ${getStatusColor(selectedCustomer.active)}`}>
                      <span className="capitalize">{selectedCustomer.active ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300">
                      Send Email
                    </button>
                    <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white font-montserrat-medium-500 transition-colors duration-300">
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system."
        itemName={userToDelete?.name}
        itemType="user"
      />
    </div>
  );
};

export default Customers;