import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PayPalCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-sorts-mill-gloudy text-black mb-4">
            Payment Cancelled
          </h2>
          <p className="text-black-light font-montserrat-regular-400 mb-6">
            You cancelled the PayPal payment. Your order has not been placed. You can return to checkout to try again or choose a different payment method.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/checkout')}
              className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Checkout</span>
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 border-2 border-primary text-primary font-montserrat-medium-500 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalCancel;

