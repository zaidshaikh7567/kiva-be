const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = require('../config/env');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, // smtp-relay.brevo.com
  port: parseInt(SMTP_PORT) || 587,
  secure: parseInt(SMTP_PORT) === 465, // use TLS only for 465
  auth: {
    user: SMTP_USER, // yourgmail@gmail.com
    pass: SMTP_PASSWORD // brevo smtp key
  }
});

const sendEmail = async (to, subject, html) => {

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
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
