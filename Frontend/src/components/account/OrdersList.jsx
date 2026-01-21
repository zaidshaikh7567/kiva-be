import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Clock, CheckCircle, Eye, Loader2 } from 'lucide-react';
import { getMyOrders as getMyOrdersAction, selectOrders, selectOrdersLoading, selectOrdersPagination } from '../../store/slices/ordersSlice';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../CustomDropdown';
import PriceDisplay from '../PriceDisplay';

const OrdersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const pagination = useSelector(selectOrdersPagination);
  
  const [localPagination, setLocalPagination] = useState({
    page: 1,
    limit: 10
  });
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchOrders = useCallback(() => {
    dispatch(getMyOrdersAction({
      page: localPagination.page,
      limit: localPagination.limit,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }));
  }, [dispatch, localPagination.page, localPagination.limit, filters.status, filters.sortBy, filters.sortOrder]);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
    setLocalPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatOrderDate = (dateString) => {
    
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
};


  const formatOrderNumber = (order) => {
    return order.orderNumber || order._id || `ORD-${order.id}` || 'N/A';
  };

  const displayOrders = orders.length > 0 ? orders : [];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm sm:p-6 p-4">
        <div className="flex sm:flex-row flex-col sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-sorts-mill-gloudy text-black">
            My Orders
          </h2>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <CustomDropdown
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleStatusFilter(value)}
              placeholder="All Status"
              className="w-full sm:w-48"
              searchable={false}
            >
            </CustomDropdown>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-black-light font-montserrat-regular-400">Loading orders...</span>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-sorts-mill-gloudy text-black mb-2">No Orders Found</h3>
            <p className="text-black-light font-montserrat-regular-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div
                key={order._id || order.id}
                className="border border-primary-light rounded-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="font-montserrat-semibold-600 text-black text-lg">
                      Order {formatOrderNumber(order)}
                    </h3>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Placed on {formatOrderDate(order.createdAt || order.date)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-montserrat-medium-500 flex items-center space-x-1 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status || 'Pending'}</span>
                    </span>
                    <span className="text-lg font-montserrat-semibold-600 text-black whitespace-nowrap">
                      <PriceDisplay price={order.totals?.total || order.total || 0} variant="small" className="font-montserrat-medium-500 text-black inline" />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">
                      Items
                    </h4>
                    {(order.items || []).map((item, index) => {
                      const product = item.product || item;
                      const productName = item.productName || product.title || product.name || 'Product';
                      const productImage =
                        item.productImage ||
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        product.image;
                      const metalName = item.metalName || item.metal?.name || '';
                      const purityLevel = item.purityLevel ? `${item.purityLevel.karat}K` : '';
                      const stoneName = item.stoneName || item.stoneType?.name || '';
                      const ringSize = item.ringSize || '';
                      const quantity = item.quantity || 1;
                      const unitPrice = item.unitPrice || product.price || 0;
                      const totalPrice =
                        item.totalPrice ||
                        item.calculatedPrice ||
                        unitPrice * quantity;

                      return (
                        <div key={index} className="flex items-center space-x-3 mb-2">
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
                          <div>
                            <p className="font-montserrat-medium-500 text-black">
                              {productName}
                            </p>
                            <div className="text-xs font-montserrat-regular-400 text-black-light space-y-0.5">
                              <p>
                                Qty: {quantity} × <PriceDisplay price={unitPrice} variant="small" className="font-montserrat-medium-500 text-black inline" />
                              </p>
                              {/* {(metalName || purityLevel) && (
                                <p>
                                  Metal: {metalName}
                                  {metalName && purityLevel ? ` (${purityLevel})` : purityLevel}
                                </p>
                              )} */}
                              {/* {stoneName && <p>Stone: {stoneName}</p>} */}
                              {/* {ringSize && <p>Size: {ringSize}</p>} */}
                            </div>
                            <p className="text-sm font-montserrat-semibold-600 text-primary mt-1">
                              {/* <PriceDisplay price={totalPrice} variant="small" className="font-montserrat-medium-500 text-black inline" /> */}
                              {/* ${totalPrice.toFixed(2)} */}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <h4 className="font-montserrat-semibold-600 text-black mb-2">
                      Shipping
                    </h4>
                    {order.shippingAddress ? (
                      <>
                        <p className="text-sm font-montserrat-regular-400 text-black-light mb-1">
                          {order.shippingAddress.address}
                        </p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </>
                    ) : order.shipping ? (
                      <>
                        <p className="text-sm font-montserrat-regular-400 text-black-light mb-1">
                          {order.shipping.address}
                        </p>
                        <p className="text-sm font-montserrat-regular-400 text-black-light">
                          {order.shipping.method}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-montserrat-regular-400 text-black-light">
                        Shipping information not available
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-primary-light">
                  <button
                    onClick={() => handleViewOrder(order._id || order.id)}
                    className="flex items-center space-x-2 text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  {(order.status === 'delivered' || order.status === 'completed') && (
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 transition-colors duration-300 w-full sm:w-auto">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-primary-light">
            <p className="text-sm font-montserrat-regular-400 text-black-light">
              Page {localPagination.page} of {pagination.totalPages} ({pagination.totalOrders} orders)
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLocalPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={localPagination.page === 1}
                className="px-4 py-2 border border-primary-light rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed font-montserrat-medium-500 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setLocalPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={localPagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-primary-light rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed font-montserrat-medium-500 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
