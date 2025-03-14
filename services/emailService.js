const nodemailer = require('nodemailer');
const { email } = require('../config/config');

const transporter = nodemailer.createTransport({
    service: email.service,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });
  
  const sendResetEmail = async (to, resetLink) => {
    const mailOptions = {
      from: email.user,
      to,
      subject: 'Password Reset - Expense Tracker',
      text: `Click the following link to reset your password: ${resetLink}\nThis link will expire in 15 minutes.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return { success: true, message: 'Reset email sent!' };
    } catch (err) {
      return { success: false, message: `Failed to send email: ${err.message}` };
    }
  };
  
  module.exports = { sendResetEmail };