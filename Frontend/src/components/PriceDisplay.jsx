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
  className = "", 
  variant = "default" // "default" or "small"
}) => {
  const currentCurrency = useSelector(selectCurrentCurrency);
  console.log('currentCurrency :', currentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  console.log('currencySymbol :', currencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  
  // Handle undefined or null prices
  if (price === undefined || price === null) {
    return <span className={className}>Price not available</span>;
  }
  
  // Convert prices from USD to current currency
  const convertedPrice = convertPrice(price, 'USD', currentCurrency, { [currentCurrency]: exchangeRate });
  const formattedPrice = formatPrice(convertedPrice, currentCurrency, currencySymbol);

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
    </div>
  );
};

export default PriceDisplay;
