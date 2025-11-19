const paypal = require('@paypal/checkout-server-sdk');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = require('../config/env');

let environment;
if (NODE_ENV === 'production') {
  environment = new paypal.core.LiveEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
} else {
  environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}

const client = new paypal.core.PayPalHttpClient(environment);

const createPayPalOrder = async (orderData, currency = 'USD') => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    const orderItems = orderData.items.map(item => ({
      name: item.productName,
      description: `${item.metalName} - ${item.purityLevel.karat}K${item.stoneName ? ` with ${item.stoneName}` : ''}`,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: currency,
        value: item.unitPrice.toFixed(2)
      }
    }));

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: orderData.total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: orderData.subtotal.toFixed(2)
            }
          }
        },
        items: orderItems
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/order/success`,
        cancel_url: `${process.env.FRONTEND_URL}/order/cancel`,
        brand_name: 'Kiva Jewelry',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    });

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('PayPal create order error:', error);
    throw new Error('Failed to create PayPal order');
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
  capturePayPalPayment
};
