import { Router } from 'express';
import {
  registerUser,
  verifyOTP,
  loginUser,
  createTransactionPIN,
  updateUserProfile,
  getUserProfile
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateRegistration, validateLogin, validateOTP, validateTransactionPIN } from '../middleware/validator';
import { RequestHandler } from 'express';

const router = Router();

// Public routes
router.post('/register', validateRegistration as RequestHandler, (registerUser as unknown) as RequestHandler);
router.post('/verify-otp', validateOTP as RequestHandler, (verifyOTP as unknown) as RequestHandler);
router.post('/login', validateLogin as RequestHandler, (loginUser as unknown) as RequestHandler);

// Protected routes
router.post('/transaction-pin', authenticateToken as RequestHandler, validateTransactionPIN as RequestHandler, (createTransactionPIN as unknown) as RequestHandler);
router.put('/profile', authenticateToken as RequestHandler, (updateUserProfile as unknown) as RequestHandler);
router.get('/profile', authenticateToken as RequestHandler, (getUserProfile as unknown) as RequestHandler);

export default router;