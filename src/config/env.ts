// import dotenv from 'dotenv';

// dotenv.config();

// const env = {
//   PORT: process.env.PORT || 3000,
//   DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/financial-app',
//   TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
//   TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
//   TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
//   JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
//   OTP_EXPIRY: process.env.OTP_EXPIRY || '1m',
//   MONGODB_URI: process.env.DB_URI || 'mongodb://localhost:27017/financial-app',
// };

// export { env };

import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  OTP_EXPIRY: process.env.OTP_EXPIRY || '1m',
  
  // Fix the database URI to look for both variable names
  MONGODB_URI: process.env.MONGODB_URI || process.env.DB_URI || 'mongodb://localhost:27017/financial-app',
  
  // Twilio credentials
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
};

export { env };