import { Router } from 'express';
import investmentController from '../controllers/investmentController';
import { authenticateToken } from '../middleware/auth';
import { RequestHandler } from 'express';

const router = Router();

// Create a new investment
router.post('/', authenticateToken as RequestHandler, investmentController.createInvestment as unknown as RequestHandler);

// Get all investments for a user
router.get('/', authenticateToken as RequestHandler, investmentController.getInvestments as unknown as RequestHandler);

// Get investment by ID
router.get('/:id', authenticateToken as RequestHandler, investmentController.getInvestmentById as unknown as RequestHandler);

export default router;