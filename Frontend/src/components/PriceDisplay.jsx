import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentCurrency, 
  selectCurrencySymbol, 
  selectExchangeRate,
  convertPrice,
  formatPrice 
} from '../store/slices/currencySlice';

const PriceDisplay = ({ 
  price, 
  originalPrice = null, 
  className = "", 
  showOriginalPrice = true,
  showSavings = false,
  variant = "default" // "default" or "small"
}) => {
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  
  // Handle undefined or null prices
  if (price === undefined || price === null) {
    return <span className={className}>Price not available</span>;
  }
  
  // Convert prices from USD to current currency
  const convertedPrice = convertPrice(price, 'USD', currentCurrency, { [currentCurrency]: exchangeRate });
  const convertedOriginalPrice = originalPrice ? 
    convertPrice(originalPrice, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }) : null;
  
  const formattedPrice = formatPrice(convertedPrice, currentCurrency, currencySymbol);
  const formattedOriginalPrice = convertedOriginalPrice ? 
    formatPrice(convertedOriginalPrice, currentCurrency, currencySymbol) : null;
  
  const savings = convertedOriginalPrice ? convertedOriginalPrice - convertedPrice : 0;

  // Define styling based on variant
  const priceClasses = variant === "small" 
    ? className || "text-xs text-black-light font-montserrat-regular-400"
    : "text-xl md:text-2xl font-montserrat-bold-700 text-primary";
  
  const containerClasses = variant === "small" 
    ? className || ""
    : `flex items-center space-x-2 ${className}`;

  if (variant === "small") {
    return (
      <span className={priceClasses}>
        {formattedPrice}
      </span>
    );
  }

  return (
    <div className={containerClasses}>
      <span className={priceClasses}>
        {formattedPrice}
      </span>
      {originalPrice && showOriginalPrice && (
        <span className="text-base md:text-lg font-montserrat-regular-400 text-black-light line-through">
          {formattedOriginalPrice}
        </span>
      )}
      {showSavings && savings > 0 && (
        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-montserrat-medium-500">
          Save {formatPrice(savings, currentCurrency, currencySymbol)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
