import React from 'react';
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import { Country, State } from 'country-state-city';
const ReviewStep = ({ shippingInfo, billingInfo, paymentInfo, onEditShipping, onEditPayment, onPlaceOrder, loading }) => {

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
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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

      {/* Payment Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-sorts-mill-gloudy text-black">
              Payment Method
            </h3>
          </div>
          <button
            onClick={onEditPayment}
            className="text-sm text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors"
          >
            Edit
          </button>
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

      {/* Place Order Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onEditPayment}
          disabled={loading}
          className="sm:w-1/3 border-2 border-primary text-primary font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="sm:w-2/3 bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{loading ? 'Processing Order...' : 'Place Order'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
