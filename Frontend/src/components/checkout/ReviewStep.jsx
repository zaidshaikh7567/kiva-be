import React from 'react';
import { CreditCard, MapPin, ArrowRight } from 'lucide-react';
import { Country, State } from 'country-state-city';
const ReviewStep = ({ shippingInfo, billingInfo, onEditShipping, onSubmit, loading, paymentMethod, onPaymentMethodChange }) => {

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

         const shippingCountryName = getCountryName(shippingInfo.country);
      const shippingStateName = getStateName(shippingInfo.state, shippingInfo.country);
         const billingCountryName = getCountryName(billingInfo?.country);
      const billingStateName = getStateName(billingInfo?.state, billingInfo?.country);
  return (
    <div className="space-y-6">
      {/* Shipping Details */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-sorts-mill-gloudy text-black">
              Shipping Details
            </h3>
          </div>
          <button
            onClick={onEditShipping}
            className="text-sm text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
          <p className="font-montserrat-semibold-600 text-black">{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p>{shippingInfo.email}</p>
          <p>{shippingInfo.phone}</p>
          <p>{shippingInfo.address}</p>
          <p>{shippingInfo.city}, {shippingStateName} {shippingInfo.zipCode}</p>
          <p>{shippingCountryName}</p>
        </div>
      </div>

      {/* Billing Details */}
      {billingInfo && (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-sorts-mill-gloudy text-black">
                Billing Details
              </h3>
            </div>
            <button
              onClick={onEditShipping}
              className="text-sm text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
            <p className="font-montserrat-semibold-600 text-black">{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.email}</p>
            <p>{shippingInfo.phone}</p>
            <p>{billingInfo.address}</p>
            <p>{billingInfo.city}, {billingStateName} {billingInfo.zipCode}</p>
            <p>{billingCountryName}</p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-sorts-mill-gloudy text-black">
              Payment Method
            </h3>
          </div>
        </div>
        <p className="text-sm font-montserrat-regular-400 text-black-light mb-4">
          Choose how you'd like to pay before continuing to the payment step.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              id: 'card',
              label: 'Credit/Debit Card',
              description: 'Use Visa, Mastercard, or Amex',
              icon: CreditCard
            },
            {
              id: 'paypal',
              label: 'PayPal',
              description: 'Pay with your PayPal account',
              icon: CreditCard
            }
          ].map((method) => {
            const Icon = method.icon;
            const isSelected = (paymentMethod || 'card') === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentMethodChange?.(method.id)}
                className={`text-left border-2 rounded-xl p-4 transition-all duration-300 ${
                  isSelected ? 'border-primary bg-primary-light shadow-sm' : 'border-primary-light hover:border-primary'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-black'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-montserrat-semibold-600 text-black">{method.label}</p>
                    <p className="text-xs font-montserrat-regular-400 text-black-light">{method.description}</p>
                  </div>
                </div>
                {isSelected ? (
                  <p className="text-xs font-montserrat-semibold-600 text-primary">
                    Selected
                  </p>
                ) : (
                  <p className="text-xs font-montserrat-regular-400 text-black-light">
                    Tap to select
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Confirmation Notice */}
      <div className="bg-primary-light rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-montserrat-semibold-600 text-black mb-1">
              Ready to place your order
            </p>
            <p className="text-sm font-montserrat-regular-400 text-black-light">
              Review your shipping information above. You'll complete payment in the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onEditShipping}
          disabled={loading}
          className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="sm:w-2/3 bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Creating Order...' : 'Proceed to Payment'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
