const paypal = require('@paypal/checkout-server-sdk');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV, FRONTEND_URL } = require('../config/env');

// Validate PayPal credentials format
const validatePayPalCredentials = () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are missing! Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file');
  }

  // Trim whitespace
  const clientId = PAYPAL_CLIENT_ID.trim();
  const clientSecret = PAYPAL_CLIENT_SECRET.trim();

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials cannot be empty. Please check your .env file');
  }

  // Check if credentials look valid (basic format check)
  if (clientId.length < 10 || clientSecret.length < 10) {
    console.warn('Warning: PayPal credentials seem too short. Please verify they are correct.');
  }

  return { clientId, clientSecret };
};

// Validate and get credentials
let clientId, clientSecret;
try {
  const credentials = validatePayPalCredentials();
  clientId = credentials.clientId;
  clientSecret = credentials.clientSecret;
} catch (error) {
  console.error('PayPal Credential Validation Error:', error.message);
  throw error;
}

// Log environment info (without exposing secrets)
console.log('PayPal Configuration:');
console.log(`  Environment: ${NODE_ENV === 'production' ? 'LIVE' : 'SANDBOX'}`);
console.log(`  Client ID: ${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 4)}`);
console.log(`  Client Secret: ${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}`);
console.log(`  Frontend URL: ${FRONTEND_URL}`);

let environment;
try {
  if (NODE_ENV === 'production') {
    environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
} catch (error) {
  console.error('Error creating PayPal environment:', error.message);
  throw new Error(`Failed to initialize PayPal environment: ${error.message}`);
}

const client = new paypal.core.PayPalHttpClient(environment);
console.log('client :', client);

// PayPal supported currencies (commonly supported)
// Note: INR is NOT supported by PayPal - it must be converted to USD
const PAYPAL_SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'HKD', 'SGD',
  'NZD', 'SEK', 'DKK', 'NOK', 'PLN', 'MXN', 'BRL', 'ZAR', 'AED', 'SAR',
  'QAR', 'KWD', 'BHD', 'OMR', 'ILS', 'TRY', 'RUB', 'THB', 'MYR', 'PHP',
  'IDR', 'KRW', 'TWD', 'CZK', 'HUF', 'RON', 'BGN', 'HRK'
  // INR is explicitly NOT supported and must be converted to USD
];

/**
 * Check if a currency is supported by PayPal
 * @param {string} currency - Currency code to check
 * @returns {boolean} - True if supported
 */
const isPayPalSupportedCurrency = (currency) => {
  const normalized = (currency || '').toUpperCase().trim();
  return PAYPAL_SUPPORTED_CURRENCIES.includes(normalized);
};

/**
 * Convert unsupported currency to USD for PayPal processing
 * @param {string} currency - Original currency code (the currency the prices are currently in)
 * @param {number} exchangeRate - Exchange rate from USD to original currency (e.g., 83 means 1 USD = 83 INR)
 * @returns {object} - Object with paypalCurrency and conversionRate
 */
const getPayPalCurrency = (currency, exchangeRate = null) => {
  const normalizedCurrency = (currency || 'USD').toUpperCase().trim();
  
  // If currency is supported, use it directly
  if (isPayPalSupportedCurrency(normalizedCurrency)) {
    return {
      paypalCurrency: normalizedCurrency,
      conversionRate: 1,
      originalCurrency: normalizedCurrency,
      requiresConversion: false
    };
  }
  
  // For unsupported currencies (like INR), convert back to USD
  // exchangeRate is from USD to target currency (e.g., 83 means 1 USD = 83 INR)
  // So to convert INR back to USD, we divide by exchangeRate
  // If exchangeRate is not provided, we can't convert, so throw an error
  if (!exchangeRate || exchangeRate <= 0) {
    console.error(`[PayPal] Currency ${normalizedCurrency} is not supported and no valid exchange rate provided.`);
    throw new Error(`Currency ${normalizedCurrency} is not supported by PayPal. Please provide a valid exchange rate to convert to USD, or use a supported currency.`);
  }
  
  const rate = 1 / exchangeRate; // Convert from target currency back to USD
  
  console.log(`[PayPal] Currency ${normalizedCurrency} is not supported by PayPal. Converting to USD.`);
  console.log(`[PayPal] Exchange rate: 1 ${normalizedCurrency} = ${rate.toFixed(6)} USD (or 1 USD = ${exchangeRate} ${normalizedCurrency})`);
  
  return {
    paypalCurrency: 'USD',
    conversionRate: rate,
    originalCurrency: normalizedCurrency,
    requiresConversion: true
  };
};

