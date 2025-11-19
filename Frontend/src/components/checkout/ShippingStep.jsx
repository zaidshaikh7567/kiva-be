import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';
import { Country, State, City } from 'country-state-city';
import CustomCheckbox from '../CustomCheckbox';
import FormInput from '../FormInput';

const ShippingStep = ({ 
  shippingInfo, 
  onShippingChange, 
  billingInfo, 
  onBillingChange, 
  useBillingAddress, 
  onUseBillingAddressChange,
  onSubmit, 
  loading 
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState(null);
  const [selectedBillingState, setSelectedBillingState] = useState(null);
  const [errors, setErrors] = useState({});
  const [billingErrors, setBillingErrors] = useState({});

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

  // Get states for selected billing country
  const billingStateOptions = useMemo(() => {
    if (!selectedBillingCountry) return [];
    return State.getStatesOfCountry(selectedBillingCountry.isoCode).map(state => ({
      value: state.isoCode,
      label: state.name,
      data: state
    }));
  }, [selectedBillingCountry]);

  // Get cities for selected billing state
  const billingCityOptions = useMemo(() => {
    if (!selectedBillingCountry || !selectedBillingState) return [];
    return City.getCitiesOfState(selectedBillingCountry.isoCode, selectedBillingState.isoCode).map(city => ({
      value: city.name,
      label: city.name,
      data: city
    }));
  }, [selectedBillingCountry, selectedBillingState]);

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

  // Initialize selected billing country and state from billingInfo
  useEffect(() => {
    if (billingInfo?.country && !selectedBillingCountry) {
      const country = Country.getAllCountries().find(c => c.isoCode === billingInfo.country);
      if (country) {
        setSelectedBillingCountry(country);
      }
    }
  }, [billingInfo?.country, selectedBillingCountry]);

  useEffect(() => {
    if (billingInfo?.state && selectedBillingCountry && !selectedBillingState) {
      const state = State.getStatesOfCountry(selectedBillingCountry.isoCode).find(s => s.isoCode === billingInfo.state);
      if (state) {
        setSelectedBillingState(state);
      }
    }
  }, [billingInfo?.state, selectedBillingCountry, selectedBillingState]);

  const handleCountryChange = (value) => {
    const country = Country.getAllCountries().find(c => c.isoCode === value);
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    
    // Clear errors
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: '' }));
    }
    
    // Update form data and clear state and city
    onShippingChange({ target: { name: 'country', value } });
    onShippingChange({ target: { name: 'state', value: '' } });
    onShippingChange({ target: { name: 'city', value: '' } });
  };

  const handleStateChange = (value) => {
    if (!selectedCountry) return;
    const state = State.getStatesOfCountry(selectedCountry.isoCode).find(s => s.isoCode === value);
    setSelectedState(state);
    
    // Clear errors
    if (errors.state) {
      setErrors(prev => ({ ...prev, state: '' }));
    }
    
    // Update form data and clear city
    onShippingChange({ target: { name: 'state', value } });
    onShippingChange({ target: { name: 'city', value: '' } });
  };

  const handleCityChange = (value) => {
    // Clear errors
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
    
    onShippingChange({ target: { name: 'city', value } });
  };

  const handleBillingCountryChange = (value) => {
    const country = Country.getAllCountries().find(c => c.isoCode === value);
    console.log('country :', country);
    setSelectedBillingCountry(country);
    setSelectedBillingState(null); // Reset state when country changes
    
    // Clear errors
    if (billingErrors.country) {
      setBillingErrors(prev => ({ ...prev, country: '' }));
    }
    
    // Update form data and clear state and city
    onBillingChange({ target: { name: 'country', value } });
    onBillingChange({ target: { name: 'state', value: '' } });
    onBillingChange({ target: { name: 'city', value: '' } });
  };

  const handleBillingStateChange = (value) => {
    if (!selectedBillingCountry) return;
    const state = State.getStatesOfCountry(selectedBillingCountry.isoCode).find(s => s.isoCode === value);
    setSelectedBillingState(state);
    
    // Clear errors
    if (billingErrors.state) {
      setBillingErrors(prev => ({ ...prev, state: '' }));
    }
    
    // Update form data and clear city
    onBillingChange({ target: { name: 'state', value } });
    onBillingChange({ target: { name: 'city', value: '' } });
  };

  const handleBillingCityChange = (value) => {
    // Clear errors
    if (billingErrors.city) {
      setBillingErrors(prev => ({ ...prev, city: '' }));
    }
    
    onBillingChange({ target: { name: 'city', value } });
  };

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        // add validation for phone  in the canada india usa uk and australia
      
      case 'phone':
          if (!/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
            error = 'Please enter a valid phone number. Phone number must be at least 7 digits and less than 15 digits';
          }else if(value.trim().length < 7) {
            error = 'Phone number must be at least 7 digits';
          }else if(value.trim().length > 15) {
            error = 'Phone number must be less than 15 digits';
          }       
        break;
        //    if (!value.trim()) {
        //   error = 'Phone number is required';
        // } else if (!/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
        //   error = 'Please enter a valid phone number';
        // }

      case 'address':
        if (!value.trim()) {
          error = 'Street address is required';
        } else if (value.trim().length < 5) {
          error = 'Please enter a complete address';
        }
        break;
      case 'country':
        if (!value) {
          error = 'Please select a country';
        }
        break;
      case 'state':
        if (!value) {
          error = 'Please select a state/province';
        }
        break;
      case 'city':
        if (!value) {
          error = 'Please select a city';
        }
        break;
      case 'zipCode':
        if (!value.trim()) {
          error = 'ZIP/Postal code is required';
        } else if (value.trim().length < 3) {
          error = 'Please enter a valid ZIP/Postal code';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // For phone field, only allow numbers and phone formatting characters (+, -, (, ), spaces)
    if (name === 'phone') {
      // Remove any characters that are not digits, +, -, (, ), or spaces
      const phoneValue = value.replace(/[^\d+\-() ]/g, '');
      e.target.value = phoneValue;
    }
    
    onShippingChange(e);
  };

  const handlePhoneKeyDown = (e) => {
    // Allow: numbers (0-9), +, -, (, ), space, and control keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    // Allow modifier keys (Ctrl, Alt, Meta) for shortcuts like Ctrl+A, Ctrl+C, Ctrl+V
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }
    
    // If it's a control key, allow it
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // If it's a number or phone formatting character, allow it
    if (/[0-9+\-() ]/.test(e.key)) {
      return;
    }
    
    // Otherwise, prevent the key press
    e.preventDefault();
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    // Get pasted text and filter out non-numeric and non-formatting characters
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const phoneValue = pastedText.replace(/[^\d+\-() ]/g, '');
    
    // Create a synthetic event to update the field
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: phoneValue
      }
    };
    
    handleFieldChange(syntheticEvent);
  };

  const handleBillingFieldChange = (e) => {
    const { name } = e.target;
    
    // Clear error when user starts typing
    if (billingErrors[name]) {
      setBillingErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    onBillingChange(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate shipping fields
    const newErrors = {};
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address', 'country', 'state', 'city', 'zipCode'];
    
    fieldsToValidate.forEach(field => {
      const fieldError = validateField(field, shippingInfo[field]);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    
    setErrors(newErrors);
    
    // Validate billing fields only if billing address is enabled
    // Only validate address-related fields (not name, email, phone)
    const newBillingErrors = {};
    if (useBillingAddress && billingInfo) {
      const billingFieldsToValidate = ['address', 'country', 'state', 'city', 'zipCode'];
      billingFieldsToValidate.forEach(field => {
        const fieldError = validateField(field, billingInfo[field]);
        if (fieldError) {
          newBillingErrors[field] = fieldError;
        }
      });
    }
    
    setBillingErrors(newBillingErrors);
    
    // If no errors, proceed with submission
    if (Object.keys(newErrors).length === 0 && Object.keys(newBillingErrors).length === 0) {
      onSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-sorts-mill-gloudy text-black">
            Shipping Information
          </h2>
          <p className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">
            Where should we deliver your order?
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            type="text"
            value={shippingInfo.firstName}
            onChange={handleFieldChange}
            placeholder="Enter first name"
            error={errors.firstName}
            icon={User}
            required
          />
          <FormInput
            label="Last Name"
            name="lastName"
            type="text"
            value={shippingInfo.lastName}
            onChange={handleFieldChange}
            placeholder="Enter last name"
            error={errors.lastName}
            icon={User}
            required
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={shippingInfo.email}
            onChange={handleFieldChange}
            placeholder="Enter email"
            error={errors.email}
            icon={Mail}
            required
          />
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={shippingInfo.phone}
            onChange={handleFieldChange}
            onKeyDown={handlePhoneKeyDown}
            onPaste={handlePhonePaste}
            inputMode="tel"
            maxLength={15}
            minLength={7}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            icon={Phone}
            required
          />
        </div>

        {/* Address */}
        <FormInput
          label="Street Address"
          name="address"
          type="text"
          value={shippingInfo.address}
          onChange={handleFieldChange}
          placeholder="Enter street address"
          error={errors.address}
          required
        />

        {/* Country */}
        <div>
          <label className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2">
            Country *
          </label>
          <CustomDropdown
            options={countryOptions}
            value={shippingInfo.country}
            onChange={handleCountryChange}
            placeholder="Select Country"
            disabled={loading}
            className={errors.country ? 'border-red-500' : ''}
          />
          {errors.country && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
              {errors.country}
            </p>
          )}
        </div>

        {/* State and ZIP Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2">
              State / Province *
            </label>
            <CustomDropdown
              options={stateOptions}
              value={shippingInfo.state}
              onChange={handleStateChange}
              placeholder={selectedCountry ? "Select State/Province" : "Select Country First"}
              disabled={loading || !selectedCountry || stateOptions.length === 0}
              className={errors.state ? 'border-red-500' : ''}
            />
            {errors.state && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
                {errors.state}
              </p>
            )}
            {selectedCountry && stateOptions.length === 0 && !errors.state && (
              <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
                No states/provinces available for this country
              </p>
            )}
          </div>
          <FormInput
            label="ZIP / Postal Code"
            name="zipCode"
            type="text"
            value={shippingInfo.zipCode}
            onChange={handleFieldChange}
            placeholder="10001"
            error={errors.zipCode}
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2">
            City *
          </label>
          <CustomDropdown
            options={cityOptions}
            value={shippingInfo.city}
            onChange={handleCityChange}
            placeholder={selectedState ? "Select City" : "Select State/Province First"}
            disabled={loading || !selectedState || cityOptions.length === 0}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
              {errors.city}
            </p>
          )}
          {selectedState && cityOptions.length === 0 && !errors.city && (
            <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
              No cities available. You can enter manually if needed.
            </p>
          )}
        </div>

        {/* Billing Address Section */}
        <div className="pt-6 mt-6 border-t border-primary-light">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-sorts-mill-gloudy text-black">
                  Billing Address
                </h2>
                <p className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">
                  Use a different billing address (optional)
                </p>
              </div>
            </div>
            
            <label className="flex items-center space-x-2 cursor-pointer flex-shrink-0 sm:ml-auto">
              <CustomCheckbox
                checked={useBillingAddress}
                onChange={(e) => {
                  onUseBillingAddressChange(e.target.checked);
                  if (!e.target.checked) {
                    // Clear billing errors when unchecked
                    setBillingErrors({});
                  }
                }}
                label="Add Billing Address"
                name="useBillingAddress"
                id="useBillingAddress"
                // className="w-5 h-5 text-primary border-primary-light rounded focus:ring-primary focus:ring-2"
              />
            </label>
          </div>

          {useBillingAddress && (
            <div className="space-y-4 sm:space-y-6">
              {/* Billing Address */}
              <FormInput
                label="Street Address"
                name="address"
                type="text"
                value={billingInfo?.address || ''}
                onChange={handleBillingFieldChange}
                placeholder="Enter street address"
                error={billingErrors.address}
                required
              />

              {/* Billing Country */}
              <div>
                <label className="block text-xs sm:text-sm font-montserrat-medium-500 text-black mb-1.5 sm:mb-2">
                  Country *
                </label>
                <CustomDropdown
                  options={countryOptions}
                  value={billingInfo?.country || ''}
                  onChange={handleBillingCountryChange}
                  placeholder="Select Country"
                  disabled={loading}
                  className={billingErrors.country ? 'border-red-500' : ''}
                />
                {billingErrors.country && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
                    {billingErrors.country}
                  </p>
                )}
              </div>

              {/* Billing State and ZIP Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    State / Province *
                  </label>
                  <CustomDropdown
                    options={billingStateOptions}
                    value={billingInfo?.state || ''}
                    onChange={handleBillingStateChange}
                    placeholder={selectedBillingCountry ? "Select State/Province" : "Select Country First"}
                    disabled={loading || !selectedBillingCountry || billingStateOptions.length === 0}
                    className={billingErrors.state ? 'border-red-500' : ''}
                  />
                  {billingErrors.state && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
                      {billingErrors.state}
                    </p>
                  )}
                  {selectedBillingCountry && billingStateOptions.length === 0 && !billingErrors.state && (
                    <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
                      No states/provinces available for this country
                    </p>
                  )}
                </div>
                <FormInput
                  label="ZIP / Postal Code"
                  name="zipCode"
                  type="text"
                  value={billingInfo?.zipCode || ''}
                  onChange={handleBillingFieldChange}
                  placeholder="10001"
                  error={billingErrors.zipCode}
                  required
                />
              </div>

              {/* Billing City */}
              <div>
                <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                  City *
                </label>
                <CustomDropdown
                  options={billingCityOptions}
                  value={billingInfo?.city || ''}
                  onChange={handleBillingCityChange}
                  placeholder={selectedBillingState ? "Select City" : "Select State/Province First"}
                  disabled={loading || !selectedBillingState || billingCityOptions.length === 0}
                  className={billingErrors.city ? 'border-red-500' : ''}
                />
                {billingErrors.city && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5 font-montserrat-regular-400">
                    {billingErrors.city}
                  </p>
                )}
                {selectedBillingState && billingCityOptions.length === 0 && !billingErrors.city && (
                  <p className="text-xs text-black-light mt-1 font-montserrat-regular-400">
                    No cities available. You can enter manually if needed.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-4 sm:px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default ShippingStep;
