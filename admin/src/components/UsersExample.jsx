import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  fetchUserById, 
  updateUser, 
  deleteUser, 
  toggleUserStatus,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination,
  selectUsersFilters,
  setFilters,
  clearFilters
} from '../store/slices/usersSlice';

const UsersExample = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectUsersPagination);
  const filters = useSelector(selectUsersFilters);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers({
      page: pagination.currentPage,
      limit: pagination.limit,
      search: searchTerm,
      role: roleFilter,
      active: activeFilter
    }));
  }, [dispatch, pagination.currentPage, pagination.limit, searchTerm, roleFilter, activeFilter]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setFilters({ search: e.target.value }));
  };

  // Handle role filter
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    dispatch(setFilters({ role }));
  };

  // Handle active filter
  const handleActiveFilter = (active) => {
    setActiveFilter(active);
    dispatch(setFilters({ active }));
  };

  // Handle user status toggle
  const handleToggleStatus = (userId, currentStatus) => {
    dispatch(toggleUserStatus({ userId, active: !currentStatus }));
  };

  // Handle user update
  const handleUpdateUser = (userId, userData) => {
    dispatch(updateUser({ userId, userData }));
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(fetchUsers({
      page,
      limit: pagination.limit,
      search: searchTerm,
      role: roleFilter,
      active: activeFilter
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setActiveFilter('');
    dispatch(clearFilters());
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          
          <select
            value={activeFilter}
            onChange={(e) => handleActiveFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.active)}
                      className={`px-3 py-1 text-xs rounded ${
                        user.active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{pagination.totalRecords}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(user => user.active).length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900">Inactive Users</h3>
          <p className="text-2xl font-bold text-red-600">
            {users.filter(user => !user.active).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersExample;
