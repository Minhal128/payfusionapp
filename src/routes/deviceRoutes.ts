import { Router } from 'express';
import { verifyDevice, requestDeviceChange } from '../controllers/deviceController';
import { authenticateToken } from '../middleware/auth';
import { RequestHandler } from 'express';

const router = Router();

// Route to verify the device
router.post('/verify', authenticateToken as RequestHandler, verifyDevice as RequestHandler);

// Route to request a device change
router.post('/change', authenticateToken as RequestHandler, requestDeviceChange as RequestHandler);

export default router;