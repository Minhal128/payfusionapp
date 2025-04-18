import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import User from '../models/userModel';
import OTP from '../models/otpModel';
import { sendOtp } from '../services/twilioService';

class UserController {
  // User Registration (different from auth registration if needed)
  async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, email, phoneNumber, dob, gender, receiveMessages } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }
      
      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth: new Date(dob),
        gender,
        messagesConsent: Boolean(receiveMessages),
        transactionPIN: '' // Will be set later
      });
      
      await newUser.save();
      
      // Generate and send OTP
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Save OTP to database
      const otp = new OTP({
        userId: newUser._id,
        phoneNumber,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      });
      
      await otp.save();
      
      // Send OTP via Twilio
      await sendOtp(phoneNumber, `Your verification code is: ${otpCode}`);
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify OTP.',
        data: {
          userId: newUser._id,
          phoneNumber: newUser.phoneNumber
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Verify OTP for registration
  async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { phoneNumber, otp } = req.body;
      
      // Find OTP record
      const otpRecord = await OTP.findOne({ 
        phoneNumber, 
        otp,
        expiresAt: { $gt: new Date() }
      });
      
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }
      
      // Mark user as verified
      const user = await User.findById(otpRecord.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      user.isPhoneVerified = true;
      await user.save();
      
      // Delete the used OTP
      await OTP.deleteOne({ _id: otpRecord._id });
      
      return res.status(200).json({
        success: true,
        message: 'Phone verified successfully',
        data: {
          userId: user._id,
          isVerified: true
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'OTP verification failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Login functionality
  async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { phoneNumber } = req.body;
      
      // Find user
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Generate and send new OTP
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Delete any existing OTPs
      await OTP.deleteMany({ userId: user._id });
      
      // Save new OTP
      const otp = new OTP({
        userId: user._id,
        phoneNumber,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      });
      
      await otp.save();
      
      // Send OTP via Twilio
      await sendOtp(phoneNumber, `Your login code is: ${otpCode}`);
      
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          userId: user._id,
          phoneNumber
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Create/Update transaction PIN
  async createTransactionPIN(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { transactionPIN } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // In a real app, you'd hash the PIN before saving
      user.transactionPIN = transactionPIN;
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Transaction PIN set successfully'
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Failed to set transaction PIN',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Update user profile
  async updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      
      const { firstName, lastName, email } = req.body;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update fields if provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  // Get user profile
  async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      
      const user = await User.findById(userId).select('-transactionPIN');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

const userController = new UserController();
export const { registerUser, verifyOTP, loginUser, createTransactionPIN, updateUserProfile, getUserProfile } = userController;