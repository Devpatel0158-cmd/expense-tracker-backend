require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};