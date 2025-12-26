import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setCurrency, 
  selectCurrentCurrency, 
  selectCurrencyOptions,
  fetchExchangeRates,
  detectUserLocation,
  selectCurrencyLoading,
  selectCurrencyError,
  selectLastUpdated,
  selectDetectedCountry,
  selectLocationDetectionMethod,
  clearError
} from '../store/slices/currencySlice';

const CurrencyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencyOptions = useSelector(selectCurrencyOptions);
  const loading = useSelector(selectCurrencyLoading);
  const error = useSelector(selectCurrencyError);
  const lastUpdated = useSelector(selectLastUpdated);
  const detectedCountry = useSelector(selectDetectedCountry);
  const detectionMethod = useSelector(selectLocationDetectionMethod);
  
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

  // Detect location and fetch exchange rates on component mount
  useEffect(() => {
    // First detect user location to set appropriate currency
    dispatch(detectUserLocation()).then(() => {
      // Then fetch exchange rates
      dispatch(fetchExchangeRates());
    });
  }, [dispatch]);

  const handleCurrencyChange = (currencyCode) => {
    dispatch(setCurrency(currencyCode));
    setIsOpen(false);
  };

  const handleRefreshRates = (e) => {
    e.stopPropagation();
    dispatch(clearError());
    dispatch(detectUserLocation()).then(() => {
      dispatch(fetchExchangeRates());
    });
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return '';
    }
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
        <div className="absolute top-full right-0 mt-2 w-[210px] sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Header with refresh button */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-montserrat-semibold-600 text-black">Currency</h3>
              <button
                onClick={handleRefreshRates}
                disabled={loading}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                title="Refresh exchange rates"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            {/* {detectedCountry && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {detectedCountry}

              </p>
            )}
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {formatLastUpdated(lastUpdated)}
              </p>
            )}
            {error && (
              <div className="flex items-center space-x-1 mt-1 text-red-600">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">Failed to load rates</span>
              </div>
            )} */}
          </div>

          {/* Currency options */}
          <div className="py-1">
            {currencyOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleCurrencyChange(option.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  currentCurrency === option.code ? 'bg-primary/5 text-primary' : 'text-black'
                }`}
              >
                <div className="flex items-center space-x-3 ">
                  <span className="text-lg font-medium min-w-6">{option.symbol}</span>
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