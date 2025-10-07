import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCurrency: 'USD',
  exchangeRates: {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.35,
    AUD: 1.50,
    JPY: 110.0,
    INR: 75.0,
    AED: 3.67,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.30,
    BHD: 0.38,
    OMR: 0.38
  },
  currencySymbols: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    INR: '₹',
    AED: 'د.إ',
    SAR: '﷼',
    QAR: '﷼',
    KWD: 'د.ك',
    BHD: 'د.ب',
    OMR: 'ر.ع.'
  },
  currencyNames: {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    JPY: 'Japanese Yen',
    INR: 'Indian Rupee',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    QAR: 'Qatari Riyal',
    KWD: 'Kuwaiti Dinar',
    BHD: 'Bahraini Dinar',
    OMR: 'Omani Rial'
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currentCurrency = action.payload;
    },
    updateExchangeRates: (state, action) => {
      state.exchangeRates = { ...state.exchangeRates, ...action.payload };
    }
  }
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;

// Selectors
export const selectCurrentCurrency = (state) => state.currency.currentCurrency;
export const selectCurrencySymbol = (state) => state.currency.currencySymbols[state.currency.currentCurrency];
export const selectExchangeRate = (state) => state.currency.exchangeRates[state.currency.currentCurrency];
export const selectCurrencyOptions = (state) => 
  Object.entries(state.currency.currencyNames).map(([code, name]) => ({
    code,
    name,
    symbol: state.currency.currencySymbols[code]
  }));

// Helper function to convert price
export const convertPrice = (price, fromCurrency = 'USD', toCurrency, exchangeRates) => {
  if (fromCurrency === toCurrency) return price;
  
  // Convert from USD to target currency
  const rate = exchangeRates[toCurrency] || 1;
  return price * rate;
};

// Helper function to format price
export const formatPrice = (price, currency, symbol) => {
  const formattedPrice = price.toFixed(2);
  
  // Special formatting for different currencies
  if (currency === 'JPY') {
    return `${symbol}${Math.round(price)}`;
  }
  
  return `${symbol}${formattedPrice}`;
};

export default currencySlice.reducer;
