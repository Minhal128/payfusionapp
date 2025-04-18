import { Router } from 'express';
import walletController from '../controllers/walletController';
import { authenticateToken } from '../middleware/auth';
import { validateTransaction } from '../middleware/validator';
import { RequestHandler } from 'express';

const router = Router();

// Get wallet balance
router.get('/balance', authenticateToken as RequestHandler, (walletController.getBalance as unknown) as RequestHandler);

// Send money
router.post('/send', authenticateToken as RequestHandler, validateTransaction as RequestHandler, (walletController.sendMoney as unknown) as RequestHandler);

// Receive money (e.g., from payment processor)
router.post('/receive', authenticateToken as RequestHandler, (walletController.receiveMoney as unknown) as RequestHandler);

// Create virtual card
router.post('/virtual-card', authenticateToken as RequestHandler, (walletController.createVirtualCard as unknown) as RequestHandler);

export default router;