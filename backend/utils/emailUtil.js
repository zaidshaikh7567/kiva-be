const nodemailer = require('nodemailer');

const { GMAIL_USER, GMAIL_APP_PASSWORD } = require('../config/env');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: GMAIL_USER,
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
