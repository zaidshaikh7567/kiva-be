import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, User, Mail, Phone } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';
import { Country, State, City } from 'country-state-city';

const ShippingStep = ({ shippingInfo, onShippingChange, onSubmit, loading }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Get all countries
// Get only selected countries
const countryOptions = useMemo(() => {
  const allowedCountries = ['CA', 'AU', 'US', 'GB', 'IN']; // Canada, Australia, USA, UK, India
  return Country.getAllCountries()
    .filter(country => allowedCountries.includes(country.isoCode))
    .map(country => ({
      value: country.isoCode,
      label: `${country.flag} ${country.name}`,
      data: country
    }));
}, []);


  // Get states for selected country
  const stateOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode).map(state => ({
      value: state.isoCode,
      label: state.name,
      data: state
    }));
  }, [selectedCountry]);

  // Get cities for selected state
  const cityOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode).map(city => ({
      value: city.name,
      label: city.name,
      data: city
    }));
  }, [selectedCountry, selectedState]);

  // Initialize selected country and state from shippingInfo
  useEffect(() => {
    if (shippingInfo.country && !selectedCountry) {
      const country = Country.getAllCountries().find(c => c.isoCode === shippingInfo.country);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [shippingInfo.country, selectedCountry]);

  useEffect(() => {
    if (shippingInfo.state && selectedCountry && !selectedState) {
      const state = State.getStatesOfCountry(selectedCountry.isoCode).find(s => s.isoCode === shippingInfo.state);
      if (state) {
        setSelectedState(state);
      }
    }
  }, [shippingInfo.state, selectedCountry, selectedState]);

  const handleCountryChange = (value) => {
    const country = Country.getAllCountries().find(c => c.isoCode === value);
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    
    // Update form data and clear state and city
    onShippingChange({ target: { name: 'country', value } });
    onShippingChange({ target: { name: 'state', value: '' } });
    onShippingChange({ target: { name: 'city', value: '' } });
  };

  const handleStateChange = (value) => {
    if (!selectedCountry) return;
    const state = State.getStatesOfCountry(selectedCountry.isoCode).find(s => s.isoCode === value);
    setSelectedState(state);
    
    // Update form data and clear city
    onShippingChange({ target: { name: 'state', value } });
    onShippingChange({ target: { name: 'city', value: '' } });
  };

  const handleCityChange = (value) => {
    onShippingChange({ target: { name: 'city', value } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-sorts-mill-gloudy text-black">
            Shipping Information
          </h2>
          <p className="text-sm text-black-light font-montserrat-regular-400">
            Where should we deliver your order?
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={onShippingChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="Enter first name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="text"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={onShippingChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={onShippingChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
              <input
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={onShippingChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={onShippingChange}
            required
            className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
            placeholder="Enter street address"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
            Country *
          </label>
          <CustomDropdown
            options={countryOptions}
            value={shippingInfo.country}
            onChange={handleCountryChange}
            placeholder="Select Country"
            disabled={loading}
          />
        </div>

        {/* State and ZIP Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              State / Province *
            </label>
            <CustomDropdown
              options={stateOptions}
              value={shippingInfo.state}
              onChange={handleStateChange}
              placeholder={selectedCountry ? "Select State/Province" : "Select Country First"}
              disabled={loading || !selectedCountry || stateOptions.length === 0}
            />
            {selectedCountry && stateOptions.length === 0 && (
              <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
                No states/provinces available for this country
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              ZIP / Postal Code *
            </label>
            <input
              type="text"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={onShippingChange}
              required
              className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
              placeholder="10001"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
            City *
          </label>
          <CustomDropdown
            options={cityOptions}
            value={shippingInfo.city}
            onChange={handleCityChange}
            placeholder={selectedState ? "Select City" : "Select State/Province First"}
            disabled={loading || !selectedState || cityOptions.length === 0}
          />
          {selectedState && cityOptions.length === 0 && (
            <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
              No cities available. You can enter manually if needed.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default ShippingStep;
