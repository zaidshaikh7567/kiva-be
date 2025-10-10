import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, ArrowLeft, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import PriceDisplay from '../components/PriceDisplay';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');

  // Generate order number on component mount
  useEffect(() => {
    const generatedOrderNumber = `#ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderNumber(generatedOrderNumber);
    
    // Get order data from location state or localStorage
    const data = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder') || '{}');
    setOrderData(data);
  }, [location.state]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Here you would typically navigate to an order details page
    alert('Order details page would be implemented here');
  };

  if (!orderData) {
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

  const { shippingInfo, paymentInfo, items, totalPrice, shippingCost, finalTotal } = orderData;

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Number */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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
                    Confirmation sent to {shippingInfo.email}
                  </p>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-sorts-mill-gloudy text-black">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                  <p className="font-montserrat-semibold-600 text-black text-lg">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{shippingInfo.email}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{shippingInfo.phone}</span>
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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
                      {paymentInfo.cardName}
                    </p>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h3 className="text-xl font-sorts-mill-gloudy text-black mb-6">
                  Order Summary<span className="text-primary">.</span>
                </h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-primary-light">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-montserrat-semibold-600 text-sm text-black truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-black-light font-montserrat-regular-400">
                          Qty: {item.quantity}
                        </p>
                        <PriceDisplay 
                          price={item.price * item.quantity}
                          className="text-sm font-montserrat-bold-700 text-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-montserrat-regular-400 text-black-light">
                      Subtotal
                    </span>
                    <PriceDisplay 
                      price={totalPrice}
                      className="text-sm font-montserrat-semibold-600 text-black"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-montserrat-regular-400 text-black-light">
                      Shipping {totalPrice > 500 && <span className="text-green-600">(Free)</span>}
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
