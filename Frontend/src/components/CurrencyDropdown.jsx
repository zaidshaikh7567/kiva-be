import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrency, selectCurrentCurrency, selectCurrencyOptions } from '../store/slices/currencySlice';

const CurrencyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencyOptions = useSelector(selectCurrencyOptions);
  
  const currentOption = currencyOptions.find(option => option.code === currentCurrency);

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

  const handleCurrencyChange = (currencyCode) => {
    dispatch(setCurrency(currencyCode));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-montserrat-medium-500 text-black-light hover:text-black transition-colors duration-200 border border-gray-200 rounded-lg hover:border-primary bg-white min-w-0"
      >
        <span className="truncate">{currentOption?.symbol} {currentOption?.code}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[200px] sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="py-1">
            {currencyOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleCurrencyChange(option.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  currentCurrency === option.code ? 'bg-primary/5 text-primary' : 'text-black'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">{option.symbol}</span>
                  <div>
                    <div className="font-montserrat-medium-500 text-sm">{option.code}</div>
                    <div className="text-xs text-gray-500">{option.name}</div>
                  </div>
                </div>
                {currentCurrency === option.code && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
