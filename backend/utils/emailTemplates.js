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
  // Logo URL - Update this to point to a publicly accessible logo image
  // Option 1: If logo is in public folder: const logoUrl = `${frontendUrl}/kiva-diamond-logo.png`;
  // Option 2: Use a CDN/hosted URL: const logoUrl = 'https://your-cdn.com/kiva-diamond-logo.png';
  // Add logo from thebackend assets 
   
  const logoUrl = `https://testing-kiva.netlify.app/public/kiva-diamond-logo.png`; // Assumes logo is in public folder
  console.log('logoUrl :', logoUrl);
  return `
<!DOCTYPE html>
<html lang="en">s
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Kiva Jewelry</title>
  <style type="text/css">
    /* Responsive Email Styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-content {
        padding: 20px !important;
      }
      .email-header {
        padding: 30px 20px !important;
      }
      .logo-img {
        max-width: 150px !important;
        height: auto !important;
      }
      h1 {
        font-size: 24px !important;
      }
      h2 {
        font-size: 22px !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        margin: 10px 0 !important;
      }
      .two-column {
        width: 100% !important;
        display: block !important;
      }
      .social-table {
        width: 100% !important;
      }
    }
    /* Prevent iOS auto-detection of phone numbers */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
    .logo-img { width: 180px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F2; font-family: 'Montserrat', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(5, 31, 52, 0.1);">
          
          <!-- Header Section -->
          <tr>
            <td class="email-header" style="background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Kiva Jewelry" class="logo-img" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
              <div style="width: 60px; height: 2px; background-color: #FFFFFF; margin: 15px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Welcome Content -->
          <tr>
            <td class="email-content" style="padding: 50px 40px 40px;">
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
                       class="cta-button"
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
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                   <svg stroke="currentColor"  stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                       </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.instagram.com/kiva.diamond/?igsh=amV5ZDN3M3Y4a3lo#" 
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                    <svg stroke="currentColor"  stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"></path></svg>
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0s" 
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                      <svg stroke="currentColor"  stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M260.062 32C138.605 32 40.134 129.701 40.134 250.232c0 41.23 11.532 79.79 31.559 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.749 480 250.232 480 129.701 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.899 25.072-10.314.547-10.608 7.994-66.84-16.434-56.225-24.434-90.052-83.844-92.719-87.67-2.669-3.812-21.78-31.047-20.749-58.455 1.038-27.413 16.047-40.346 21.404-45.725 5.351-5.387 11.486-6.352 15.232-6.413 4.428-.072 7.296-.132 10.573-.011 3.274.124 8.192-.685 12.45 10.639 4.256 11.323 14.443 39.153 15.746 41.989 1.302 2.839 2.108 6.126.102 9.771-2.012 3.653-3.042 5.935-5.961 9.083-2.935 3.148-6.174 7.042-8.792 9.449-2.92 2.665-5.97 5.572-2.9 11.269 3.068 5.693 13.653 24.356 29.779 39.736 20.725 19.771 38.598 26.329 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.929 3.404-3.599 14.639-15.746 18.596-21.169 3.955-5.438 7.661-4.373 12.742-2.329 5.078 2.052 32.157 16.556 37.673 19.551 5.51 2.989 9.193 4.529 10.51 6.9 1.317 2.38.901 13.531-4.271 26.359z"></path></svg>

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
const getOtpEmailTemplate = (otp, userName) => {
  const frontendUrl = FRONTEND_URL || "https://your-website.com";
  const logoUrl = `${frontendUrl}/kiva-diamond-logo.png`; // Must be publicly accessible (Netlify removes /public)
  
  
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset OTP - Kiva Jewelry</title>
  <style>
  @media only screen and (max-width: 600px) {
  .email-container { width: 100% !important; }
  .email-content { padding: 30px 20px !important; }
  .email-header { padding: 30px 20px !important; }
  .logo-img { max-width: 150px !important; }
  }
  </style>
  </head>
  <body style="margin:0;padding:0;background-color:#F6F4F2;font-family:Arial,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#F6F4F2;">
  <tr>
  <td align="center" style="padding:40px 20px;">
  <table width="600" class="email-container" style="background:#FFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(5,31,52,0.1);">
  
  
  <tr>
  <td class="email-header" style="background:linear-gradient(135deg,#E0C0B0,#D9B5A1);padding:40px 30px;text-align:center;">
  <img src="${logoUrl}" alt="Kiva Jewelry" class="logo-img" style="max-width:180px;height:auto;display:block;margin:0 auto;" />
  </td>
  </tr>
  
  
  <tr>
  <td class="email-content" style="padding:50px 40px;">
  
  
  <h2 style="margin:0 0 20px;font-size:24px;color:#051F34;font-family:Georgia,serif;">Password Reset OTP</h2>
  
  
  <p style="font-size:16px;color:#445665;line-height:24px;">Hello ${userName || "User"},</p>
  
  
  <p style="font-size:16px;color:#445665;line-height:24px;">Use the OTP below to reset your password. This OTP is valid for <strong>10 minutes</strong>.</p>
  
  
  <div style="margin:30px 0;text-align:center;">
  <div style="display:inline-block;padding:16px 40px;background:#E0C0B0;color:#051F34;font-size:28px;font-weight:bold;border-radius:8px;letter-spacing:4px;">
  ${otp}
  </div>
  </div>
  
  
  <p style="font-size:14px;color:#445665;line-height:22px;">If you did not request a password reset, please ignore this email.</p>
  
  
  </td>
  </tr>
  
  
  <tr>
  <td style="background:#F6F4F2;padding:30px 40px;text-align:center;">
  <p style="font-size:12px;color:#445665;">© ${new Date().getFullYear()} Kiva Jewelry. All rights reserved.</p>
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
  // Logo URL - Update this to point to a publicly accessible logo image
  // Option 1: If logo is in public folder: const logoUrl = `${frontendUrl}/kiva-diamond-logo.png`;
  // Option 2: Use a CDN/hosted URL: const logoUrl = 'https://your-cdn.com/kiva-diamond-logo.png';
  const logoUrl = `${frontendUrl}/kiva-diamond-logo.png`; // Assumes logo is in public folder
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
                  <td class="order-item-container" style="padding: 20px; border-bottom: 1px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="order-item-row" style="width: 100%;">
                      <tr>
                        <td width="100" valign="top" class="order-item-image-cell" style="width: 100px; padding-right: 20px;">
                          ${itemImage ? `
                          <img src="${itemImage}" 
                               alt="${item.productName}" 
                               class="order-item-image"
                               style="width: 100px; height: 100px; max-width: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #EBDCD3;" />
                          ` : `
                          <div class="order-item-image" style="width: 100px; height: 100px; max-width: 100px; background-color: #F6F4F2; border-radius: 8px; border: 1px solid #EBDCD3; display: flex; align-items: center; justify-content: center; color: #445665; font-size: 12px;">
                            No Image
                          </div>
                          `}
                        </td>
                        <td valign="top" class="order-item-details order-item-details-cell" style="padding-left: 0;">
                          <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">
                            ${item.productName}
                          </h3>
                          <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #445665;">
                            ${metalInfo}${stoneInfo}${ringSizeInfo}
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="order-item-quantity-price">
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
                        <td align="right" valign="top" class="order-item-price-cell" style="padding-left: 20px; text-align: right;">
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
  <style type="text/css">
    /* Responsive Email Styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-content {
        padding: 30px 20px !important;
      }
      .email-header {
        padding: 30px 20px !important;
      }
      .logo-img {
        max-width: 150px !important;
        height: auto !important;
      }
      h1 {
        font-size: 24px !important;
      }
      h2 {
        font-size: 22px !important;
      }
      h3 {
        font-size: 20px !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        margin: 10px 0 !important;
        margin-right: 0 !important;
      }
      .two-column {
        width: 100% !important;
        display: block !important;
      }
      .order-item-image {
        width: 80px !important;
        height: 80px !important;
        max-width: 80px !important;
      }
      .order-item-details {
        padding-left: 0 !important;
      }
      .order-item-container {
        padding: 15px !important;
      }
      .order-item-container h3 {
        font-size: 16px !important;
      }
      .order-item-container p {
        font-size: 13px !important;
      }
      .order-item-row {
        width: 100% !important;
      }
      .order-item-row tr {
        display: block !important;
      }
      .order-item-image-cell {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        padding-right: 0 !important;
        padding-bottom: 15px !important;
        padding-left: 0 !important;
        text-align: center !important;
      }
      .order-item-image-cell[width] {
        width: 100% !important;
      }
      .order-item-details-cell {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 15px !important;
      }
      .order-item-price-cell {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        text-align: left !important;
        padding-top: 15px !important;
        border-top: 1px solid #EBDCD3 !important;
      }
      .order-item-price-cell[align] {
        text-align: left !important;
      }
      .order-item-price-cell p {
        font-size: 18px !important;
      }
      .order-totals-table {
        width: 100% !important;
      }
      .order-totals-cell {
        text-align: left !important;
        padding: 15px 0 !important;
      }
      .order-totals-inner {
        width: 100% !important;
        margin: 0 auto !important;
      }
      .order-totals-label {
        width: auto !important;
        min-width: auto !important;
      }
      .order-item-quantity-price {
        display: block !important;
      }
      .order-item-quantity-price td {
        display: block !important;
        padding: 5px 0 !important;
      }
      .order-items-table {
        width: 100% !important;
      }
      .order-items-table td {
        width: 100% !important;
        display: block !important;
      }
    }
    /* Prevent iOS auto-detection of phone numbers */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
    .logo-img { width: 180px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F2; font-family: 'Montserrat', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F4F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(5, 31, 52, 0.1);">
          
          <!-- Header Section -->
          <tr>
            <td class="email-header" style="background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Kiva Jewelry" class="logo-img" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
              <div style="width: 60px; height: 2px; background-color: #FFFFFF; margin: 15px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Thank You Content -->
          <tr>
            <td class="email-content" style="padding: 50px 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif; text-align: center;">
                Thank You for Your Order! 🎉
              </h2>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 26px; color: #445665; text-align: center;">
                Dear ${userName},
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #445665; text-align: left;">
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
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="order-items-table" style="margin-bottom: 30px;">
                ${orderItemsHTML}
              </table>

              <!-- Order Totals -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="order-totals-table" style="margin-bottom: 30px;">
                <tr>
                  <td align="right" class="order-totals-cell" style="padding: 15px 20px; border-top: 2px solid #EBDCD3;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right" class="order-totals-inner">
                      <tr>
                        <td class="order-totals-label" style="padding: 5px 15px 5px 0; font-size: 16px; color: #445665;">Subtotal:</td>
                        <td style="padding: 5px 0; font-size: 16px; color: #051F34; font-weight: 500; text-align: right; min-width: 100px;">${formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td class="order-totals-label" style="padding: 5px 15px 5px 0; font-size: 16px; color: #445665;">Shipping:</td>
                        <td style="padding: 5px 0; font-size: 16px; color: #051F34; font-weight: 500; text-align: right;">Free</td>
                      </tr>
                      <tr style="border-top: 2px solid #E0C0B0;">
                        <td class="order-totals-label" style="padding: 10px 15px 10px 0; font-size: 20px; font-weight: 600; color: #051F34;">Total:</td>
                        <td style="padding: 10px 0; font-size: 20px; font-weight: 600; color: #051F34; text-align: right;">${formatCurrency(order.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Shipping & Billing Addresses -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td width="50%" valign="top" class="two-column" style="padding-right: 15px; padding-bottom: 20px;">
                    <h4 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #051F34; font-family: 'Georgia', serif;">Shipping Address</h4>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #445665;">
                      ${formatAddress(order.shippingAddress)}
                    </p>
                    ${order.phone ? `<p style="margin: 8px 0 0; font-size: 14px; color: #445665;"><strong>Phone:</strong> ${order.phone}</p>` : ''}
                  </td>
                  <td width="50%" valign="top" class="two-column" style="padding-left: 15px;">
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
                       class="cta-button"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #E0C0B0 0%, #D9B5A1 100%); color: #051F34; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; font-family: Arial, sans-serif; margin-right: 10px;">
                      View Order
                    </a>
                    <a href="${frontendUrl}/shop" 
                       class="cta-button"
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
            <td class="email-content" style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #EBDCD3, transparent);"></div>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td class="email-content" style="padding: 30px 40px 40px;">
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
            <td class="email-content" style="background-color: #F6F4F2; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 14px; line-height: 22px; color: #445665;">
                Follow us on social media for the latest updates and exclusive offers
              </p>
              
              <!-- Social Links -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://www.facebook.com/kiva.diamond/?rdid=GnfsBsErFgHnpej1" 
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                   <svg stroke="currentColor" 
                    stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                       </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.instagram.com/kiva.diamond/?igsh=amV5ZDN3M3Y4a3lo#" 
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                    <svg stroke="currentColor" 
                     stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"></path></svg>
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://api.whatsapp.com/send/?phone=919106302269&text&type=phone_number&app_absent=0s" 
                       style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #E0C0B0; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                      <svg stroke="currentColor" 
                       stroke-width="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M260.062 32C138.605 32 40.134 129.701 40.134 250.232c0 41.23 11.532 79.79 31.559 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.749 480 250.232 480 129.701 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.899 25.072-10.314.547-10.608 7.994-66.84-16.434-56.225-24.434-90.052-83.844-92.719-87.67-2.669-3.812-21.78-31.047-20.749-58.455 1.038-27.413 16.047-40.346 21.404-45.725 5.351-5.387 11.486-6.352 15.232-6.413 4.428-.072 7.296-.132 10.573-.011 3.274.124 8.192-.685 12.45 10.639 4.256 11.323 14.443 39.153 15.746 41.989 1.302 2.839 2.108 6.126.102 9.771-2.012 3.653-3.042 5.935-5.961 9.083-2.935 3.148-6.174 7.042-8.792 9.449-2.92 2.665-5.97 5.572-2.9 11.269 3.068 5.693 13.653 24.356 29.779 39.736 20.725 19.771 38.598 26.329 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.929 3.404-3.599 14.639-15.746 18.596-21.169 3.955-5.438 7.661-4.373 12.742-2.329 5.078 2.052 32.157 16.556 37.673 19.551 5.51 2.989 9.193 4.529 10.51 6.9 1.317 2.38.901 13.531-4.271 26.359z"></path></svg>

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
  getOtpEmailTemplate,
  getOrderConfirmationEmailTemplate
};

