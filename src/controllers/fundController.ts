import { Request, Response } from 'express';
import fundService from '../services/fundService';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import User from '../models/userModel';

/**
 * Fund user account
 */
export const fundAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { amount, method } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
      return;
    }
    
    // Call the service to fund the account
    const result = await fundService.fundAccount(userId, amount);
    
    if (!result.success) {
      res.status(result.statusCode || 400).json({
        success: false,
        message: result.message
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Account funded successfully',
      data: result.data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fund account',
      error: error.message
    });
  }
};

/**
 * Get fund account details
 */
export const getFundAccountDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    // Call service to get user account details
    const user = await User.findById(userId);
    // const user = await user.findById(userId).select('balance');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        balance: user.balance || 0,
        userId: user._id
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get account details',
      error: error.message
    });
  }
};

/**
 * Create virtual card
 */
export const createVirtualCard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    // Call service to create virtual card
    const result = await fundService.createVirtualCard(userId);
    
    if (!result.success) {
      res.status(result.statusCode || 400).json({
        success: false,
        message: result.message
      });
      return;
    }
    
    res.status(201).json({
      success: true,
      message: 'Virtual card created successfully',
      data: result.data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create virtual card',
      error: error.message
    });
  }
};