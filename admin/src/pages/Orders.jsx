import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  RotateCcw
} from 'lucide-react';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock orders data - expanded for pagination demo
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567'
      },
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Diamond Ring', quantity: 1, price: 299.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '123 Main Street, New York, NY 10001',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid'
      }
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543'
      },
      date: '2024-01-14',
      status: 'shipped',
      total: 199.99,
      items: [
        { name: 'Gold Earrings', quantity: 1, price: 199.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '456 Oak Avenue, Los Angeles, CA 90210',
        method: 'Express Shipping'
      },
      payment: {
        method: 'PayPal',
        status: 'paid'
      }
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1 (555) 456-7890'
      },
      date: '2024-01-13',
      status: 'processing',
      total: 149.99,
      items: [
        { name: 'Silver Bracelet', quantity: 1, price: 149.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '789 Pine Street, Chicago, IL 60601',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'pending'
      }
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+1 (555) 321-0987'
      },
      date: '2024-01-12',
      status: 'cancelled',
      total: 89.99,
      items: [
        { name: 'Pearl Necklace', quantity: 1, price: 89.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '321 Elm Street, Miami, FL 33101',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'refunded'
      }
    },
    {
      id: 'ORD-005',
      customer: {
        name: 'David Brown',
        email: 'david.brown@example.com',
        phone: '+1 (555) 654-3210'
      },
      date: '2024-01-11',
      status: 'delivered',
      total: 399.99,
      items: [
        { name: 'Platinum Watch', quantity: 1, price: 399.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '654 Maple Drive, Seattle, WA 98101',
        method: 'Express Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid'
      }
    },
    {
      id: 'ORD-006',
      customer: {
        name: 'Lisa Davis',
        email: 'lisa.davis@example.com',
        phone: '+1 (555) 789-0123'
      },
      date: '2024-01-10',
      status: 'shipped',
      total: 179.99,
      items: [
        { name: 'Ruby Pendant', quantity: 1, price: 179.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '987 Cedar Lane, Boston, MA 02101',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'PayPal',
        status: 'paid'
      }
    },
    {
      id: 'ORD-007',
      customer: {
        name: 'Robert Taylor',
        email: 'robert.taylor@example.com',
        phone: '+1 (555) 234-5678'
      },
      date: '2024-01-09',
      status: 'processing',
      total: 249.99,
      items: [
        { name: 'Emerald Ring', quantity: 1, price: 249.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '147 Birch Street, Denver, CO 80201',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'pending'
      }
    },
    {
      id: 'ORD-008',
      customer: {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        phone: '+1 (555) 345-6789'
      },
      date: '2024-01-08',
      status: 'delivered',
      total: 129.99,
      items: [
        { name: 'Sapphire Earrings', quantity: 1, price: 129.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '258 Spruce Avenue, Phoenix, AZ 85001',
        method: 'Express Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid'
      }
    },
    {
      id: 'ORD-009',
      customer: {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+1 (555) 456-7890'
      },
      date: '2024-01-07',
      status: 'cancelled',
      total: 199.99,
      items: [
        { name: 'Gold Chain', quantity: 1, price: 199.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '369 Willow Road, Austin, TX 73301',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'refunded'
      }
    },
    {
      id: 'ORD-010',
      customer: {
        name: 'Jennifer Lee',
        email: 'jennifer.lee@example.com',
        phone: '+1 (555) 567-8901'
      },
      date: '2024-01-06',
      status: 'shipped',
      total: 349.99,
      items: [
        { name: 'Diamond Necklace', quantity: 1, price: 349.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '741 Pine Street, Portland, OR 97201',
        method: 'Express Shipping'
      },
      payment: {
        method: 'PayPal',
        status: 'paid'
      }
    },
    {
      id: 'ORD-011',
      customer: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 678-9012'
      },
      date: '2024-01-05',
      status: 'processing',
      total: 89.99,
      items: [
        { name: 'Silver Ring', quantity: 1, price: 89.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '852 Oak Drive, San Francisco, CA 94101',
        method: 'Standard Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'pending'
      }
    },
    {
      id: 'ORD-012',
      customer: {
        name: 'Amanda Rodriguez',
        email: 'amanda.rodriguez@example.com',
        phone: '+1 (555) 789-0123'
      },
      date: '2024-01-04',
      status: 'delivered',
      total: 279.99,
      items: [
        { name: 'Pearl Earrings', quantity: 1, price: 279.99, image: '/api/placeholder/60/60' }
      ],
      shipping: {
        address: '963 Elm Street, San Diego, CA 92101',
        method: 'Express Shipping'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => o.status === 'processing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Orders</h1> */}
        <p className="font-montserrat-regular-400 text-black-light">Manage customer orders and track fulfillment</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Total Orders</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-black">{orderStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Delivered</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-green-600">{orderStats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Shipped</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-blue-600">{orderStats.shipped}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Processing</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-yellow-600">{orderStats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">Cancelled</p>
              <p className="text-2xl font-sorts-mill-gloudy font-bold text-red-600">{orderStats.cancelled}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary outline-none !focus:border-primary font-montserrat-regular-400 text-black"
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Date</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Status</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Total</th>
                <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-6 py-4">
                    <span className="font-montserrat-semibold-600 text-black">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-montserrat-medium-500 text-black">{order.customer.name}</p>
                      <p className="text-sm font-montserrat-regular-400 text-black-light">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-montserrat-medium-500 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat-semibold-600 text-black">${order.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
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
  
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                  Order Details - {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <XCircle className="w-6 h-6 text-black-light" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black">Order Status</h3>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-montserrat-medium-500 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300">
                    Update Status
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-medium-500 text-black">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{selectedOrder.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Shipping Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-black-light mt-1" />
                      <div>
                        <p className="font-montserrat-medium-500 text-black">{selectedOrder.shipping.method}</p>
                        <p className="font-montserrat-regular-400 text-black-light">{selectedOrder.shipping.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-primary-light rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-montserrat-semibold-600 text-black">{item.name}</h4>
                        <p className="font-montserrat-regular-400 text-black-light">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-montserrat-semibold-600 text-black">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Payment Information</h3>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-black-light" />
                  <span className="font-montserrat-medium-500 text-black">{selectedOrder.payment.method}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-montserrat-medium-500 ${
                    selectedOrder.payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.payment.status}
                  </span>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-montserrat-semibold-600 text-black">Total</span>
                  <span className="text-2xl font-sorts-mill-gloudy font-bold text-black">${selectedOrder.total}</span>
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

export default Orders;