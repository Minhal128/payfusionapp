import { Request, Response } from 'express';
import User from '../models/userModel';
import Device from '../models/deviceModel';

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Verify a device for a user
 */
export const verifyDevice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { deviceId, deviceType } = req.body;
    const userId = req.user?.id; // From auth middleware
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    if (!deviceId || !deviceType) {
      res.status(400).json({
        success: false,
        message: 'Device ID and type are required'
      });
      return;
    }
    
    // Check if device already exists
    const existingDevice = await Device.findOne({ deviceId });
    
    if (existingDevice) {
      // Update last login time
      existingDevice.lastLogin = new Date();
      await existingDevice.save();
      
      res.json({
        success: true,
        message: 'Device verified successfully',
        data: existingDevice
      });
      return;
    }
    
    // Create new device
    const device = new Device({
      userId,
      deviceId,
      deviceType,
      isVerified: true,
      lastLogin: new Date()
    });
    
    await device.save();
    
    res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      data: device
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Device verification failed',
      error: error.message
    });
  }
};

/**
 * Request a change of device
 */
export const requestDeviceChange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { deviceId, deviceType, accountNumber, phoneNumber, transactionPin } = req.body;
    const userId = req.user?.id; // From auth middleware
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    // Allow either accountNumber OR phoneNumber
    if (!deviceId || !deviceType || (!accountNumber && !phoneNumber) || !transactionPin) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields. deviceId, deviceType, transactionPin, and either accountNumber or phoneNumber are required.'
      });
      return;
    }
    
    // Verify user identity using either accountNumber or phoneNumber
    let user;
    if (accountNumber) {
      user = await User.findOne({ _id: userId, accountNumber });
    } else if (phoneNumber) {
      user = await User.findOne({ _id: userId, phoneNumber });
    }
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found or invalid account/phone number'
      });
      return;
    }
    
    // Verify transaction PIN (in a real implementation, you'd hash and compare)
    if (user.transactionPIN !== transactionPin) {
      res.status(400).json({
        success: false,
        message: 'Invalid transaction PIN'
      });
      return;
    }
    
    // Register the new device
    const device = new Device({
      userId,
      deviceId,
      deviceType,
      isVerified: true,
      lastLogin: new Date()
    });
    
    await device.save();
    
    res.json({
      success: true,
      message: 'Your device change request has been successfully approved',
      data: device
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Device change request failed',
      error: error.message
    });
  }
};

/**
 * Get all devices for a user
 */
export const getUserDevices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    const devices = await Device.find({ userId });
    
    res.json({
      success: true,
      message: 'Devices retrieved successfully',
      data: {
        devices
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve devices',
      error: error.message
    });
  }
};