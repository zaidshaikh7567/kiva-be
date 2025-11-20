require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const paypal = require('@paypal/checkout-server-sdk');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV :', NODE_ENV);

console.log('\n=== PayPal Credentials Test ===\n');
console.log('Environment:', NODE_ENV);
console.log('Client ID length:', PAYPAL_CLIENT_ID?.length);
console.log('Client Secret length:', PAYPAL_CLIENT_SECRET?.length);
console.log('Client ID (first 15 chars):', PAYPAL_CLIENT_ID?.substring(0, 15));
console.log('Client Secret (first 15 chars):', PAYPAL_CLIENT_SECRET?.substring(0, 15));
console.log('\n');

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error('❌ ERROR: PayPal credentials are missing!');
  process.exit(1);
}

// Create environment
let environment;
try {
  if (NODE_ENV === 'production') {
    environment = new paypal.core.LiveEnvironment(PAYPAL_CLIENT_ID.trim(), PAYPAL_CLIENT_SECRET.trim());
    console.log('Using LIVE environment');
  } else {
    environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID.trim(), PAYPAL_CLIENT_SECRET.trim());
    console.log('Using SANDBOX environment');
  }
} catch (error) {
  console.error('❌ ERROR creating environment:', error.message);
  process.exit(1);
}

const client = new paypal.core.PayPalHttpClient(environment);

// Test with a simple order creation
async function testCredentials() {
  try {
    console.log('Testing credentials with a minimal order...\n');
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '1.00'
        }
      }]
    });

    const response = await client.execute(request);
    console.log('response :', response);
    console.log('✅ SUCCESS! Credentials are valid!');
    console.log('Order ID:', response.result.id);
    console.log('\nYour PayPal credentials are working correctly.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR: Credentials test failed!\n');
    
    if (error.statusCode === 401) {
      console.error('Authentication failed. This means:');
      console.error('  1. The CLIENT_ID or CLIENT_SECRET is incorrect');
      console.error('  2. The credentials are expired or revoked');
      console.error('  3. You\'re using Live credentials with Sandbox environment (or vice versa)');
      console.error('\nTo fix this:');
      console.error('  1. Go to https://developer.paypal.com/');
      console.error('  2. Log in to your PayPal Developer account');
      console.error(`  3. Navigate to ${NODE_ENV === 'production' ? 'Live' : 'Sandbox'} Apps & Credentials`);
      console.error('  4. Create a new app or regenerate credentials');
      console.error('  5. Copy the NEW Client ID and Secret to your .env file');
      console.error('  6. Make sure NODE_ENV matches your credential type\n');
    } else {
      console.error('Error details:', error.message);
      if (error.response) {
        try {
          const errorDetails = typeof error.response === 'string' 
            ? JSON.parse(error.response) 
            : error.response;
          console.error('Error response:', JSON.stringify(errorDetails, null, 2));
        } catch (e) {
          console.error('Error response (raw):', error.response);
        }
      }
    }
    process.exit(1);
  }
}

testCredentials();

