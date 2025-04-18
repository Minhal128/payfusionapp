import { Router } from 'express';
import kycController from '../controllers/kycController';
import { authenticateToken } from '../middleware/auth';
import { validateKYC } from '../middleware/validator';
import { RequestHandler } from 'express';

const router = Router();

// Submit KYC information
router.post('/', authenticateToken as RequestHandler, validateKYC as RequestHandler, (kycController.createKYC as unknown) as RequestHandler);

// Get user's KYC information
router.get('/', authenticateToken as RequestHandler, (kycController.getKYC as unknown) as RequestHandler);

// Update KYC information
router.put('/', authenticateToken as RequestHandler, validateKYC as RequestHandler, (kycController.updateKYC as unknown) as RequestHandler);

export default router;