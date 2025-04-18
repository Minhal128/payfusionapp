import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env as config } from '../config/env';
import { sendOtp } from '../services/twilioService';
import User from '../models/userModel';
import OTP, { IOTP } from '../models/otpModel';
import Device from '../models/deviceModel';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, phoneNumber, dob, gender, receiveMessages } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
      return;
    }
    
    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      dob,
      gender,
      receiveMessages: Boolean(receiveMessages)
    });
    
    await newUser.save();
    
    // Generate and send OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save OTP to database
    const otp = new OTP({
      userId: newUser._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000) // 1 minute expiry
    });
    
    await otp.save();
    
    // Send OTP via Twilio
    await sendOtp(phoneNumber, `Your PayFusion verification code is: ${otpCode}`);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      data: {
        userId: newUser._id,
        phoneNumber: newUser.phoneNumber
      }
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Verify OTP and complete registration
 */
export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phoneNumber, otp } = req.body;
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      phoneNumber, 
      otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }
    
    // Find and update user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    user.isPhoneVerified = true;
    await user.save();
    
    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      config.JWT_SECRET!,
      { expiresIn: '30d' }
    );
    
    // Register device
    const deviceInfo = req.headers['user-agent'] || '';
    const device = new Device({
      userId: user._id,
      deviceInfo,
      isVerified: true,
      lastLogin: new Date()
    });
    
    await device.save();
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isPhoneVerified: user.isPhoneVerified,
          isOnboardingComplete: user.isOnboardingComplete
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    
    // Find the user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Delete any existing OTPs
    await OTP.deleteMany({ userId: user._id });
    
    // Generate and send new OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save OTP to database
    const otp = new OTP({
      userId: user._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000) // 1 minute expiry
    });
    
    await otp.save();
    
    // Send OTP via Twilio
    await sendOtp(phoneNumber, `Your PayFusion verification code is: ${otpCode}`);
    
    res.json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    
    // Find the user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Generate and send OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save OTP to database
    const otp = new OTP({
      userId: user._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000) // 1 minute expiry
    });
    
    await otp.save();
    
    // Send OTP via Twilio
    await sendOtp(phoneNumber, `Your PayFusion login code is: ${otpCode}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        userId: user._id,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    next(error);
  }
};