import React from 'react';
import { Check } from 'lucide-react';

const CustomCheckbox = ({ 
  checked, 
  onChange, 
  label, 
  name,
  id,
  className = "",
  disabled = false 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label 
        htmlFor={id || name}
        className={`relative flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        {/* Custom Checkbox Box */}
        <div 
          className={`
            relative flex items-center justify-center 
            w-5 h-5 rounded border-2 transition-all duration-200
            ${checked 
              ? 'bg-primary border-primary' 
              : 'bg-white border-gray-300 hover:border-primary'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Check Icon */}
          {checked && (
            <Check className="w-5 h-5 text-white" strokeWidth={4} />
          )}
        </div>
        {/* Label */}
        {label && (
          <span className={`ml-2 text-sm font-montserrat-regular-400 ${checked ? 'text-black' : 'text-black-light'}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default CustomCheckbox;

