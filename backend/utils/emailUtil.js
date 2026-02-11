const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = require('../config/env');
const logger = require('./logger');

// Validate SMTP configuration
const validateSmtpConfig = () => {
  const missing = [];
  if (!SMTP_HOST) missing.push('SMTP_HOST');
  if (!SMTP_PORT) missing.push('SMTP_PORT');
  if (!SMTP_USER) missing.push('SMTP_USER');
  if (!SMTP_PASSWORD) missing.push('SMTP_PASSWORD');
  if (!SMTP_FROM) missing.push('SMTP_FROM');
  
  if (missing.length > 0) {
    const errorMsg = `Missing SMTP configuration: ${missing.join(', ')}`;
    logger.error(errorMsg);
    return { valid: false, error: errorMsg };
  }
  return { valid: true };
};

// Create transporter only if config is valid
let transporter;
try {
  const configCheck = validateSmtpConfig();
  if (configCheck.valid) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST, // smtp-relay.brevo.com
      port: parseInt(SMTP_PORT) || 587,
      // secure: parseInt(SMTP_PORT) === 465, // use TLS only for 465
      secure: false,
      auth: {
        user: SMTP_USER, // yourgmail@gmail.com
        pass: SMTP_PASSWORD // brevo smtp key
      }
    });
  }
} catch (error) {
  logger.error('Error creating email transporter:', error);
  transporter = null;
}

const sendEmail = async (to, subject, html) => {
  // Check if transporter is available
  if (!transporter) {
    const configCheck = validateSmtpConfig();
    const errorMsg = configCheck.error || 'Email service is not configured';
    logger.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    const mailOptions = {
      from: SMTP_FROM, 
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    logger.error('Email send error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

module.exports = { sendEmail };
