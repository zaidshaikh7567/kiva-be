import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X ,Check} from 'lucide-react';

const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
  className = "",
  disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    console.log('value :', value);

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

  // Handle option selection (toggle)
  const handleOptionClick = (optionValue) => {
    if (value.includes(optionValue)) {
      // Remove if already selected
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add if not selected
      onChange([...value, optionValue]);
    }
  };

  // Remove a selected item
  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  // Get display text for selected items
  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    }
    if (value.length === 1) {
      const selected = options.find(opt => opt.value === value[0]);
      return selected ? selected.label : value[0];
    }
    return `${value.length} selected`;
  };

  // Get selected option label
  const getSelectedLabel = (optionValue) => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full min-h-[48px] px-4 py-2 text-left bg-white border rounded-lg shadow-sm 
          focus:outline-none focus:ring-1 outline-none focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isOpen ? 'ring-1 ring-primary border-primary' : value.length > 0 ? 'border-primary bg-primary-light/10' : 'border-gray-200'}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-1.5 items-center">
            {value.length === 0 ? (
              <span className="text-black-light font-montserrat-regular-400 py-1">
                {placeholder}
              </span>
            ) : (
              <>
                {value.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-montserrat-medium-500  text-primary border border-primary-dark"
                  >
                    {getSelectedLabel(val)}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(val, e)}
                      className="ml-1.5 hover:bg-primary-dark rounded-full p-0.5 transition-colors"
                      disabled={disabled}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </>
            )}
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-primary-light rounded-xl shadow-2xl max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm font-montserrat-regular-400 text-black-light">
              No options available
            </div>
          ) : (
            <div className="py-2">
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      w-full px-4 py-3 text-left text-sm font-montserrat-regular-400 
                      hover:bg-primary-light focus:outline-none focus:bg-primary-light 
                      transition-colors duration-200 flex items-center justify-between
                      ${isSelected 
                        ? ' text-black font-montserrat-medium-500' 
                        : 'text-black hover:text-black'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

