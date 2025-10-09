import React, { useState } from 'react';
import { CreditCard, User, Lock, Smartphone, Globe } from 'lucide-react';

const PaymentStep = ({ paymentInfo, onPaymentChange, onSubmit, onBack, loading }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      color: 'bg-blue-500'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with your Google account',
      color: 'bg-gray-800'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Globe,
      description: 'Pay with your PayPal account',
      color: 'bg-blue-600'
    },
    {
      id: 'wise',
      name: 'Wise',
      icon: Globe,
      description: 'International money transfer',
      color: 'bg-green-600'
    }
  ];

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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

      {/* Payment Method Selection - Enhanced Cards */}
      <div className="mb-8">
        <h3 className="text-lg font-montserrat-semibold-600 text-black mb-4">
          Select Payment Method
        </h3>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-300 ${
                  selectedPaymentMethod === method.id
                    ? 'bg-white shadow-md border-2 border-primary'
                    : 'bg-transparent hover:bg-white hover:shadow-sm border-2 border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method.color} shadow-sm`}>
                  <method.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-center">
                  <h4 className="text-xs font-montserrat-semibold-600 text-black leading-tight">
                    {method.name}
                  </h4>
                  <p className="text-xs font-montserrat-regular-400 text-black-light mt-1 leading-tight">
                    {method.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Form based on selected method */}
      {selectedPaymentMethod === 'card' && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-montserrat-semibold-600 text-black">Credit/Debit Card</span>
            </div>
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Card Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={onPaymentChange}
                required
                maxLength="19"
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="1234 5678 9012 3456"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Cardholder Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                name="cardName"
                value={paymentInfo.cardName}
                onChange={onPaymentChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={onPaymentChange}
                required
                maxLength="5"
                className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                CVV *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
                <input
                  type="text"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={onPaymentChange}
                  required
                  maxLength="3"
                  className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Google Pay */}
      {selectedPaymentMethod === 'googlepay' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="font-montserrat-semibold-600 text-black">Google Pay</span>
            </div>
          </div>
          
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-base font-montserrat-semibold-600 text-black mb-2">
              Pay with Google Pay
            </h3>
            <p className="text-sm font-montserrat-regular-400 text-black-light mb-4">
              You'll be redirected to Google Pay to complete your payment securely.
            </p>
            <button className="w-full bg-gray-800 text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors duration-300">
              Continue with Google Pay
            </button>
          </div>
        </div>
      )}

      {/* PayPal */}
      {selectedPaymentMethod === 'paypal' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-montserrat-semibold-600 text-black">PayPal</span>
            </div>
          </div>
          
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-montserrat-semibold-600 text-black mb-2">
              Pay with PayPal
            </h3>
            <p className="text-sm font-montserrat-regular-400 text-black-light mb-4">
              You'll be redirected to PayPal to complete your payment securely.
            </p>
            <button className="w-full bg-blue-600 text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Continue with PayPal
            </button>
          </div>
        </div>
      )}

      {/* Wise */}
      {selectedPaymentMethod === 'wise' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-montserrat-semibold-600 text-black">Wise</span>
            </div>
          </div>
          
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-base font-montserrat-semibold-600 text-black mb-2">
              Pay with Wise
            </h3>
            <p className="text-sm font-montserrat-regular-400 text-black-light mb-4">
              You'll be redirected to Wise to complete your international payment securely.
            </p>
            <button className="w-full bg-green-600 text-white font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300">
              Continue with Wise
            </button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-primary-light rounded-lg p-4 my-6">
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
          className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="sm:w-2/3 bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Review Order'}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;