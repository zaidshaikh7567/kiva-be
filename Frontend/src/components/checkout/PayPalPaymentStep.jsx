import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Lock, AlertCircle, Loader } from 'lucide-react';
import { loadScript } from '@paypal/paypal-js';
import api from '../../services/api';
import { API_METHOD } from '../../services/apiMethod';
import PriceDisplay from '../PriceDisplay';

const PayPalPaymentStep = ({
  orderId,
  orderTotal,
  onPaymentSuccess,
  onBack,
  loading,
  approvalUrl, // Fallback URL if card fields aren't available
  paymentMethod,
  setPaymentMethod
}) => {

  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [paypal, setPaypal] = useState(null);
  const [cardFields, setCardFields] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  console.log('error :', error);
  const [useRedirect, setUseRedirect] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);

  const cardNumberFieldRef = useRef(null);
  const cvvFieldRef = useRef(null);
  const expirationDateFieldRef = useRef(null);
  const paypalButtonsRef = useRef(null);

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
              'components': 'buttons,card-fields',
              'currency': 'USD',
              'intent': 'capture'
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

  // Initialize PayPal Smart Payment Buttons when PayPal method is selected
  useEffect(() => {
    if (!paypal || !clientId || !paypalLoaded || !orderId || paymentMethod !== 'paypal' || paypalButtonsRendered) return;

    const initializePayPalButtons = async () => {
      try {
        if (!paypal.Buttons) {
          console.warn('PayPal Buttons component not available');
          return;
        }

        // Wait for the ref to be available
        const waitForRef = () => {
          return new Promise((resolve) => {
            if (paypalButtonsRef.current) {
              resolve();
            } else {
              const interval = setInterval(() => {
                if (paypalButtonsRef.current) {
                  clearInterval(interval);
                  resolve();
                }
              }, 100);
              setTimeout(() => {
                clearInterval(interval);
                resolve();
              }, 5000);
            }
          });
        };

        await waitForRef();

        if (!paypalButtonsRef.current) {
          console.error('PayPal buttons container ref not available');
          return;
        }

        const buttons = paypal.Buttons({
          createOrder: async () => {
            return orderId;
          },
          onApprove: async (data) => {
            try {
              setIsProcessing(true);
              setError(null);

              const paypalOrderId = data.orderID || data.orderId || data.id || orderId;

              if (!paypalOrderId) {
                throw new Error('PayPal order ID not found in response');
              }

              console.log('Capturing PayPal payment with order ID:', paypalOrderId);

              const response = await api.post(`${API_METHOD.orders}/capture-paypal`, {
                paypalOrderId: paypalOrderId
              });
              console.log('response capture-paypal :', response);

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
            console.error('PayPal Buttons error:', err);
            setError(err.message || 'An error occurred with PayPal');
            setIsProcessing(false);
          },
          onCancel: () => {
            setError('Payment was cancelled');
            setIsProcessing(false);
          }
        });

        buttons.render(paypalButtonsRef.current).then(() => {
          setPaypalButtonsRendered(true);
        }).catch((err) => {
          console.error('Error rendering PayPal buttons:', err);
          setError('Failed to load PayPal button. Please try again.');
        });
      } catch (err) {
        console.error('Error initializing PayPal buttons:', err);
        setError('Failed to initialize PayPal payment');
      }
    };

    initializePayPalButtons();
  }, [paypal, clientId, paypalLoaded, orderId, paymentMethod, paypalButtonsRendered, onPaymentSuccess]);

  // Initialize PayPal Card Fields when Card method is selected
  useEffect(() => {
    if (!paypal || !clientId || !paypalLoaded || !orderId || paymentMethod !== 'card' || useRedirect) return;

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

        // PayPal Card Fields styling configuration
        // Note: PayPal uses camelCase for CSS properties
        const cardFieldStyles = {
          input: {
            fontSize: '16px',
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: '400',
            color: '#051F34',
            padding: '0',
            backgroundColor: 'transparent',
            lineHeight: '1.5',
            borderRadius: '0',
            border: 'none',
            outline: 'none',
            width: '100%',
            height: '100%',
            boxShadow: 'none',
          },
          '.invalid': {
            color: '#051F34',
            borderColor: 'transparent',
            boxShadow: 'none',
          },
          ':focus': {
            color: '#051F34',
            outline: 'none',
            boxShadow: 'none',
            borderColor: 'transparent',
          },
          '::placeholder': {
            color: '#9CA3AF',
            opacity: '1',
            fontWeight: '400',
          }
        };

        cardFieldsInstance = paypal.CardFields({
          style: cardFieldStyles,
          createOrder: async () => {
            // Return the order ID that was already created
            console.log('Creating order with ID:', orderId);
            return orderId;
          },

          onApprove: async (data) => {
            console.log(cardFieldsInstance, 'cardFieldsInstance');
            // Payment approved, capture it
            try {
              setIsProcessing(true);
              setError(null);

              // PayPal returns orderID in the data object
              const paypalOrderId = data.orderID || data.orderId || data.id || orderId;

              if (!paypalOrderId) {
                throw new Error('PayPal order ID not found in response');
              }

              console.log('Capturing PayPal payment with order ID:', paypalOrderId);

              // Call backend to capture payment
              const response = await api.post(`${API_METHOD.orders}/capture-paypal`, {
                paypalOrderId: paypalOrderId
              });

              if (response.data.success) {
                onPaymentSuccess(response.data.data);
              } else {
                console.log('check -------------->2');
                setError(response.data.message || 'Payment failed');
                setIsProcessing(false);
              }
            } catch (err) {
              console.error('Payment capture error:', err);
              console.log('check -------------->1');
              
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

            console.log('errorMessage :', errorMessage);
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
  }, [paypal, clientId, paypalLoaded, orderId, paymentMethod, onPaymentSuccess, approvalUrl, useRedirect]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!cardFields) {
      setError("Payment form not ready");
      return;
    }
  
    try {
      setIsProcessing(true);
      setError(null);
  
      const result = await cardFields.submit();
      console.log("PayPal confirm result:", result);
  
      // ----- CASE 1: 3DS Challenge Required -----
      if (result?.status === "PAYER_ACTION_REQUIRED") {
        console.log("3DS required → waiting for user action");
        return; // Wait for PayPal popup to finish, then onApprove will fire
      }
  
      // ----- CASE 2: No 3DS → SUCCESS but result === null -----
      if (!result) {
        console.log("No 3DS → confirm-payment-source succeeded silently");
        console.log("Waiting for PayPal onApprove() callback...");
        return; // onApprove will run next
      }
  
      // ----- Anything else unexpected -----
      console.warn("Unexpected submit result:", result);
  
    } catch (err) {
      console.log("Submit error:", err);
  
      if (err?.message?.includes("Window closed")) {
        setError("The PayPal window was closed before completing verification.");
      } else {
        setError(err?.message || "Failed to submit payment.");
      }
    } finally {
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
            Choose your preferred payment method
          </p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
          Select Payment Method
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('card');
              setError(null);
              setPaypalButtonsRendered(false);
            }}
            className={`p-4 border-2 rounded-lg transition-all duration-300 ${
              paymentMethod === 'card'
                ? 'border-primary bg-primary-light'
                : 'border-primary-light hover:border-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-black-light'}`} />
              <span className={`font-montserrat-medium-500 ${paymentMethod === 'card' ? 'text-primary' : 'text-black'}`}>
                Credit/Debit Card
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('paypal');
              setError(null);
              setPaypalButtonsRendered(false);
            }}
            className={`p-4 border-2 rounded-lg transition-all duration-300 ${
              paymentMethod === 'paypal'
                ? 'border-primary bg-primary-light'
                : 'border-primary-light hover:border-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className={`w-5 h-5 ${paymentMethod === 'paypal' ? 'text-primary' : 'text-black-light'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.351 1.05 3.3.93 4.855v.1c-.011.194-.029.39-.04.582-.307 3.557-1.894 5.447-4.627 5.447h-2.21c-.524 0-.968.382-1.05.9l-1.12 7.338zm8.534-18.487c-.208-.24-.578-.39-1.04-.39H5.998c-.524 0-.968.382-1.05.9L3.309 19.61h3.767l.813-5.326a.641.641 0 0 1 .633-.74h2.903c3.582 0 5.372-1.444 5.97-4.527.261-1.35.177-2.471-.123-3.283z"/>
              </svg>
              <span className={`font-montserrat-medium-500 ${paymentMethod === 'paypal' ? 'text-primary' : 'text-black'}`}>
                PayPal
              </span>
            </div>
          </button>
        </div>
      </div>

      {!paypalLoaded && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-black-light font-montserrat-regular-400">
            Loading payment options...
          </span>
        </div>
      )}

      {error && (
        <div className="mb-0 bg-red-50 border border-red-200 rounded-lg p-4">
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

      {/* Card Payment Method */}
      {paymentMethod === 'card' && paypalLoaded && (
        <>
          {useRedirect && approvalUrl ? (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-2">
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
              </div>
            </div>
          ) : !useRedirect && (
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-sorts-mill-gloudy text-black">
                      Card Information
                    </h3>
                    <p className="text-xs text-gray-500 font-montserrat-regular-400 mt-0.5">
                      Enter your payment card details
                    </p>
                  </div>
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-montserrat-semibold-600 text-black mb-2.5 leading-tight">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group flex items-center">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10 transition-colors duration-200 group-focus-within:text-primary" />
                    <div 
                      ref={cardNumberFieldRef}
                      className="w-full border-2 border-gray-200 rounded-lg bg-white transition-all duration-200 hover:border-primary-light focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center"
                      id="card-number-field"
                      style={{ 
                        minHeight: '64px', 
                        height: '64px',
                        paddingLeft: '48px', 
                        paddingRight: '16px'
                      }}
                    />
                  </div>
                  <p className="text-xs font-montserrat-regular-400 text-gray-500 mt-1.5 leading-relaxed">
                    Enter your 16-digit card number
                  </p>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-montserrat-semibold-600 text-black mb-2.5 leading-tight">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <div
                      ref={expirationDateFieldRef}
                      className="w-full border-2 border-gray-200 rounded-lg bg-white transition-all duration-200 hover:border-primary-light focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center"
                      id="expiration-date-field"
                      style={{ 
                        minHeight: '64px',
                        height: '64px',
                        padding: '0 16px'
                      }}
                    />
                    <p className="text-xs font-montserrat-regular-400 text-gray-500 mt-1.5 leading-relaxed">
                      MM/YY format
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-montserrat-semibold-600 text-black mb-2.5 leading-tight">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group flex items-center">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10 transition-colors duration-200 group-focus-within:text-primary" />
                      <div 
                        ref={cvvFieldRef}
                        className="w-full border-2 border-gray-200 rounded-lg bg-white transition-all duration-200 hover:border-primary-light focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center"
                        id="cvv-field"
                        style={{ 
                          minHeight: '64px',
                          height: '64px',
                          paddingLeft: '48px', 
                          paddingRight: '16px'
                        }}
                      />
                    </div>
                    <p className="text-xs font-montserrat-regular-400 text-gray-500 mt-1.5 leading-relaxed">
                      3-digit security code
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-primary-light rounded-lg p-4 border border-primary-light">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-montserrat-semibold-600 text-black mb-1">
                        Secure Payment
                      </p>
                      <p className="text-sm font-montserrat-regular-400 text-black-light">
                        Your payment information is encrypted and secure. We never store your complete payment details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <div className="flex justify-between gap-4">
                {/* <div className="mt-6 flex flex-col sm:flex-row gap-4"> */}
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
                    className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing || loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <span>
                        Pay <PriceDisplay 
                          price={orderTotal?.toFixed(2) || '0.00'}
                          className="text-md font-montserrat-bold-700 inline ml-1" 
                          variant="small"
                        />
                      </span>
                    )}
                  </button>
                  </div>
                {/* </div> */}
              </form>
            </div>
          )}
        </>
      )}

      {/* PayPal Payment Method */}
      {paymentMethod === 'paypal' && paypalLoaded && (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-2">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.351 1.05 3.3.93 4.855v.1c-.011.194-.029.39-.04.582-.307 3.557-1.894 5.447-4.627 5.447h-2.21c-.524 0-.968.382-1.05.9l-1.12 7.338zm8.534-18.487c-.208-.24-.578-.39-1.04-.39H5.998c-.524 0-.968.382-1.05.9L3.309 19.61h3.767l.813-5.326a.641.641 0 0 1 .633-.74h2.903c3.582 0 5.372-1.444 5.97-4.527.261-1.35.177-2.471-.123-3.283z"/>
                </svg>
              </div>
              <h3 className="text-xl font-sorts-mill-gloudy text-black">
                PayPal Payment
              </h3>
            </div>

            {/* Information Notice */}
            <div className="bg-primary-light rounded-lg p-4 border border-primary-light">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-montserrat-semibold-600 text-black mb-1">
                    Secure PayPal Payment
                  </p>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    Click the PayPal button below to complete your payment securely. You'll be redirected to PayPal's secure payment page.
                  </p>
                </div>
              </div>
            </div>

            {/* PayPal Smart Payment Buttons Container */}
            <div className="pt-2">
              
              <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                Complete Payment with PayPal
              </label>
              <div 
                ref={paypalButtonsRef} 
                id="paypal-buttons-container" 
                className="min-h-[50px] w-full border border-primary-light rounded-lg p-4 bg-gray-50 flex items-center justify-center"
              >
                {!paypalButtonsRendered && (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Loader className="w-6 h-6 text-primary animate-spin mb-2" />
                    <span className="text-sm t  ext-black-light font-montserrat-regular-400">
                      Loading PayPal button...
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs font-montserrat-regular-400 text-black-light">
                You can pay with your PayPal account or credit/debit card
              </p>
            </div>
            <button
          type="button"
          onClick={onBack}
          disabled={isProcessing || loading}
          className="w-full border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
            {/* Fallback: Continue to PayPal button (only if buttons fail to load) */}
            {approvalUrl && !paypalButtonsRendered && (
              <div className="pt-4 border-t border-primary-light">
                <p className="text-sm text-black-light font-montserrat-regular-400 mb-3 text-center">
                  Or continue to PayPal website:
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = approvalUrl}
                  className="w-full bg-blue-600 text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.351 1.05 3.3.93 4.855v.1c-.011.194-.029.39-.04.582-.307 3.557-1.894 5.447-4.627 5.447h-2.21c-.524 0-.968.382-1.05.9l-1.12 7.338zm8.534-18.487c-.208-.24-.578-.39-1.04-.39H5.998c-.524 0-.968.382-1.05.9L3.309 19.61h3.767l.813-5.326a.641.641 0 0 1 .633-.74h2.903c3.582 0 5.372-1.444 5.97-4.527.261-1.35.177-2.471-.123-3.283z"/>
                  </svg>
                  <span>Continue to PayPal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      {/* <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing || loading}
          className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div> */}
    </div>
  );
};

export default PayPalPaymentStep;

