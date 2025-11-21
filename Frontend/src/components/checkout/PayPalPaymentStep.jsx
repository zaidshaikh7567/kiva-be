import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Lock, AlertCircle, Loader } from 'lucide-react';
import { loadScript } from '@paypal/paypal-js';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';

const PayPalPaymentStep = ({ 
  orderId, 
  orderTotal, 
  onPaymentSuccess, 
  onBack, 
  loading,
  approvalUrl // Fallback URL if card fields aren't available
}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [paypal, setPaypal] = useState(null);
  const [cardFields, setCardFields] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [useRedirect, setUseRedirect] = useState(false);
  
  const cardNumberFieldRef = useRef(null);
  const cvvFieldRef = useRef(null);
  const expirationDateFieldRef = useRef(null);

  // Load PayPal client ID and SDK
  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        // Get PayPal client ID from backend
        const response = await api.get(`${API_METHOD.orders}/paypal-client-id`);
        if (response.data.success) {
          const clientId = response.data.data.clientId;
          setClientId(clientId);
          
          // Load PayPal SDK using the package
          try {
            const paypalSDK = await loadScript({
              'client-id': clientId,
              'components': 'card-fields',
              'currency': 'USD',
              'intent': 'capture'
            });
            
            console.log('PayPal SDK loaded:', {
              hasSDK: !!paypalSDK,
              hasCardFields: !!paypalSDK?.CardFields,
              clientId: clientId.substring(0, 10) + '...'
            });
            
            if (paypalSDK) {
              if (!paypalSDK.CardFields) {
                throw new Error('CardFields component not available in PayPal SDK. Make sure card-fields is included in components.');
              }
              setPaypal(paypalSDK);
              setPaypalLoaded(true);
            } else {
              setError('Failed to load PayPal SDK - SDK object is null');
            }
          } catch (scriptError) {
            console.error('Error loading PayPal script:', scriptError);
            setError('Failed to load PayPal SDK. Please try again.');
          }
        } else {
          setError('Failed to load PayPal configuration');
        }
      } catch (err) {
        console.error('Error loading PayPal client ID:', err);
        setError('Failed to load PayPal configuration');
      }
    };

    loadPayPalSDK();
  }, []);

  // Initialize PayPal Card Fields
  useEffect(() => {
    if (!paypal || !clientId || !paypalLoaded || !orderId || useRedirect) return;

    let cardFieldsInstance = null;
    let numberField = null;
    let cvvField = null;
    let expirationField = null;

    const initializeCardFields = async () => {
      try {
        // Check if CardFields is available
        if (!paypal.CardFields) {
          throw new Error('PayPal CardFields API is not available. Make sure the SDK loaded with card-fields component.');
        }
        
        // Wait a bit to ensure refs are mounted
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if refs are ready
        if (!cardNumberFieldRef.current || !cvvFieldRef.current || !expirationDateFieldRef.current) {
          throw new Error('Card field containers are not ready. Please try refreshing the page.');
        }
        
        cardFieldsInstance = paypal.CardFields({
          createOrder: async () => {
            // Return the order ID that was already created
            console.log('Creating order with ID:', orderId);
            return orderId;
          },
          onApprove: async (data) => {
            // Payment approved, capture it
            try {
              setIsProcessing(true);
              setError(null);
              
              // Call backend to capture payment
              const response = await api.post(`${API_METHOD.orders}/capture-paypal`, {
                paypalOrderId: data.orderID
              });

              if (response.data.success) {
                onPaymentSuccess(response.data.data);
              } else {
                setError(response.data.message || 'Payment failed');
                setIsProcessing(false);
              }
            } catch (err) {
              console.error('Payment capture error:', err);
              setError(err.response?.data?.message || 'Failed to process payment');
              setIsProcessing(false);
            }
          },
          onError: (err) => {
            console.error('PayPal Card Fields error:', err);
            let errorMessage = 'An error occurred with PayPal';
            
            if (err?.message?.includes('card payments are not eligible')) {
              // If card fields aren't available, offer redirect as fallback
              if (approvalUrl) {
                setUseRedirect(true);
                errorMessage = 'Card fields are not available. You will be redirected to PayPal to complete payment.';
              } else {
                errorMessage = 'Card payments are not enabled for this PayPal account. Please enable card processing in your PayPal Business account settings.';
              }
            } else if (err?.message) {
              errorMessage = err.message;
            }
            
            setError(errorMessage);
            setIsProcessing(false);
          }
        });

        setCardFields(cardFieldsInstance);

        // Debug: Log available methods
        console.log('CardFields instance methods:', Object.keys(cardFieldsInstance));
        console.log('CardFields instance:', cardFieldsInstance);
        
        // If card payments are not eligible, we'll catch it during render
        // but let's also check if we should just use redirect upfront

        // Render card fields
        if (cardNumberFieldRef.current) {
          if (typeof cardFieldsInstance.NumberField !== 'function') {
            throw new Error('NumberField method is not available on CardFields instance');
          }
          numberField = cardFieldsInstance.NumberField();
          numberField.render(cardNumberFieldRef.current).catch((renderErr) => {
          console.error('Error rendering card number field:', renderErr);
          if (renderErr?.message?.includes('card payments are not eligible')) {
            if (approvalUrl) {
              setUseRedirect(true);
              setError('Card fields are not available. You will be redirected to PayPal to complete payment.');
            } else {
              setError('Card payments are not enabled for this PayPal account. Please contact support or use a different payment method.');
            }
          } else {
            setError('Failed to initialize card number field. Please try again or contact support.');
          }
        });
      }
      if (cvvFieldRef.current) {
        if (typeof cardFieldsInstance.CVVField !== 'function') {
          throw new Error('CVVField method is not available on CardFields instance');
        }
        cvvField = cardFieldsInstance.CVVField();
        cvvField.render(cvvFieldRef.current).catch((renderErr) => {
          console.error('Error rendering CVV field:', renderErr);
          if (renderErr?.message?.includes('card payments are not eligible')) {
            if (approvalUrl) {
              setUseRedirect(true);
              setError('Card fields are not available. You will be redirected to PayPal to complete payment.');
            } else {
              setError('Card payments are not enabled for this PayPal account. Please contact support or use a different payment method.');
            }
          } else {
            setError('Failed to initialize CVV field. Please try again or contact support.');
          }
        });
      }
      if (expirationDateFieldRef.current) {
        // Try different possible method names
        let expirationMethod = null;
        if (typeof cardFieldsInstance.ExpirationDateField === 'function') {
          expirationMethod = cardFieldsInstance.ExpirationDateField;
        } else if (typeof cardFieldsInstance.ExpiryField === 'function') {
          expirationMethod = cardFieldsInstance.ExpiryField;
        } else if (typeof cardFieldsInstance.ExpirationField === 'function') {
          expirationMethod = cardFieldsInstance.ExpirationField;
        } else {
          console.error('Available methods:', Object.keys(cardFieldsInstance));
          throw new Error('Expiration date field method is not available. Available methods: ' + Object.keys(cardFieldsInstance).join(', '));
        }
        
        expirationField = expirationMethod();
        expirationField.render(expirationDateFieldRef.current).catch((renderErr) => {
          console.error('Error rendering expiration field:', renderErr);
          if (renderErr?.message?.includes('card payments are not eligible')) {
            if (approvalUrl) {
              setUseRedirect(true);
              setError('Card fields are not available. You will be redirected to PayPal to complete payment.');
            } else {
              setError('Card payments are not enabled for this PayPal account. Please contact support or use a different payment method.');
            }
          } else {
            setError('Failed to initialize expiration field. Please try again or contact support.');
          }
        });
      }
      } catch (err) {
        console.error('Error initializing PayPal Card Fields:', err);
        console.error('Error details:', {
          message: err?.message,
          name: err?.name,
          stack: err?.stack,
          paypal: !!paypal,
          clientId: !!clientId,
          orderId: orderId,
          paypalLoaded: paypalLoaded
        });
        
        let errorMessage = 'Failed to initialize payment form.';
        
        if (err?.message?.includes('card payments are not eligible')) {
          // If card fields aren't available, offer redirect as fallback
          if (approvalUrl) {
            setUseRedirect(true);
            errorMessage = 'Card fields are not available. You will be redirected to PayPal to complete payment.';
          } else {
            errorMessage = 'Card payments are not enabled for this PayPal account. Please enable card processing in your PayPal Business account settings or contact PayPal support.';
          }
        } else if (err?.message) {
          errorMessage = `Payment initialization error: ${err.message}`;
        } else if (!paypal?.CardFields) {
          errorMessage = 'PayPal Card Fields API is not available. The SDK may not have loaded correctly.';
        } else {
          errorMessage = `Failed to initialize payment form: ${err?.toString() || 'Unknown error'}`;
        }
        
        setError(errorMessage);
      }
    };

    // Call the async function
    initializeCardFields();

    // Cleanup function
    return () => {
      if (numberField) {
        try {
          numberField.close();
        } catch (e) {
          console.error('Error closing number field:', e);
        }
      }
      if (cvvField) {
        try {
          cvvField.close();
        } catch (e) {
          console.error('Error closing CVV field:', e);
        }
      }
      if (expirationField) {
        try {
          expirationField.close();
        } catch (e) {
          console.error('Error closing expiration field:', e);
        }
      }
    };
  }, [paypal, clientId, paypalLoaded, orderId, onPaymentSuccess, approvalUrl, useRedirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardFields) {
      setError('Payment form not ready');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Submit the card fields
      await cardFields.submit();
    } catch (err) {
      console.error('Payment submission error:', err);
      setError(err.message || 'Failed to submit payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-sorts-mill-gloudy text-black">
            Payment Information
          </h2>
          <p className="text-sm text-black-light font-montserrat-regular-400">
            Complete your payment securely with PayPal
          </p>
        </div>
      </div>

      {!paypalLoaded && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-black-light font-montserrat-regular-400">
            Loading payment form...
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-montserrat-semibold-600 text-red-800">
              Payment Error
            </p>
          </div>
          <p className="text-sm font-montserrat-regular-400 text-red-700 ml-8">
            {error}
          </p>
          {error.includes('card payments are not eligible') && (
            <div className="mt-3 ml-8 text-xs font-montserrat-regular-400 text-red-600">
              <p className="mb-1"><strong>To fix this issue:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Log into your PayPal Business account</li>
                <li>Go to Account Settings → Payment Preferences</li>
                <li>Enable "Accept credit and debit card payments"</li>
                <li>Complete any required verification steps</li>
              </ul>
              <p className="mt-2">For sandbox testing, ensure your test business account has card processing enabled.</p>
            </div>
          )}
        </div>
      )}

      {useRedirect && approvalUrl && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-montserrat-regular-400 text-yellow-800 mb-4">
              Card payment fields are not available. You will be redirected to PayPal's secure payment page to complete your payment.
            </p>
            <button
              type="button"
              onClick={() => window.location.href = approvalUrl}
              className="w-full bg-blue-600 text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg"
            >
              Continue to PayPal
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing || loading}
              className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {paypalLoaded && !useRedirect && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Card Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light z-10" />
              <div
                ref={cardNumberFieldRef}
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
                id="card-number-field"
              />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Expiry Date *
              </label>
              <div
                ref={expirationDateFieldRef}
                className="w-full px-4 py-3 border border-primary-light rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
                id="expiration-date-field"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                CVV *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light z-10" />
                <div
                  ref={cvvFieldRef}
                  className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
                  id="cvv-field"
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-primary-light rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Your payment information is encrypted and secure. We never store your complete payment details.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing || loading}
              className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing || loading || !paypalLoaded}
              className="sm:w-2/3 bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing || loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ${orderTotal?.toFixed(2) || '0.00'}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PayPalPaymentStep;

