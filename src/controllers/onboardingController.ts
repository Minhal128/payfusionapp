import { Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import User from '../models/userModel';

/**
 * Set and confirm transaction PIN
 */
export const confirmTransactionPin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { transactionPin } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // In a real implementation, you'd hash the PIN before saving
    user.transactionPIN = transactionPin;
    
    // Check if this completes onboarding
    if (user.profilePicture && user.utilityBill) {
      user.isOnboardingComplete = true;
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Transaction PIN set successfully',
      data: {
        isOnboardingComplete: user.isOnboardingComplete
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to set transaction PIN',
      error: error.message
    });
  }
};

/**
 * Upload user profile picture
 */
export const uploadProfilePicture = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // In a real implementation, req.file would contain the uploaded file info
    const profilePictureUrl = req.file?.path || req.body.profilePictureUrl;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!profilePictureUrl) {
      res.status(400).json({
        success: false,
        message: 'No profile picture provided'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    user.profilePicture = profilePictureUrl;
    
    // Check if this completes onboarding
    if (user.transactionPIN && user.utilityBill) {
      user.isOnboardingComplete = true;
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: user.profilePicture,
        isOnboardingComplete: user.isOnboardingComplete
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: error.message
    });
  }
};

/**
 * Upload utility bill for address verification
 */
export const uploadUtilityBill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const utilityBillUrl = req.file?.path || req.body.utilityBillUrl;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!utilityBillUrl) {
      res.status(400).json({
        success: false,
        message: 'No utility bill provided'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    user.utilityBill = utilityBillUrl;
    
    // Check if this completes onboarding
    if (user.transactionPIN && user.profilePicture) {
      user.isOnboardingComplete = true;
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utility bill uploaded successfully',
      data: {
        utilityBill: user.utilityBill,
        isOnboardingComplete: user.isOnboardingComplete
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload utility bill',
      error: error.message
    });
  }
};