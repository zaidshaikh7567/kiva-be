import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  // Get display text for selected option
  const getDisplayText = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full px-4 py-3 text-left bg-white border border-primary-light rounded-lg shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'cursor-pointer '}
          ${isOpen ? 'ring- ring-primary border-primary' : ''}
        `}
      >
        <span className={`block truncate font-montserrat-regular-400 ${!value ? 'text-black-light' : 'text-black'}`}>
          {getDisplayText()}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown 
            className={`h-5 w-5 text-black-light transition-transform duration-300 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-primary-light rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm font-montserrat-regular-400 text-black-light">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`
                  w-full px-4 py-3 text-left text-sm font-montserrat-regular-400 hover:bg-primary-light focus:outline-none focus:bg-primary-light transition-colors duration-300
                  ${value === option.value ? 'bg-primary-light text-black font-montserrat-medium-500' : 'text-black hover:text-black'}
                `}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
