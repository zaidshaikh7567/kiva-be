import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, Package, ShoppingBag, ArrowLeft, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { getOrderById, selectCurrentOrder, selectOrdersLoading } from '../store/slices/ordersSlice';
import PriceDisplay from '../components/PriceDisplay';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const orderData = useSelector(selectCurrentOrder);
  console.log('orderData :', orderData);
  const loading = useSelector(selectOrdersLoading);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch order data by ID
  useEffect(() => {
    if (id && !hasFetched) {
      setHasFetched(true);
      dispatch(getOrderById(id));
    }
  }, [id, dispatch, hasFetched]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    if (orderData?._id || id) {
      navigate(`/orders/${orderData._id || id}`);
    }
  };

  // Loading state - show loading while fetching or if we haven't fetched yet
  if (loading || !hasFetched) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
              Loading Order...
            </h2>
            <p className="text-black-light font-montserrat-regular-400">
              Please wait while we fetch your order details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No order data found - only show this after fetch is complete
  if (!loading && hasFetched && (!orderData || !orderData._id)) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
              No Order Found
            </h2>
            <p className="text-black-light font-montserrat-regular-400 mb-6">
              We couldn't find your order information. Please try again.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract order data
  const orderNumber = orderData.orderNumber || orderData._id;
  const shippingAddress = orderData.shippingAddress || {};
  const items = orderData.items || [];
  console.log('items :', items);
  
  // Calculate subtotal from items (sum of totalPrice for each item)
  const calculatedSubtotal = items.reduce((sum, item) => {
    return sum + (item.totalPrice || item.unitPrice * (item.quantity || 1) || 0);
  }, 0);
  
  const totals = orderData.totals || {};
  const subtotal = totals.subtotal || calculatedSubtotal;
  const shippingCost = totals.shipping || 0;
  const finalTotal = totals.total || (subtotal + shippingCost);
  const paymentMethod = orderData.paymentMethod || 'Credit Card';
  const orderStatus = orderData.status || 'pending';
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

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-white border-b border-primary-light">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-black-light hover:text-primary transition-colors duration-300 mb-6 font-montserrat-medium-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-sorts-mill-gloudy text-black mb-4">
              Order Placed Successfully<span className="text-primary">!</span>
            </h1>
            <p className="text-black-light font-montserrat-regular-400 text-lg mb-8 max-w-2xl mx-auto">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Number */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Order Information
                  </h2>
                </div>
                <div className="bg-secondary rounded-lg p-6">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="text-sm font-montserrat-medium-500 text-black-light">Order Number</span>
                  </div>
                  <p className="text-2xl font-montserrat-bold-700 text-primary text-center mb-2">
                    {orderNumber}
                  </p>
                  <p className="text-sm font-montserrat-regular-400 text-black-light text-center">
                    Order Status: <span className="font-montserrat-semibold-600 capitalize">{orderStatus}</span>
                  </p>
                  {orderData.createdAt && (
                    <p className="text-xs font-montserrat-regular-400 text-black-light text-center mt-2">
                      Placed on {formatOrderDate(orderData.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                  {shippingAddress.street && (
                    <p>{shippingAddress.street}</p>
                  )}
                  {(shippingAddress.city || shippingAddress.state || shippingAddress.zipCode) && (
                    <p>
                      {shippingAddress.city}{shippingAddress.city && shippingAddress.state ? ', ' : ''}
                      {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                  )}
                  {shippingAddress.country && (
                    <p>{shippingAddress.country}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-montserrat-semibold-600 text-black">
                      {paymentMethod}
                    </p>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Payment processed successfully
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-8">
                <h3 className="text-xl font-sorts-mill-gloudy text-black mb-6">
                  Order Summary<span className="text-primary">.</span>
                </h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      const productName = item.productName || item.title || 'Product';
                      const productImage = item.productImage || item.images?.[0] || item.image;
                      const quantity = item.quantity || 1;
                      const unitPrice = item.unitPrice || 0;
                      const totalPrice = item.totalPrice || (unitPrice * quantity);
                      
                      // Additional item details
                      const metalName = item.metalName || '';
                      const stoneName = item.stoneName || '';
                      const ringSize = item.ringSize || '';
                      const purityLevel = item.purityLevel ? `${item.purityLevel.karat}K` : '';
                      
                      return (
                        <div key={item._id || index} className="flex items-center space-x-3 pb-4 border-b border-primary-light">
                          {productImage ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-50 flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-montserrat-semibold-600 text-sm text-black truncate">
                              {productName}
                            </h4>
                            <div className="text-xs text-black-light font-montserrat-regular-400 space-y-1">
                              <p>Qty: {quantity}</p>
                              {metalName && (
                                <p>{metalName} {purityLevel && `(${purityLevel})`}</p>
                              )}
                              {stoneName && <p>Stone: {stoneName}</p>}
                              {ringSize && <p>Size: {ringSize}</p>}
                            </div>
                            <PriceDisplay 
                              price={totalPrice}
                              variant='small'
                              className="text-sm font-montserrat-bold-700 text-primary mt-1"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-black-light font-montserrat-regular-400 text-center py-4">
                      No items found
                    </p>
                  )}
                </div>

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
                    onClick={handleViewOrder}
                    className="w-full bg-primary text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                  >
                    View Order Details
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="w-full border-2 border-primary text-primary font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="w-full text-primary border border-primary font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black mb-4">
              What's Next?<span className="text-primary">.</span>
            </h2>
            <p className="text-black-light font-montserrat-regular-400">
              Here's what happens after placing your order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Order Processing
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                We'll prepare your jewelry with care and attention to detail.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Quality Check
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Each piece is carefully inspected to ensure perfect quality.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Shipping & Delivery
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Your order will be shipped securely and arrive at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
