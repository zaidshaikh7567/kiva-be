import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ExchangeRate API configuration
const EXCHANGE_RATE_API_KEY = 'f73290b9410a18b89a73f95d';
const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

// Detect user's location and set appropriate currency
export const detectUserLocation = createAsyncThunk(
  'currency/detectUserLocation',
  async () => {
    try {
      // First try to get location from browser's geolocation API
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get country code
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const locationData = await response.json();
      const countryCode = locationData.countryCode;
      
      // Map country codes to currencies
      const countryToCurrency = {
        'IN': 'INR',  // India
        'CA': 'CAD',  // Canada
        'US': 'USD',  // United States
        'AU': 'AUD',  // Australia
        'GB': 'GBP',  // United Kingdom
        'DE': 'EUR',  // Germany
        'FR': 'EUR',  // France
        'IT': 'EUR',  // Italy
        'ES': 'EUR',  // Spain
        'JP': 'JPY',  // Japan
        'CN': 'CNY',  // China
        'AE': 'AED',  // UAE
        'SA': 'SAR',  // Saudi Arabia
        'QA': 'QAR',  // Qatar
        'KW': 'KWD',  // Kuwait
        'BH': 'BHD',  // Bahrain
        'OM': 'OMR'   // Oman
      };
      
      const detectedCurrency = countryToCurrency[countryCode] || 'USD';
      
      return {
        countryCode,
        currency: detectedCurrency,
        countryName: locationData.countryName
      };
    } catch (error) {
      console.log('Geolocation detection failed, using fallback:', error.message);
      
      // Fallback: Try to detect from timezone
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneToCurrency = {
          'Asia/Kolkata': 'INR',
          'America/Toronto': 'CAD',
          'America/New_York': 'USD',
          'America/Los_Angeles': 'USD',
          'America/Chicago': 'USD',
          'Australia/Sydney': 'AUD',
          'Europe/London': 'GBP',
          'Europe/Berlin': 'EUR',
          'Europe/Paris': 'EUR',
          'Asia/Tokyo': 'JPY'
        };
        
        const detectedCurrency = timezoneToCurrency[timezone] || 'USD';
        
        return {
          countryCode: null,
          currency: detectedCurrency,
          countryName: 'Unknown',
          method: 'timezone'
        };
      } catch {
        console.log('Timezone detection also failed, using USD as default');
        return {
          countryCode: null,
          currency: 'USD',
          countryName: 'Unknown',
          method: 'default'
        };
      }
    }
  }
);

// Fetch exchange rates from API
export const fetchExchangeRates = createAsyncThunk(
  'currency/fetchExchangeRates',
  async (baseCurrency = 'USD', { rejectWithValue }) => {
    try {
      // const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`);
      const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result === 'success') {
        return {
          rates: data.conversion_rates,
          base: data.base_code,
          lastUpdated: data.time_last_update_utc
        };
      } else {
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentCurrency: 'USD',
  exchangeRates: {
    AUD: 1.50,
    GBP: 0.73,
    CAD: 1.35,
    INR: 75.0,
    USD: 1.0,
    // EUR: 0.85,
    // JPY: 110.0,
    // AED: 3.67,
    // SAR: 3.75,
    // QAR: 3.64,
    // KWD: 0.30,
    // BHD: 0.38,
    // OMR: 0.38
  },
  currencySymbols: {
    AUD: 'A$',
    GBP: '£',
    CAD: 'C$',
    INR: '₹',
    USD: '$',
    // EUR: '€',
    // JPY: '¥',
    // AED: 'د.إ',
    // SAR: '﷼',
    // QAR: '﷼',
    // KWD: 'د.ك',
    // BHD: 'د.ب',
    // OMR: 'ر.ع.'
  },
  currencyNames: {
    AUD: 'Australian Dollar',
    GBP: 'British Pound',
    CAD: 'Canadian Dollar',
    INR: 'Indian Rupee',
    USD: 'US Dollar',
    // EUR: 'Euro',
    // JPY: 'Japanese Yen',
    // AED: 'UAE Dirham',
    // SAR: 'Saudi Riyal',
    // QAR: 'Qatari Riyal',
    // KWD: 'Kuwaiti Dinar',
    // BHD: 'Bahraini Dinar',
    // OMR: 'Omani Rial'
  },
  loading: false,
  error: null,
  lastUpdated: null,
  detectedCountry: null,
  locationDetectionMethod: null
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
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle location detection
      .addCase(detectUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCurrency = action.payload.currency;
        state.detectedCountry = action.payload.countryName;
        state.locationDetectionMethod = action.payload.method || 'geolocation';
      })
      .addCase(detectUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep default currency (USD) if detection fails
      })
      // Handle exchange rate fetching
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRates = action.payload.rates;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrency, updateExchangeRates, clearError } = currencySlice.actions;

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
export const selectCurrencyLoading = (state) => state.currency.loading;
export const selectCurrencyError = (state) => state.currency.error;
export const selectLastUpdated = (state) => state.currency.lastUpdated;
export const selectDetectedCountry = (state) => state.currency.detectedCountry;
export const selectLocationDetectionMethod = (state) => state.currency.locationDetectionMethod;

// Helper function to convert price
export const convertPrice = (price, fromCurrency = 'USD', toCurrency, exchangeRates) => {
  if (fromCurrency === toCurrency) return price;
  
  // Convert from USD to target currency
  const rate = exchangeRates[toCurrency] || 1;
  return price * rate;
};

// Helper function to format price
export const formatPrice = (price, currency, symbol) => {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return `${symbol}0`;
  }

  const numericPrice = Number(price);

  // Special formatting for different currencies
  if (currency === 'JPY') {
    return `${symbol}${Math.round(numericPrice)}`;
  }

  if (currency === 'INR') {
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: Number.isInteger(numericPrice) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `${symbol}${formatter.format(numericPrice)}`;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatter.format(numericPrice)}`;
};

export default currencySlice.reducer;
