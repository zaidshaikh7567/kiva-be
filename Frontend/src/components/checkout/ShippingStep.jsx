import React from 'react';
import { MapPin, User, Mail, Phone } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const COUNTRY_OPTIONS = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'UK', label: '🇬🇧 United Kingdom' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'IT', label: '🇮🇹 Italy' },
  { value: 'ES', label: '🇪🇸 Spain' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'AE', label: '🇦🇪 United Arab Emirates' },
];

const ShippingStep = ({ shippingInfo, onShippingChange, onSubmit, loading }) => {
  const handleCountryChange = (value) => {
    onShippingChange({ target: { name: 'country', value } });
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
                placeholder="John"
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
                placeholder="Doe"
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
                placeholder="john@example.com"
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
            placeholder="123 Main Street, Apt 4B"
          />
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={onShippingChange}
              required
              className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={onShippingChange}
              required
              className="w-full px-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
              ZIP Code *
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

        {/* Country */}
        <div>
          <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
            Country *
          </label>
          <CustomDropdown
            options={COUNTRY_OPTIONS}
            value={shippingInfo.country}
            onChange={handleCountryChange}
            placeholder="Select Country"
            disabled={loading}
          />
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