const createPayPalOrder = async (orderData, currency = 'USD', exchangeRate = null) => {
  try {
    // Credentials are already validated at module load time

    // Validate and normalize currency
    const normalizedCurrency = (currency || 'USD').toUpperCase().trim();
    // Basic validation: must be 3 uppercase letters
    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      throw new Error(`Invalid currency code: ${currency}. Must be a 3-letter currency code (e.g., USD, CAD)`);
    }

    // Get PayPal-compatible currency (convert unsupported currencies to USD)
    console.log(`[PayPal] Original currency: ${normalizedCurrency}, Exchange rate: ${exchangeRate}`);
    const paypalCurrencyInfo = getPayPalCurrency(normalizedCurrency, exchangeRate);
    const paypalCurrency = paypalCurrencyInfo.paypalCurrency;
    const conversionRate = paypalCurrencyInfo.conversionRate;
    
    console.log(`[PayPal] PayPal currency: ${paypalCurrency}, Conversion rate: ${conversionRate}, Requires conversion: ${paypalCurrencyInfo.requiresConversion}`);
    
    if (paypalCurrencyInfo.requiresConversion) {
      console.log(`[PayPal] Converting ${normalizedCurrency} to ${paypalCurrency} for PayPal processing`);
      console.log(`[PayPal] Original order total: ${orderData.total} ${normalizedCurrency}`);
      console.log(`[PayPal] Converted order total: ${(orderData.total * conversionRate).toFixed(2)} ${paypalCurrency}`);
    }

    // Validate order data
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error('Invalid order data: items are required');
    }

    if (!orderData.total || orderData.total <= 0) {
      throw new Error('Invalid order data: total must be greater than 0');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    const orderItems = orderData.items.map(item => {
      // Validate item data
      if (!item.productName || !item.unitPrice || !item.quantity) {
        throw new Error(`Invalid item data: productName, unitPrice, and quantity are required for item: ${JSON.stringify(item)}`);
      }

      const description = item.purityLevel && item.purityLevel.karat 
        ? `${item.metalName || 'Metal'} - ${item.purityLevel.karat}K${item.stoneName ? ` with ${item.stoneName}` : ''}`
        : item.metalName || 'Jewelry Item';

      return {
        name: item.productName.substring(0, 127), // PayPal has a 127 character limit
        description: description.substring(0, 127),
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: paypalCurrency,
          value: parseFloat(item.unitPrice * conversionRate).toFixed(2)
        }
      };
    });

    // Convert amounts to PayPal currency if needed
    const totalAmount = parseFloat((orderData.total * conversionRate)).toFixed(2);
    const subtotalAmount = parseFloat((orderData.subtotal || orderData.total) * conversionRate).toFixed(2);

    // Validate amounts
    if (isNaN(totalAmount) || parseFloat(totalAmount) <= 0) {
      throw new Error(`Invalid total amount: ${orderData.total}`);
    }
// https://sandbox.paypal.com

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: paypalCurrency,
          value: totalAmount,
          breakdown: {
            item_total: {
              currency_code: paypalCurrency,
              value: subtotalAmount
            }
          }
        },
        items: orderItems
      }],
      application_context: {
        return_url: `${FRONTEND_URL.replace(/\/$/, '')}/order/success`,
        cancel_url: `${FRONTEND_URL.replace(/\/$/, '')}/order/cancel`,
        brand_name: 'Kiva Jewelry',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    });

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal create order error:', error);
    
    // PayPal SDK errors have a specific structure
    let errorMessage = 'Failed to create PayPal order';
    let errorDetails = null;

    if (error.statusCode) {
      console.error('PayPal API Status Code:', error.statusCode);
      errorMessage = `PayPal API Error (${error.statusCode})`;
    }

    // Try to extract error details from PayPal response
    if (error.response) {
      try {
        errorDetails = typeof error.response === 'string' 
          ? JSON.parse(error.response) 
          : error.response;
        console.error('PayPal API Response:', JSON.stringify(errorDetails, null, 2));
        
        if (errorDetails.details && Array.isArray(errorDetails.details) && errorDetails.details.length > 0) {
          const firstError = errorDetails.details[0];
          errorMessage = firstError.description || firstError.issue || errorMessage;
        } else if (errorDetails.message) {
          errorMessage = errorDetails.message;
        } else if (errorDetails.error_description) {
          errorMessage = errorDetails.error_description;
        }
        console.error('Current Environment:', NODE_ENV === 'production' ? 'LIVE' : 'SANDBOX');

        // Handle specific authentication errors
        if (errorDetails.error === 'invalid_client') {
          errorMessage = 'PayPal Client Authentication failed. Please check your credentials.';
          console.error('\n=== PayPal Authentication Error ===');
          console.error('The PayPal CLIENT_ID or CLIENT_SECRET is incorrect.');
          console.error('\nTo fix this:');
          console.error('1. Go to https://developer.paypal.com/');
          console.error('2. Log in to your PayPal Developer account');
          console.error(`3. Navigate to ${NODE_ENV === 'production' ? 'Live' : 'Sandbox'} Apps & Credentials`);
          console.error('4. Create a new app or use existing app credentials');
          console.error('5. Copy the Client ID and Secret to your .env file');
          console.error('6. Make sure NODE_ENV matches your credential type (development=sandbox, production=live)');
          console.error('=====================================\n');
        }
      } catch (parseError) {
        console.error('Error parsing PayPal response:', parseError);
        console.error('Raw PayPal response:', error.response);
      }
    }

    if (error.message && !errorDetails) {
      console.error('PayPal Error Message:', error.message);
      errorMessage = error.message;
    }

    // Log full error for debugging
    console.error('Full error object:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      response: error.response,
      stack: error.stack
    });

    throw new Error(`PayPal Error: ${errorMessage}`);
  }
};

const capturePayPalPayment = async (orderId) => {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal capture payment error:', error);
    throw new Error('Failed to capture PayPal payment');
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalPayment,
  isPayPalSupportedCurrency,
  getPayPalCurrency
};
