import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { Country, State } from 'country-state-city';
import { clearCart, clearCartItems } from '../store/slices/cartSlice';
import { createOrder as createOrderAction } from '../store/slices/ordersSlice';
import ShippingStep from '../components/checkout/ShippingStep';
import PayPalPaymentStep from '../components/checkout/PayPalPaymentStep';
import ReviewStep from '../components/checkout/ReviewStep';
import OrderSummary from '../components/checkout/OrderSummary';
import ProgressSteps from '../components/checkout/ProgressSteps';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { creating: isPlacingOrder } = useSelector(state => state.orders);
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Review, 3: Payment
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [paypalApprovalUrl, setPaypalApprovalUrl] = useState(null);
  
  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  console.log('shippingInfo :', shippingInfo);
  
  const [useBillingAddress, setUseBillingAddress] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  console.log('billingInfo :', billingInfo);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');

  // Shipping cost calculation
  const shippingCost = totalPrice > 500 ? 0 : 0;
  const finalTotal = totalPrice;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Move to Review step
  };

  const handleEditShipping = () => {
    setStep(1);
  };

  // Create order when proceeding from Review to Payment
  const handleReviewSubmit = async () => {
    try {
      // Helper function to get country name from code
      const getCountryName = (countryCode) => {
        if (!countryCode) return '';
        const country = Country.getAllCountries().find(c => c.isoCode === countryCode);
        return country ? country.name : countryCode;
      };

      // Helper function to get state name from code
      const getStateName = (stateCode, countryCode) => {
        if (!stateCode || !countryCode) return '';
        const states = State.getStatesOfCountry(countryCode);
        const state = states.find(s => s.isoCode === stateCode);
        return state ? state.name : stateCode;
      };

      // Convert shipping address codes to names
      const shippingCountryName = getCountryName(shippingInfo.country);
      const shippingStateName = getStateName(shippingInfo.state, shippingInfo.country);

      // Prepare shipping address with actual names
      const shippingAddress = {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingStateName,
        zipCode: shippingInfo.zipCode,
        country: shippingCountryName
      };

      // Prepare billing address
      let billingAddress;
      if (useBillingAddress) {
        // Convert billing address codes to names
        const billingCountryName = getCountryName(billingInfo.country);
        const billingStateName = getStateName(billingInfo.state, billingInfo.country);
        billingAddress = {
          street: billingInfo.address,
          city: billingInfo.city,
          state: billingStateName,
          zipCode: billingInfo.zipCode,
          country: billingCountryName
        };
      } else {
        // Use shipping address (already converted to names)
        billingAddress = { ...shippingAddress };
      }

      // Prepare order data for PayPal
      const orderData = {
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        phone: shippingInfo.phone,
        paymentMethod: "PayPal",
        notes: "Please handle with care"
      };

      // Create PayPal order
      const result = await dispatch(createOrderAction(orderData));
      
      if (createOrderAction.fulfilled.match(result)) {
        const orderResponse = result.payload;
        const responseData = orderResponse.data || orderResponse;
        
        // Check if this is a PayPal order response
        if (responseData.paypalOrderId) {
          setPaypalOrderId(responseData.paypalOrderId);
          setPaypalApprovalUrl(responseData.approvalUrl || null);
          setCreatedOrder(responseData);
          setStep(3); // Move to Payment step
        } else {
          // If order was created but not PayPal, store it
          setCreatedOrder(responseData);
          setStep(3);
        }
      } else {
        // Error creating order - show error and stay on review step
        console.error('Failed to create order:', result);
        const errorMessage = result.payload || result.error?.message || 'Failed to create order. Please try again.';
        alert(errorMessage); // TODO: Replace with proper toast/notification
        // Stay on review step so user can try again
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePaymentSuccess = async (orderData) => {
    // Clear cart after successful payment
    await dispatch(clearCartItems());
    dispatch(clearCart());
    
    // Store order data for success page
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Navigate to success page with order ID
    const orderId = orderData._id || orderData.orderNumber;
    if (orderId) {
      navigate(`/order-success/${orderId}`);
    } else {
      // Fallback if no ID is available
      navigate('/order-success', { 
        state: { 
          orderData: orderData,
          orderNumber: orderData.orderNumber || orderData._id
        } 
      });
    }
  };


  // Check if user can navigate to a specific step
  const canNavigateToStep = (targetStep) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) {
      // Check if shipping info is complete
      return shippingInfo.firstName && shippingInfo.lastName && shippingInfo.email && 
             shippingInfo.phone && shippingInfo.address && shippingInfo.city && 
             shippingInfo.state && shippingInfo.zipCode && shippingInfo.country;
    }
    if (targetStep === 3) {
      // Can only go to payment step if order has been created
      return createdOrder !== null;
    }
    return false;
  };

  const handleStepNavigation = (targetStep) => {
    if (canNavigateToStep(targetStep)) {
      setStep(targetStep);
    }
  };

  // Define steps for the progress indicator
  const steps = [
    {
      title: 'Shipping',
      description: 'Enter your shipping information',
      icon: MapPin
    },
    {
      title: 'Review',
      description: 'Review and confirm your order',
      icon: CheckCircle
    },
    {
      title: 'Payment',
      description: 'Complete your payment',
      icon: CreditCard
    }
  ];

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-sorts-mill-gloudy text-black mb-4">
            Your cart is empty<span className="text-primary">.</span>
          </h2>
          <p className="text-black-light font-montserrat-regular-400 mb-8">
            Add some beautiful jewelry to your cart before checking out.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }


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
          <h1 className="text-3xl md:text-5xl font-sorts-mill-gloudy text-black mb-4">
            Checkout<span className="text-primary">.</span>
          </h1>
          <p className="text-black-light font-montserrat-regular-400">
            Complete your order in just a few steps
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <ProgressSteps
        currentStep={step}
        totalSteps={3}
        steps={steps}
        onStepClick={handleStepNavigation}
        canNavigateToStep={canNavigateToStep}
        showIcons={true}
        showDescriptions={true}
        variant="default"
      />

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 lg:order-1 order-2">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <ShippingStep
                  shippingInfo={shippingInfo}
                  onShippingChange={handleShippingChange}
                  billingInfo={billingInfo}
                  onBillingChange={handleBillingChange}
                  useBillingAddress={useBillingAddress}
                  onUseBillingAddressChange={setUseBillingAddress}
                  onSubmit={handleShippingSubmit}
                  loading={false}
                />
              )}

              {/* Step 2: Review Order */}
              {step === 2 && (
                <ReviewStep
                  shippingInfo={shippingInfo}
                  billingInfo={useBillingAddress ? billingInfo : null}
                  onEditShipping={handleEditShipping}
                  onSubmit={handleReviewSubmit}
                  loading={isPlacingOrder}
                />
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                paypalOrderId ? (
                  <PayPalPaymentStep
                    orderId={paypalOrderId}
                    orderTotal={finalTotal}
                    approvalUrl={paypalApprovalUrl}
                    onPaymentSuccess={handlePaymentSuccess}
                    onBack={() => setStep(2)}
                    loading={isPlacingOrder}
                  />
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                    <div className="text-center py-12">
                      <p className="text-red-600 font-montserrat-medium-500 mb-4">
                        Payment information is not available. Please go back and try again.
                      </p>
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                      >
                        Back to Review
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 lg:order-2 order-1
            ">
              <OrderSummary
                items={items}
                totalPrice={totalPrice}
                shippingCost={shippingCost}
                finalTotal={finalTotal}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;

