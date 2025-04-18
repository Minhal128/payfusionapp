import { Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import transactionController from '../controllers/transactionController';
import fundService from '../services/fundService';
import User from '../models/userModel';

class WalletController {
  /**
   * Send money to another user
   */
  async sendMoney(req: AuthenticatedRequest, res: Response): Promise<Response> {
    // Reuse the transaction controller's sendMoney function
    return transactionController.sendMoney(req, res);
  }

  /**
   * Receive money into wallet
   */
  async receiveMoney(req: AuthenticatedRequest, res: Response): Promise<Response> {
    // Reuse the transaction controller's receiveMoney function
    return transactionController.receiveMoney(req, res);
  }

  /**
   * Create a virtual card
   */
  async createVirtualCard(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      // Call service to create virtual card
      const result = await fundService.createVirtualCard(userId);
      
      if (!result.success) {
        return res.status(result.statusCode || 400).json({
          status: 'error',
          message: result.message
        });
      }
      
      return res.status(201).json({
        status: 'success',
        message: 'Virtual card created successfully',
        data: result.data
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create virtual card',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Balance retrieved successfully',
        data: {
          balance: user.get('balance') || 0
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve balance',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

export default new WalletController();