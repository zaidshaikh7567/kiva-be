import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  RotateCcw,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import CustomDropdown from '../components/CustomDropdown';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';
import { ORDER_STATUS_COLORS } from '../constants';
import { 
  fetchOrders, 
  fetchOrderById, 
  updateOrderStatus, 
  selectAdminOrders, 
  selectAdminOrdersLoading, 
  selectAdminOrdersPagination, 
  selectAdminCurrentOrder, 
  selectAdminOrdersUpdating,
  clearCurrentOrder
} from '../store/slices/ordersSlice';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0);

const formatOrderDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const formatOrderNumber = (order) => {
  if (!order) return 'N/A';
  return (
    order.orderNumber ||
    order._id ||
    (order.id ? `ORD-${order.id}` : null) ||
    'N/A'
  );
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectAdminOrdersLoading);
  const pagination = useSelector(selectAdminOrdersPagination);
  const currentOrder = useSelector(selectAdminCurrentOrder);
  const updatingStatus = useSelector(selectAdminOrdersUpdating);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if(showOrderModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showOrderModal]);
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        fetchOrders({
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter === 'all' ? '' : statusFilter,
          search: searchTerm.trim(),
        })
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [dispatch, currentPage, itemsPerPage, statusFilter, searchTerm]);

  useEffect(() => {
    if (currentOrder) {
      setSelectedOrder(currentOrder);
      setSelectedStatus(currentOrder.status || '');
    }
  }, [currentOrder]);

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'completed') {
      return ORDER_STATUS_COLORS.delivered || ORDER_STATUS_COLORS.default;
    }
    if (normalized === 'pending') {
      return ORDER_STATUS_COLORS.processing || ORDER_STATUS_COLORS.default;
    }
    return ORDER_STATUS_COLORS[normalized] || ORDER_STATUS_COLORS.default;
  };

  const getStatusIcon = (status) => {
    const normalized = (status || '').toLowerCase();
    switch (normalized) {
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  const statusUpdateOptions = statusOptions.filter((option) => option.value !== 'all');

  const orderStats = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const counts = {
      delivered: 0,
      shipped: 0,
      processing: 0,
      cancelled: 0,
    };

    list.forEach((order) => {
      const status = (order.status || '').toLowerCase();
      if (status === 'delivered' || status === 'completed') {
        counts.delivered += 1;
      } else if (status === 'shipped') {
        counts.shipped += 1;
      } else if (status === 'processing' || status === 'pending') {
        counts.processing += 1;
      } else if (status === 'cancelled') {
        counts.cancelled += 1;
      }
    });

    return {
      total: pagination.total || list.length,
      ...counts,
    };
  }, [orders, pagination]);

  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.total || orders.length;
  const isInitialLoading = loading && (!orders || orders.length === 0);

  const modalData = useMemo(() => {
    if (!selectedOrder) return null;

    const order = selectedOrder;
    const statusLower = (order.status || 'pending').toLowerCase();
    const shippingAddress = order.shippingAddress || {};
    const billingAddress = order.billingAddress || null;
    const orderItems = Array.isArray(order.items) ? order.items : [];
    const customerName =
      order.user?.name ||
      [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(' ') ||
      'Customer';
    const customerEmail = order.user?.email || shippingAddress.email || '—';
    const customerPhone = order.phone || shippingAddress.phone || '—';
    const paymentMethodLabel = order.payment?.method || order.paymentMethod || 'N/A';
    const paymentStatusLabel = (order.payment?.status || order.paymentStatus || 'pending').toLowerCase();
    const orderTotalAmount =
      order.totals?.total || order.finalTotal || order.total || 0;
    const orderIdDisplay = formatOrderNumber(order);

    return {
      order,
      statusLower,
      shippingAddress,
      billingAddress,
      orderItems,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethodLabel,
      paymentStatusLabel,
      orderTotalAmount,
      orderIdDisplay,
    };
  }, [selectedOrder]);

  const handleViewOrder = async (order) => {
    const orderId = order._id || order.id;
    setSelectedOrder(order);
    setSelectedStatus(order.status || '');
    setShowOrderModal(true);

    if (orderId) {
      const result = await dispatch(fetchOrderById(orderId));
      if (fetchOrderById.rejected.match(result)) {
        toast.error(result.payload || 'Failed to load order details');
      }
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id;
    if (!orderId) return;

    if (!selectedStatus || selectedStatus === selectedOrder.status) {
      toast.error('Select a different status to update.');
      return;
    }

    const result = await dispatch(updateOrderStatus({ orderId, status: selectedStatus }));
    if (updateOrderStatus.fulfilled.match(result)) {
      dispatch(
        fetchOrders({
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter === 'all' ? '' : statusFilter,
          search: searchTerm.trim(),
        })
      );
    }
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setSelectedStatus('');
    dispatch(clearCurrentOrder());
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Export handlers
  const formatOrderForExport = (order) => {
    if (!order) return {};
    const shipping = order.shippingAddress || {};
    const items = Array.isArray(order.items) ? order.items : [];

    return {
      OrderID: formatOrderNumber(order),
      Status: (order.status || 'Pending'),
      Customer:
        order.user?.name ||
        [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') ||
        'Customer',
      Email: order.user?.email || shipping.email || '',
      Phone: order.user?.phone || shipping.phone || '',
      Date: formatOrderDate(order.createdAt || order.date),
      Total: formatCurrency(order.totals?.total || order.finalTotal || order.total || 0),
      ItemCount: items.length,
      Items: items
        .map((item) => {
          const product = item.product || {};
          const name = item.productName || product.title || product.name || 'Product';
          const quantity = item.quantity || 1;
          const unitPrice = item.unitPrice || item.price || product.price || 0;
          const totalPrice =
            item.totalPrice || item.calculatedPrice || unitPrice * quantity;
          return `${name} (Qty: ${quantity}, Total: ${formatCurrency(totalPrice)})`;
        })
        .join('; '),
      ShippingAddress: [
        shipping.street,
        shipping.city,
        shipping.state,
        shipping.zipCode,
        shipping.country,
      ]
        .filter(Boolean)
        .join(', '),
      Notes: order.notes || '',
    };
  };

  const handleExportPDF = () => {
    const formattedData = orders.map(formatOrderForExport);
    exportToPDF(formattedData, 'orders');
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    const formattedData = orders.map(formatOrderForExport);
    exportToCSV(formattedData, 'orders');
    setShowExportMenu(false);
  };

  const orderCards = [
  {
    label: "Total Orders",
    value: orderStats.total,
    icon: ShoppingBag,
    textColor: "text-black",
    bgColor: "bg-primary-light",
    iconColor: "text-primary",
  },
  {
    label: "Delivered",
    value: orderStats.delivered,
    icon: CheckCircle,
    textColor: "text-green-600",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Shipped",
    value: orderStats.shipped,
    icon: Truck,
    textColor: "text-blue-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Processing",
    value: orderStats.processing,
    icon: Clock,
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    label: "Cancelled",
    value: orderStats.cancelled,
    icon: XCircle,
    textColor: "text-red-600",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];



  if (isInitialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-secondary rounded-xl border border-gray-200">
        <div className="flex flex-col items-center space-y-3 text-black-light">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="font-montserrat-medium-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Orders</h1> */}
        <p className="font-montserrat-regular-400 text-black-light">Manage customer orders and track fulfillment</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
    {orderCards.map((card, index) => {
      const Icon = card.icon;

      return (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat-medium-500 text-black-light">
                {card.label}
              </p>
              <p
                className={`text-2xl font-sorts-mill-gloudy font-bold ${card.textColor}`}
              >
                {card.value}
              </p>
            </div>

            <div
              className={`w-12 h-12 min-w-12 min-h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}
            >
              <Icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      );
    })}
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
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary !focus:border-primary font-montserrat-regular-400 text-black"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <CustomDropdown
              options={statusOptions}
              value={statusFilter}
              onChange={handleStatusChange}
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

            {/* Export Button with Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-3 border border-primary-light rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <Download className="w-5 h-5 text-black-light" />
                <span className="font-montserrat-medium-500 text-black">Export</span>
                <ChevronDown className={`w-4 h-4 text-black-light transition-transform duration-300 ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-300"
                  >
                    <FileText className="w-5 h-5 text-red-600" />
                    <span className="font-montserrat-medium-500 text-black">Export as PDF</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-300"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <span className="font-montserrat-medium-500 text-black">Export as CSV</span>
                  </button>
                </div>
              )}
            </div>
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
                      onClick={() => handleStatusChange('all')}
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
            <thead className="bg-primary-light">
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
              {orders.map((order) => {
                const orderIdDisplay = formatOrderNumber(order);
                const shippingAddress = order.shippingAddress || {};
                const customerName =
                  order.user?.name ||
                  [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(' ') ||
                  'Customer';
                const customerEmail = order.user?.email || shippingAddress.email || '—';
                const customerPhone = order?.phone || shippingAddress.phone || '—';
                const orderDate = order.createdAt || order.date;
                const status = (order.status || 'pending').toLowerCase();
                const totalAmount = order.totals?.total || order.finalTotal || order.total || 0;

                return (
                  <tr
                    key={order._id || order.id || order.orderNumber}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="font-montserrat-semibold-600 text-black">
                        {orderIdDisplay}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-montserrat-medium-500 text-black">{customerName}</p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">
                          {customerEmail}
                        </p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">
                          {customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-black-light" />
                        <span className="font-montserrat-regular-400 text-black">
                          {formatOrderDate(orderDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-montserrat-medium-500 ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}
                        <span className="capitalize">{status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat-semibold-600 text-black">
                        {formatCurrency(totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center space-x-1 px-3 py-2 text-sm font-montserrat-medium-500 text-primary hover:bg-primary-light rounded-lg transition-colors duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
      {showOrderModal && modalData && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                  Order Details - {modalData.orderIdDisplay}
                </h2>
                <button
                  onClick={closeOrderModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <XCircle className="w-6 h-6 text-black-light" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black">Order Status</h3>
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-montserrat-medium-500 ${getStatusColor(
                      modalData.statusLower
                    )}`}
                  >
                    {getStatusIcon(modalData.statusLower)}
                    <span className="capitalize">{modalData.statusLower}</span>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <CustomDropdown
                    options={statusUpdateOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Select status"
                    className="w-full sm:w-48"
                    searchable={false}
                  />
                  <button
                    onClick={handleUpdateStatus}
                    disabled={
                      updatingStatus ||
                      !selectedStatus ||
                      selectedStatus === modalData.order.status
                    }
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
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
                      <span className="font-montserrat-medium-500 text-black capitalize">{modalData.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{modalData.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-black-light" />
                      <span className="font-montserrat-regular-400 text-black">{modalData.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Shipping Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-black-light mt-1" />
                      <div>
                        <p className="font-montserrat-medium-500 text-black">
                          {[modalData.shippingAddress.street, modalData.shippingAddress.city]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        <p className="font-montserrat-regular-400 text-black-light">
                          {[modalData.shippingAddress.state, modalData.shippingAddress.zipCode]
                            .filter(Boolean)
                            .join(' ')}
                        </p>
                        {modalData.shippingAddress.country && (
                          <p className="font-montserrat-regular-400 text-black-light">
                            {modalData.shippingAddress.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Order Items</h3>
                <div className="space-y-3">
                  {modalData.orderItems.map((item, index) => {
                    const product = item.product || item;
                    const productName =
                      item.productName || product.title || product.name || 'Product';
                    const productImage =
                      item.productImage ||
                      product.images?.[0]?.url ||
                      product.images?.[0] ||
                      product.image;
                    const quantity = item.quantity || 1;
                    const unitPrice = item.unitPrice || item.price || product.price || 0;
                    const totalPrice =
                      item.totalPrice || item.calculatedPrice || unitPrice * quantity;
                    const metalName = item.metalName || item.metal?.name || '';
                    const purityLevelValue = item.purityLevel?.karat || item.metal?.karat;
                    const purityLevel = purityLevelValue ? `${purityLevelValue}K` : '';
                    const stoneName = item.stoneName || item.stoneType?.name || '';
                    const stonePrice = item.stonePrice || item.stoneType?.price || 0;
                    const ringSize = item.ringSize || '';

                    return (
                      <div
                        key={item._id || index}
                        className="flex items-start space-x-3 p-3 border border-primary-light rounded-lg"
                      >
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-montserrat-semibold-600 text-black capitalize">{productName}</h4>
                          <div className="text-sm font-montserrat-regular-400 text-black-light space-y-1 mt-1">
                            <p>
                              Quantity: {quantity} × {formatCurrency(unitPrice)}
                            </p>
                            {(metalName || purityLevel) && (
                              <p className='capitalize'>
                                Metal: {metalName}
                                {metalName && purityLevel ? ` (${purityLevel})` : purityLevel}
                              </p>
                            )}
                            {stoneName && <p>Stone: {stoneName}</p>}
                            {stonePrice > 0 && <p>Stone Price: {formatCurrency(stonePrice)}</p>}
                            {ringSize && <p>Size: {ringSize}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat-semibold-600 text-black">
                            {formatCurrency(totalPrice)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billing Address */}
              {modalData.billingAddress && (
                <div>
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                    Billing Address
                  </h3>
                  <div className="space-y-1 text-sm font-montserrat-regular-400 text-black-light">
                    <p>
                      {[modalData.billingAddress.street, modalData.billingAddress.city]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <p>
                      {[modalData.billingAddress.state, modalData.billingAddress.zipCode]
                        .filter(Boolean)
                        .join(' ')}
                    </p>
                    {modalData.billingAddress.country && <p>{modalData.billingAddress.country}</p>}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                  Payment Information
                </h3>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-black-light" />
                  <span className="font-montserrat-medium-500 text-black">
                    {modalData.paymentMethodLabel}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-montserrat-medium-500 ${
                      modalData.paymentStatusLabel === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {modalData.paymentStatusLabel}
                  </span>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-top border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-montserrat-semibold-600 text-black">Total</span>
                  <span className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                    {formatCurrency(modalData.orderTotalAmount)}
                  </span>
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