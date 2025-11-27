import React from 'react';
import CustomDropdown from './CustomDropdown';
import { RING_SIZES } from '../services/centerStonesApi';

const RingSizeSelector = ({
  value,
  onChange,
  label = 'Ring Size',
  required = false,
  placeholder = 'Select your ring size',
  showHint = true,
  hintText = 'Need help finding your size? Check our',
  hintLink = '/size-guide',
  className = '',
  disabled = false,
  dropdownProps = {}
}) => {
  if (!onChange) return null;

  return (
    <div className={className}>
      <label className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <CustomDropdown
        options={RING_SIZES}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        searchable={false}
        disabled={disabled}
        {...dropdownProps}
      />

      {showHint && (
        <p className="mt-2 text-xs text-gray-600 font-montserrat-regular-400">
          {hintText}{' '}
          <a href={hintLink} className="text-primary hover:underline">
            Size Guide
          </a>
        </p>
      )}
    </div>
  );
};

export default RingSizeSelector;

