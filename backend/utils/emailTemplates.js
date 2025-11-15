/**
 * Email Templates
 * All email templates use inline CSS for maximum email client compatibility
 */

const { FRONTEND_URL } = require('../config/env');

/**
 * Welcome Email Template for new user registration
 * @param {string} userName - User's name
 * @returns {string} HTML email template
 */
const getWelcomeEmailTemplate = (userName) => {
  const frontendUrl = FRONTEND_URL || 'https://your-website.com';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Kiva Jewelry</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F2; font-family: 'Montserrat', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(5, 31, 52, 0.1);">
          
          <!-- Header Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #051F34; font-family: 'Georgia', serif; letter-spacing: 1px;">
                Kiva<span style="color: #FFFFFF;">.</span>
              </h1>
              <div style="width: 60px; height: 2px; background-color: #FFFFFF; margin: 15px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Welcome Content -->
          <tr>
            <td style="padding: 50px 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif; text-align: center;">
                Welcome to Kiva Jewelry!
              </h2>
              
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665; text-align: center;">
                Dear ${userName || 'Valued Customer'},
              </p>
              
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
                Thank you for joining the Kiva Jewelry family! We're thrilled to have you as part of our community of jewelry lovers who appreciate timeless elegance and exceptional craftsmanship.
              </p>
              
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
                As a member of Kiva, you'll enjoy:
              </p>
              
              <!-- Features List -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="30" valign="top" style="padding-top: 4px;">
                          <span style="color: #E0C0B0; font-size: 20px;">✓</span>
                        </td>
                        <td style="font-size: 15px; line-height: 22px; color: #445665;">
                          <strong style="color: #051F34;">Exclusive Collections</strong> - Discover our handcrafted pieces inspired by Indian heritage
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="30" valign="top" style="padding-top: 4px;">
                          <span style="color: #E0C0B0; font-size: 20px;">✓</span>
                        </td>
                        <td style="font-size: 15px; line-height: 22px; color: #445665;">
                          <strong style="color: #051F34;">Special Offers</strong> - Be the first to know about new arrivals and promotions
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="30" valign="top" style="padding-top: 4px;">
                          <span style="color: #E0C0B0; font-size: 20px;">✓</span>
                        </td>
                        <td style="font-size: 15px; line-height: 22px; color: #445665;">
                          <strong style="color: #051F34;">Free Shipping</strong> - On orders over $100
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="30" valign="top" style="padding-top: 4px;">
                          <span style="color: #E0C0B0; font-size: 20px;">✓</span>
                        </td>
                        <td style="font-size: 15px; line-height: 22px; color: #445665;">
                          <strong style="color: #051F34;">Personalized Service</strong> - Our team is here to help you find the perfect piece
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
                Ready to explore our collection? Start browsing our exquisite jewelry pieces and find something special that speaks to you.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="${frontendUrl}/shop" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); color: #051F34; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; font-family: Arial, sans-serif;">
                      Shop Now
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #EBDCD3, transparent);"></div>
            </td>
          </tr>
          
          <!-- Additional Info Section -->
          <tr>
            <td style="padding: 30px 40px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <h3 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">
                      Need Help?
                    </h3>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                      Our customer service team is here to assist you with any questions or concerns.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="${frontendUrl}/contact" 
                       style="color: #E0C0B0; text-decoration: none; font-size: 15px; font-weight: 500;">
                      Contact Us →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F6F4F2; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 14px; line-height: 22px; color: #445665;">
                Follow us on social media for the latest updates and exclusive offers
              </p>
              
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://www.facebook.com/kiva.diamond/?rdid=GnfsBsErFgHnpej1" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      f
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.instagram.com/kiva.diamond/?igsh=amV5ZDN3M3Y4a3lo#" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      @
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0s" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      W
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0; font-size: 12px; line-height: 18px; color: #445665;">
                © ${new Date().getFullYear()} Kiva Jewelry. All rights reserved.<br>
                Crafting timeless jewelry pieces that celebrate life's most precious moments.
              </p>
              
              <p style="margin: 15px 0 0; font-size: 11px; line-height: 16px; color: #445665;">
                You're receiving this email because you created an account at Kiva Jewelry.<br>
                If you didn't create an account, please ignore this email.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Password Reset Email Template
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 * @returns {string} HTML email template
 */
