import { Router } from 'express';
import { fundAccount, getFundAccountDetails, createVirtualCard } from '../controllers/fundController';
import { authenticateToken } from '../middleware/auth';
import { RequestHandler } from 'express';

const router = Router();

// Fund account
router.post('/fund', authenticateToken as RequestHandler, fundAccount as RequestHandler);

// Get fund account details
router.get('/details', authenticateToken as RequestHandler, getFundAccountDetails as RequestHandler);

// Create virtual card
router.post('/virtual-card', authenticateToken as RequestHandler, createVirtualCard as RequestHandler);

export default router;