import express, { RequestHandler } from 'express';
import { register, login, verifyOTP, resendOTP } from '../controllers/authController';
import { validateRegistration, validateLogin, validateOTP } from '../middleware/validator';

const router = express.Router();

// Register new user
router.post('/register', validateRegistration as RequestHandler, register as RequestHandler);

// Login user
router.post('/login', validateLogin as RequestHandler, login as RequestHandler);

// Verify OTP
router.post('/verify-otp', validateOTP as RequestHandler, verifyOTP as RequestHandler);

// Resend OTP
router.post('/resend-otp', validateLogin as RequestHandler, resendOTP as RequestHandler);

export default router;