const getPasswordResetEmailTemplate = (resetToken, userName) => {
  const frontendUrl = FRONTEND_URL || 'https://your-website.com';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Kiva Jewelry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F2; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(5, 31, 52, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #051F34; font-family: 'Georgia', serif;">
                Kiva<span style="color: #FFFFFF;">.</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">
                Reset Your Password
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 26px; color: #445665;">
                Hello ${userName || 'User'},
              </p>
              
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665;">
                We received a request to reset your password for your Kiva Jewelry account. Click the button below to create a new password:
              </p>
              
              <!-- Reset Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0 30px;">
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); color: #051F34; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 15px; font-size: 14px; line-height: 22px; color: #445665;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 25px; font-size: 12px; line-height: 18px; color: #E0C0B0; word-break: break-all;">
                ${resetLink}
              </p>
              
              <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F6F4F2; padding: 30px 40px; text-align: center;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #445665;">
                © ${new Date().getFullYear()} Kiva Jewelry. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Order Confirmation Email Template
 * @param {Object} order - Order object with populated user and items
 * @returns {string} HTML email template
 */
const getOrderConfirmationEmailTemplate = (order) => {
  const frontendUrl = FRONTEND_URL || 'https://your-website.com';
  const userName = order.user?.name || 'Valued Customer';
  const orderNumber = order.orderNumber || 'N/A';
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  // Generate order items HTML
  let orderItemsHTML = '';
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const itemImage = item.productImage || '';
      const metalInfo = `${item.metalName}${item.purityLevel?.karat ? ` (${item.purityLevel.karat}K)` : ''}`;
      const stoneInfo = item.stoneName ? ` • ${item.stoneName}` : '';
      const ringSizeInfo = item.ringSize ? ` • Size: ${item.ringSize}` : '';
      
      orderItemsHTML += `
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="100" valign="top" style="padding-right: 20px;">
                          ${itemImage ? `
                          <img src="${itemImage}" 
                               alt="${item.productName}" 
                               style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #EBDCD3;" />
                          ` : `
                          <div style="width: 100px; height: 100px; background-color: #F6F4F2; border-radius: 8px; border: 1px solid #EBDCD3; display: flex; align-items: center; justify-content: center; color: #445665; font-size: 12px;">
                            No Image
                          </div>
                          `}
                        </td>
                        <td valign="top">
                          <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">
                            ${item.productName}
                          </h3>
                          <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #445665;">
                            ${metalInfo}${stoneInfo}${ringSizeInfo}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="padding-right: 15px;">
                                <span style="font-size: 14px; color: #445665;">Quantity: <strong style="color: #051F34;">${item.quantity || 1}</strong></span>
                              </td>
                              <td>
                                <span style="font-size: 14px; color: #445665;">Price: <strong style="color: #051F34;">${formatCurrency(item.unitPrice)}</strong></span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td align="right" valign="top" style="padding-left: 20px;">
                          <p style="margin: 0; font-size: 20px; font-weight: 600; color: #051F34;">
                            ${formatCurrency(item.totalPrice)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
      `;
    });
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Thank You for Your Order - Kiva Jewelry</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F2; font-family: 'Montserrat', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(5, 31, 52, 0.1);">
          
          <!-- Header Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #051F34; font-family: 'Georgia', serif; letter-spacing: 1px;">
                Kiva<span style="color: #FFFFFF;">.</span>
              </h1>
              <div style="width: 60px; height: 2px; background-color: #FFFFFF; margin: 15px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Thank You Content -->
          <tr>
            <td style="padding: 50px 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif; text-align: center;">
                Thank You for Your Order! 🎉
              </h2>
              
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665; text-align: center;">
                Dear ${userName},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
                We've received your order and are preparing it for shipment. We'll send you a confirmation once your order ships.
              </p>
              
              <!-- Order Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="font-size: 14px; color: #445665; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</strong>
                          <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #051F34;">${orderNumber}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; border-top: 1px solid #EBDCD3; padding-top: 12px;">
                          <strong style="font-size: 14px; color: #445665; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</strong>
                          <p style="margin: 5px 0 0; font-size: 16px; color: #051F34;">${orderDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top: 1px solid #EBDCD3; padding-top: 12px;">
                          <strong style="font-size: 14px; color: #445665; text-transform: uppercase; letter-spacing: 0.5px;">Order Status</strong>
                          <p style="margin: 5px 0 0; font-size: 16px; color: #051F34; text-transform: capitalize;">${order.status || 'Pending'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Order Items Section -->
              <h3 style="margin: 0 0 20px; font-size: 22px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif; border-bottom: 2px solid #E0C0B0; padding-bottom: 10px;">
                Order Summary
              </h3>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                ${orderItemsHTML}
              </table>

              <!-- Order Totals -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="right" style="padding: 15px 20px; border-top: 2px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                      <tr>
                        <td style="padding: 5px 15px 5px 0; font-size: 16px; color: #445665;">Subtotal:</td>
                        <td style="padding: 5px 0; font-size: 16px; color: #051F34; font-weight: 500; text-align: right; min-width: 100px;">${formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 15px 5px 0; font-size: 16px; color: #445665;">Shipping:</td>
                        <td style="padding: 5px 0; font-size: 16px; color: #051F34; font-weight: 500; text-align: right;">Free</td>
                      </tr>
                      <tr style="border-top: 2px solid #E0C0B0;">
                        <td style="padding: 10px 15px 10px 0; font-size: 20px; font-weight: 600; color: #051F34;">Total:</td>
                        <td style="padding: 10px 0; font-size: 20px; font-weight: 600; color: #051F34; text-align: right;">${formatCurrency(order.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Shipping & Billing Addresses -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 15px;">
                    <h4 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">Shipping Address</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                      ${formatAddress(order.shippingAddress)}
                    </p>
                    ${order.phone ? `<p style="margin: 8px 0 0; font-size: 14px; color: #445665;"><strong>Phone:</strong> ${order.phone}</p>` : ''}
                  </td>
                  <td width="50%" valign="top" style="padding-left: 15px;">
                    <h4 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">Billing Address</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                      ${formatAddress(order.billingAddress)}
                    </p>
                    <p style="margin: 8px 0 0; font-size: 14px; color: #445665;"><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
                  </td>
                </tr>
              </table>

              ${order.notes ? `
              <!-- Order Notes -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #F6F4F2; border-radius: 8px;">
                    <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #051F34;">Order Notes:</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">${order.notes}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 0 0 25px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
                You can track your order status anytime by visiting your account dashboard. We'll also send you updates as your order progresses.
              </p>
              
              <!-- CTA Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="${frontendUrl}/dashboard" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); color: #051F34; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; font-family: Arial, sans-serif; margin-right: 10px;">
                      View Order
                    </a>
                    <a href="${frontendUrl}/shop" 
                       style="display: inline-block; padding: 16px 40px; background: transparent; color: #051F34; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; border: 2px solid #E0C0B0; font-family: Arial, sans-serif;">
                      Continue Shopping
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #EBDCD3, transparent);"></div>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td style="padding: 30px 40px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <h3 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">
                      Questions About Your Order?
                    </h3>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                      Our customer service team is here to help with any questions or concerns.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="${frontendUrl}/contact" 
                       style="color: #E0C0B0; text-decoration: none; font-size: 15px; font-weight: 500;">
                      Contact Us →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F6F4F2; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 14px; line-height: 22px; color: #445665;">
                Follow us on social media for the latest updates and exclusive offers
              </p>
              
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://www.facebook.com/kiva.diamond/?rdid=GnfsBsErFgHnpej1" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      f
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.instagram.com/kiva.diamond/?igsh=amV5ZDN3M3Y4a3lo#" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      @
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0" 
                       style="display: inline-block; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; color: #051F34; text-decoration: none; font-size: 18px;">
                      W
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0; font-size: 12px; line-height: 18px; color: #445665;">
                © ${new Date().getFullYear()} Kiva Jewelry. All rights reserved.<br>
                Crafting timeless jewelry pieces that celebrate life's most precious moments.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

module.exports = {
  getWelcomeEmailTemplate,
  getPasswordResetEmailTemplate,
  getOrderConfirmationEmailTemplate
};

