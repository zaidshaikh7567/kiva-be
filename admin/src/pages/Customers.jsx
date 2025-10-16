import React, { useState } from 'react';
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
  XCircle
} from 'lucide-react';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';
import { createPortal } from 'react-dom';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock customers data
  const customers = [
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2024-01-15',
      status: 'active',
      totalOrders: 5,
      totalSpent: 1299.95,
      lastOrder: '2024-01-20',
      avatar: null
    },
    {
      id: 'CUST-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, CA',
      joinDate: '2024-01-10',
      status: 'active',
      totalOrders: 3,
      totalSpent: 599.97,
      lastOrder: '2024-01-18',
      avatar: null
    },
    {
      id: 'CUST-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      joinDate: '2024-01-05',
      status: 'inactive',
      totalOrders: 1,
      totalSpent: 149.99,
      lastOrder: '2024-01-12',
      avatar: null
    },
    {
      id: 'CUST-004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 321-0987',
      location: 'Miami, FL',
      joinDate: '2024-01-08',
      status: 'active',
      totalOrders: 2,
      totalSpent: 279.98,
      lastOrder: '2024-01-16',
      avatar: null
    },
    {
      id: 'CUST-005',
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 654-3210',
      location: 'Seattle, WA',
      joinDate: '2024-01-12',
      status: 'active',
      totalOrders: 4,
      totalSpent: 799.96,
      lastOrder: '2024-01-19',
      avatar: null
    },
    {
      id: 'CUST-006',
      name: 'Lisa Davis',
      email: 'lisa.davis@example.com',
      phone: '+1 (555) 789-0123',
      location: 'Boston, MA',
      joinDate: '2024-01-03',
      status: 'active',
      totalOrders: 6,
      totalSpent: 1199.94,
      lastOrder: '2024-01-21',
      avatar: null
    },
    {
      id: 'CUST-007',
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Denver, CO',
      joinDate: '2024-01-07',
      status: 'inactive',
      totalOrders: 1,
      totalSpent: 249.99,
      lastOrder: '2024-01-14',
      avatar: null
    },
    {
      id: 'CUST-008',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Phoenix, AZ',
      joinDate: '2024-01-11',
      status: 'active',
      totalOrders: 3,
      totalSpent: 389.97,
      lastOrder: '2024-01-17',
      avatar: null
    },
    {
      id: 'CUST-009',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      joinDate: '2024-01-09',
      status: 'active',
      totalOrders: 2,
      totalSpent: 399.98,
      lastOrder: '2024-01-15',
      avatar: null
    },
    {
      id: 'CUST-010',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Portland, OR',
      joinDate: '2024-01-13',
      status: 'active',
      totalOrders: 4,
      totalSpent: 699.96,
      lastOrder: '2024-01-22',
      avatar: null
    },
    {
      id: 'CUST-011',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 678-9012',
      location: 'San Francisco, CA',
      joinDate: '2024-01-06',
      status: 'inactive',
      totalOrders: 1,
      totalSpent: 89.99,
      lastOrder: '2024-01-13',
      avatar: null
    },
    {
      id: 'CUST-012',
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@example.com',
      phone: '+1 (555) 789-0123',
      location: 'San Diego, CA',
      joinDate: '2024-01-14',
      status: 'active',
      totalOrders: 3,
      totalSpent: 559.97,
      lastOrder: '2024-01-23',
      avatar: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
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

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
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
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-black">{customerStats.total}</p>
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
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 focus:ring-primary outline-none focus:border-primary font-montserrat-regular-400 text-black"
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
            <button className="flex items-center space-x-2 px-4 py-3 border border-primary-light rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <Download className="w-5 h-5 text-black-light" />
              <span className="font-montserrat-medium-500 text-black">Export</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-montserrat-medium-500 text-black-light">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500">
                    <Search className="w-4 h-4" />
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-primary-dark transition-colors duration-300"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-montserrat-medium-500">
                    <Filter className="w-4 h-4" />
                    <span className="capitalize">{statusFilter}</span>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 hover:text-primary-dark transition-colors duration-300"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-sm font-montserrat-medium-500 text-primary hover:text-primary-dark transition-colors duration-300"
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
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Location</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Status</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Last Order</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-sm font-montserrat-semibold-600 text-primary">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-montserrat-semibold-600 text-black">{customer.name}</p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-montserrat-medium-500 text-black">{customer.email}</p>
                      <p className="text-sm font-montserrat-regular-400 text-black-light">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{customer.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-montserrat-medium-500 ${getStatusColor(customer.status)}`}>
                      <span className="capitalize">{customer.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat-semibold-600 text-black">{customer.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat-semibold-600 text-black">${customer.totalSpent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-montserrat-medium-500 text-primary hover:bg-primary-light rounded-lg transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="p-2 text-black-light hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
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
                  Customer Details - {selectedCustomer.name}
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
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">Customer Information</h3>
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
                      <Phone className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{selectedCustomer.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Total Orders: {selectedCustomer.totalOrders}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Total Spent: ${selectedCustomer.totalSpent}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        Last Order: {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat-medium-500 ${getStatusColor(selectedCustomer.status)}`}>
                      <span className="capitalize">{selectedCustomer.status}</span>
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
    </div>
  );
};

export default Customers;