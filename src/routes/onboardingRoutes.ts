import { Router } from 'express';
import { confirmTransactionPin, uploadProfilePicture, uploadUtilityBill } from '../controllers/onboardingController';
import { authenticateToken } from '../middleware/auth';
import { validateOnboarding } from '../middleware/validator';
import { RequestHandler } from 'express';

const router = Router();

// Set transaction PIN
router.post('/transaction-pin', authenticateToken as RequestHandler, validateOnboarding as RequestHandler, confirmTransactionPin as RequestHandler);

// Upload profile picture
router.post('/profile-picture', authenticateToken as RequestHandler, uploadProfilePicture as RequestHandler);

// Upload utility bill
router.post('/utility-bill', authenticateToken as RequestHandler, uploadUtilityBill as RequestHandler);

export default router;