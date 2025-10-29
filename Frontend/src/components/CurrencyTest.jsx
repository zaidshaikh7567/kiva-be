import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentCurrency, 
  selectCurrencySymbol, 
  selectExchangeRate,
  selectCurrencyLoading,
  selectCurrencyError,
  selectLastUpdated,
  selectDetectedCountry,
  selectLocationDetectionMethod,
  convertPrice,
  formatPrice
} from '../store/slices/currencySlice';

const CurrencyTest = () => {
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  const loading = useSelector(selectCurrencyLoading);
  const error = useSelector(selectCurrencyError);
  const lastUpdated = useSelector(selectLastUpdated);
  const detectedCountry = useSelector(selectDetectedCountry);
  const detectionMethod = useSelector(selectLocationDetectionMethod);

  // Test prices in USD
  const testPrices = [1,10,100,250,500,1000,2500];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Currency Conversion Test</h3>
      
      <div className="space-y-4">
        <div>
          <p><strong>Current Currency:</strong> {currentCurrency}</p>
          <p><strong>Currency Symbol:</strong> {currencySymbol}</p>
          <p><strong>Exchange Rate:</strong> {exchangeRate}</p>
          {detectedCountry && (
            <p><strong>Detected Country:</strong> {detectedCountry} ({detectionMethod})</p>
          )}
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
          {lastUpdated && <p><strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleString()}</p>}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Price Conversions (USD → {currentCurrency}):</h4>
          <div className="space-y-1">
            {testPrices.map(price => {
              const convertedPrice = convertPrice(price, 'USD', currentCurrency, { [currentCurrency]: exchangeRate });
              const formattedPrice = formatPrice(convertedPrice, currentCurrency, currencySymbol);
              return (
                <div key={price} className="flex justify-between">
                  <span>${price} USD</span>
                  <span>→</span>
                  <span>{formattedPrice}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyTest;
