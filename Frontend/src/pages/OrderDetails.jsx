import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Loader2, 
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { getOrderById, selectCurrentOrder, selectOrdersLoading } from '../store/slices/ordersSlice';
import PriceDisplay from '../components/PriceDisplay';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('id :', id);
  const dispatch = useDispatch();
  const orderData = useSelector(selectCurrentOrder);
  console.log('orderData :', orderData);
  const loading = useSelector(selectOrdersLoading);
  const [hasFetched, setHasFetched] = useState(false);
  const cardDetails = orderData?.cardDetails || {};
  console.log('cardDetails :', Object.keys(cardDetails).length > 0 ? cardDetails : null);
  // Fetch order data by ID
  console.log('!hasFetched :', !hasFetched);
  useEffect(() => {
    if (id && !hasFetched) {
      setHasFetched(true);
      dispatch(getOrderById(id));
    }
  }, [id, dispatch, hasFetched]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  // Loading state
  if (loading || !hasFetched) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
              Loading Order Details...
            </h2>
            <p className="text-black-light font-montserrat-regular-400">
              Please wait while we fetch your order information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No order data found
  if (!loading && hasFetched && (!orderData || !orderData._id)) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
              Order Not Found
            </h2>
            <p className="text-black-light font-montserrat-regular-400 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <button
              onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })}
              className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract order data
  const orderNumber = orderData.orderNumber || orderData._id;
  const shippingAddress = orderData.shippingAddress || {};
  const billingAddress = orderData.billingAddress || shippingAddress;
  const items = orderData.items || [];
  
  // Calculate subtotal from items
  const calculatedSubtotal = items.reduce((sum, item) => {
    return sum + (item.totalPrice || item.unitPrice * (item.quantity || 1) || 0);
  }, 0);
  
  const totals = orderData.totals || {};
  const subtotal = totals.subtotal || calculatedSubtotal;
  const shippingCost = totals.shipping || 0;
  const finalTotal = totals.total || (subtotal + shippingCost);
  const paymentMethod = orderData.paymentMethod || 'Credit Card';
  const orderStatus = orderData.status || 'pending';
  const paymentStatus = orderData.paymentStatus || 'pending';
  const notes = orderData.notes || '';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <section className="py-6 md:py-16 bg-white border-b border-primary-light">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })}
            className="flex items-center space-x-2 text-black-light hover:text-primary transition-colors duration-300 mb-6 font-montserrat-medium-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-sorts-mill-gloudy text-black mb-4">
                Order Details<span className="text-primary">.</span>
              </h1>
              <p className="text-black-light font-montserrat-regular-400">
                Order #{orderNumber}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-montserrat-medium-500 flex items-center space-x-2 ${getStatusColor(orderStatus)}`}>
                {getStatusIcon(orderStatus)}
                <span className="capitalize">{orderStatus}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Order Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">Order Number</p>
                    <p className="text-lg font-montserrat-semibold-600 text-black">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">Order Date</p>
                    <p className="text-lg font-montserrat-semibold-600 text-black flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(orderData.createdAt)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">Payment Method</p>
                    <p className="text-lg font-montserrat-semibold-600 text-black flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{paymentMethod}</span> 
                      
                    </p>
                    
                    <p className="text-sm font-montserrat-regular-400 text-black capitalize"><span className="font-montserrat-medium-500 text-black ">Payment Status:</span> {paymentStatus}</p>
                    {Object.keys(cardDetails).length > 0 && (
                      <>
                      <p className="text-sm font-montserrat-regular-400 text-black"><span className="font-montserrat-medium-500 text-black">Last 4:</span> {cardDetails?.last4}</p>
                        <p className="text-sm font-montserrat-regular-400 text-black"><span className="font-montserrat-medium-500 text-black">Brand:</span> {cardDetails?.brand}</p>
                        <p className="text-sm font-montserrat-regular-400 text-black"><span className="font-montserrat-medium-500 text-black">Expiry:</span> {cardDetails?.expiryMonth}/{cardDetails?.expiryYear}</p>
                       
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-montserrat-medium-500 text-black-light mb-1">Total Amount</p>
                    <PriceDisplay 
                      price={finalTotal}
                      className="text-lg font-montserrat-bold-700 text-primary"
                    />
                  </div>
                
                  
                </div>
                {notes && (
                  <div className="mt-6 pt-6 border-t border-primary-light">
                    <p className="text-sm font-montserrat-medium-500 text-black-light mb-2">Order Notes</p>
                    <p className="text-sm font-montserrat-regular-400 text-black">{notes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Order Items
                  </h2>
                </div>
               <div className="space-y-4">
  {items.length > 0 ? (
    items.map((item, index) => {
      const productName = item.productName || item.title || "Product";
      const productImage = item.productImage || item.images?.[0] || item.image;
      const quantity = item.quantity || 1;
      const unitPrice = item.unitPrice || 0;
      const totalPrice = item.totalPrice || unitPrice * quantity;

      const metalName = item.metalName || "";
      const stoneName = item.stoneName || "";
      const ringSize = item.ringSize || "";
      const purityLevel = item.purityLevel ? `${item.purityLevel.karat}K` : "";

      return (
        <div
          key={item._id || index}
          className="border border-primary-light rounded-xl p-4 bg-white 
                     shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">

            {/* Product Image */}
            {productImage ? (
              <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg bg-gray-50 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
            )}

            {/* Right Section */}
            <div className="flex-1">
              <h4 className="font-montserrat-semibold-600 text-lg text-black mb-2 break-words capitalize">
                {productName}
              </h4>

              <div className="space-y-1 mb-3">
                <p className="text-sm text-black-light">
                  Quantity:{" "}
                  <span className="font-montserrat-medium-500 text-black">
                    {quantity} × <PriceDisplay
                    price={unitPrice}
                    variant='small'
                    className="font-montserrat-medium-500 text-black inline"
                  />
                  </span>
                </p>

                {metalName && (
                  <p className="text-sm text-black-light">
                    Metal:{" "}
                    <span className="font-montserrat-medium-500 text-black capitalize">
                      {metalName} {purityLevel && `(${purityLevel})`}
                    </span>
                  </p>
                )}

                {stoneName && (
                  <p className="text-sm text-black-light">
                    Stone:{" "}
                    <span className="font-montserrat-medium-500 text-black">
                      {stoneName}
                    </span>
                  </p>
                )}

                {ringSize && (
                  <p className="text-sm text-black-light">
                    Ring Size:{" "}
                    <span className="font-montserrat-medium-500 text-black">
                      {ringSize}
                    </span>
                  </p>
                )}

                {/* {item.stonePrice > 0 && (
                  <p className="text-sm text-black-light flex">
                    Stone Price:{" "}
                    <PriceDisplay
                      price={item.stonePrice}
                      variant="small"
                      className="font-montserrat-medium-500 text-black ml-1"
                    />
                  </p>
                )} */}
              </div>

              {/* Prices Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                              space-y-2 sm:space-y-0 border-t border-primary-light pt-3">

                {/* <p className="text-sm text-black-light">
                  Unit Price:{" "}
                  <PriceDisplay
                    price={unitPrice}
                    className="font-montserrat-medium-500 text-black inline"
                  />
                </p> */}

                <PriceDisplay
                  price={totalPrice}
                  className="text-lg font-montserrat-bold-700 text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-sm text-black-light font-montserrat-regular-400 text-center py-8">
      No items found
    </p>
  )}
</div>

              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                  {shippingAddress.street && <p>{shippingAddress.street}</p>}
                  {(shippingAddress.city || shippingAddress.state || shippingAddress.zipCode) && (
                    <p>
                      {shippingAddress.city}{shippingAddress.city && shippingAddress.state ? ', ' : ''}
                      {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                  )}
                  {shippingAddress.country && <p>{shippingAddress.country}</p>}
                </div>
                
              </div>

              {/* Billing Address (if different) */}
              {billingAddress && billingAddress.street && 
               (billingAddress.street !== shippingAddress.street || 
                billingAddress.city !== shippingAddress.city) && (
                <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-sorts-mill-gloudy text-black">
                      Billing Address
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                    {billingAddress.street && <p>{billingAddress.street}</p>}
                    {(billingAddress.city || billingAddress.state || billingAddress.zipCode) && (
                      <p>
                        {billingAddress.city}{billingAddress.city && billingAddress.state ? ', ' : ''}
                        {billingAddress.state} {billingAddress.zipCode}
                      </p>
                    )}
                    {billingAddress.country && <p>{billingAddress.country}</p>}
                  </div>
                 
                </div>
              )}
              
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-8">
                <h3 className="text-xl font-sorts-mill-gloudy text-black mb-6">
                  Order Summary<span className="text-primary">.</span>
                </h3>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-montserrat-regular-400 text-black-light">
                      Subtotal
                    </span>
                    <PriceDisplay 
                      price={subtotal}
                      className="text-sm font-montserrat-semibold-600 text-black"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-montserrat-regular-400 text-black-light">
                      Shipping {subtotal > 500 && <span className="text-green-600">(Free)</span>}
                    </span>
                    <PriceDisplay 
                      price={shippingCost}
                      className="text-sm font-montserrat-semibold-600 text-black"
                    />
                  </div>
                  <div className="border-t border-primary-light pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-montserrat-bold-700 text-black">
                        Total
                      </span>
                      <PriceDisplay 
                        price={finalTotal}
                        className="text-xl font-montserrat-bold-700 text-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })}
                    className="w-full border-2 border-primary text-primary font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Back to Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;

