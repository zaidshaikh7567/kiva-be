import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2, XCircle, CheckCircle } from 'lucide-react';
import { capturePayPalPayment } from '../store/slices/ordersSlice';
import { clearCart, clearCartItems } from '../store/slices/cartSlice';

const PayPalCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handlePayPalCallback = async () => {
      // Get token from URL (PayPal returns token in query params)
      const token = searchParams.get('token');
      console.log('token :', token);

      if (!token) {
        // Check if this is a cancel callback
        const cancel = searchParams.get('cancel');
        if (cancel === 'true') {
          setStatus('error');
          setErrorMessage('Payment was cancelled. You can try again.');
          setTimeout(() => {
            console.log('redirecting to checkout--------------1');
            navigate('/checkout');
          }, 3000);
          return;
        }
        
        setStatus('error');
        setErrorMessage('No payment token found. Please try again.');
        setTimeout(() => {
          console.log('redirecting to checkout--------------2');
          navigate('/checkout');
        }, 3000);
        return;
      }

      try {
        // Capture PayPal payment using the token (which is the order ID)
        const result = await dispatch(capturePayPalPayment({ paypalOrderId: token, paymentMethod: 'paypal' }));
        console.log('result :', result);

        // Check if the action was fulfilled (success) or rejected (error)
        if (capturePayPalPayment.fulfilled.match(result)) {
          const orderResponse = result.payload;
          console.log('orderResponse :', orderResponse);
          
          // Handle different response structures
          const orderData = orderResponse?.data || orderResponse;
          console.log('orderData :', orderData);

          if (!orderData) {
            throw new Error('Order data not found in response');
          }

          // Clear cart after successful payment
          await dispatch(clearCartItems());
          dispatch(clearCart());

          // Store order data for success page
          localStorage.setItem('lastOrder', JSON.stringify(orderData));

          setStatus('success');

          // Navigate to success page
          const orderId = orderData._id || orderData.orderNumber;
          if (orderId) {
            navigate(`/order-success/${orderId}`);
          } else {
            navigate('/order-success', {
              state: {
                orderData: orderData,
                orderNumber: orderData.orderNumber || orderData._id
              }
            });
          }
        } else {
          // Action was rejected
          const errorMsg = result.payload || result.error?.message || 'Failed to capture payment. Please contact support.';
          setStatus('error');
          setErrorMessage(errorMsg);
          setTimeout(() => {
            console.log('redirecting to checkout--------------3');
            navigate('/checkout');
          }, 5000);
        }
      } catch (error) {
        console.error('PayPal callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An error occurred while processing your payment. Please try again.');
        setTimeout(() => {
          console.log('redirecting to checkout--------------4');
          navigate('/checkout');
        }, 5000);
      }
    };

    handlePayPalCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-secondary py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {status === 'processing' && (
            <>
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
                Processing Payment...
              </h2>
              <p className="text-black-light font-montserrat-regular-400">
                Please wait while we confirm your payment with PayPal.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
                Payment Successful!
              </h2>
              <p className="text-black-light font-montserrat-regular-400">
                Redirecting to order confirmation...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
                Payment Failed
              </h2>
              <p className="text-black-light font-montserrat-regular-400 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                Return to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayPalCallback;

