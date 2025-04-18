import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';
import { validateTransaction } from '../middleware/validator';
import { RequestHandler } from 'express';

const router = Router();

// Create transaction
router.post('/', authenticateToken as RequestHandler, validateTransaction as RequestHandler, (transactionController.createTransaction as unknown) as RequestHandler);

// Get transaction history
router.get('/history', authenticateToken as RequestHandler, (transactionController.getTransactionHistory as unknown) as RequestHandler);

// Send money
router.post('/send', authenticateToken as RequestHandler, validateTransaction as RequestHandler, (transactionController.sendMoney as unknown) as RequestHandler);

// Receive money
router.post('/receive', authenticateToken as RequestHandler, (transactionController.receiveMoney as unknown) as RequestHandler);

export default router;