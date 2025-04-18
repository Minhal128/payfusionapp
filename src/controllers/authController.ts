import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env as config } from '../config/env';
import { sendOtp } from '../services/twilioService';
import User from '../models/userModel';
import OTP, { IOTP } from '../models/otpModel';
import Device from '../models/deviceModel';

/**
 * Helper function to determine device type from user agent string
 */
function determineDeviceType(userAgent: string): string {
  console.log('Determining device type from user agent:', userAgent);
  const ua = userAgent.toLowerCase();
  if (ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Generate a random OTP code
 */
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Register request received:', req.body);
  try {
    const { firstName, lastName, email, phoneNumber, dateOfBirth, gender, receiveMessages, transactionPIN } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !dateOfBirth) {
      console.error('Registration failed: Missing required fields');
      res.status(400).json({
        success: false,
        message: 'Missing required fields. firstName, lastName, email, phoneNumber, and dateOfBirth are required.'
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Registration failed: Invalid email format');
      res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
      return;
    }
    
    // Check if user already exists by phone number
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      console.error('Registration failed: Phone number already exists');
      res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
      return;
    }
    
    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.error('Registration failed: Email already exists');
      res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }
    
    console.log('Creating new user:', { firstName, lastName, email, phoneNumber });
    
    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      transactionPIN: transactionPIN || "0000", 
      messagesConsent: Boolean(receiveMessages)
    });
    
    await newUser.save();
    console.log('User created successfully with ID:', newUser._id);
    
    // Generate and send OTP
    const otpCode = generateOTP();
    console.log('Generated OTP:', otpCode);
    
    // Save OTP to database with longer expiration
    const otp = new OTP({
      userId: newUser._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });
    
    await otp.save();
    console.log('OTP saved to database, expires at:', otp.expiresAt);
    
    // Send OTP via Twilio
    try {
      await sendOtp(phoneNumber, `Your PayFusion verification code is: ${otpCode}`);
      console.log('OTP sent successfully to:', phoneNumber);
    } catch (otpError: any) {
      console.error('Failed to send OTP:', otpError.message);
      // Continue with registration even if OTP sending fails
    }
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      data: {
        userId: newUser._id,
        phoneNumber: newUser.phoneNumber
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Improve error handling
    if (error.code === 11000) {
      // Handle duplicate key errors more gracefully
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    } else {
      next(error);
    }
  }
};

/**
 * Verify OTP and complete registration
 */
export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('OTP verification request received:', req.body);
  try {
    const { phoneNumber, otp } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !otp) {
      console.error('OTP verification failed: Missing required fields');
      res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
      return;
    }
    
    console.log('Looking for OTP record with phoneNumber:', phoneNumber, 'and OTP:', otp);
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      phoneNumber, 
      otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      console.error('OTP verification failed: Invalid or expired OTP');
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }
    
    console.log('OTP record found:', otpRecord);
    
    // Find and update user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      console.error('OTP verification failed: User not found');
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    console.log('User found:', user._id);
    
    user.isPhoneVerified = true;
    await user.save();
    console.log('User updated: isPhoneVerified set to true');
    
    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });
    console.log('OTP record deleted');
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      config.JWT_SECRET!,
      { expiresIn: '30d' }
    );
    console.log('JWT token created, expires in 30 days');
    
    // Register device with required fields
    const userAgent = req.headers['user-agent'] || '';
    console.log('User agent:', userAgent);
    
    const deviceType = determineDeviceType(userAgent);
    console.log('Determined device type:', deviceType);
    
    const deviceId = `${user._id}-${Date.now()}`;
    console.log('Generated device ID:', deviceId);
    
    const device = new Device({
      userId: user._id,
      deviceId, // Generate a unique device ID
      deviceType,
      deviceInfo: userAgent,
      isVerified: true,
      lastLogin: new Date()
    });
    
    try {
      await device.save();
      console.log('Device registered successfully:', deviceId);
    } catch (deviceError: any) {
      // Log device registration error but continue
      console.error('Failed to register device:', deviceError.message);
    }
    
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
  } catch (error: any) {
    console.error('OTP verification error:', error);
    next(error);
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Resend OTP request received:', req.body);
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      console.error('Resend OTP failed: Missing phone number');
      res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
      return;
    }
    
    // Find the user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.error('Resend OTP failed: User not found');
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    console.log('User found:', user._id);
    
    // Delete any existing OTPs
    const deleteResult = await OTP.deleteMany({ userId: user._id });
    console.log('Deleted existing OTPs:', deleteResult.deletedCount);
    
    // Generate and send new OTP
    const otpCode = generateOTP();
    console.log('Generated new OTP:', otpCode);
    
    // Save OTP to database with longer expiration
    const otp = new OTP({
      userId: user._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });
    
    await otp.save();
    console.log('New OTP saved to database, expires at:', otp.expiresAt);
    
    // Send OTP via Twilio
    try {
      await sendOtp(phoneNumber, `Your PayFusion verification code is: ${otpCode}`);
      console.log('OTP sent successfully to:', phoneNumber);
    } catch (otpError: any) {
      console.error('Failed to send OTP:', otpError.message);
      // Continue even if OTP sending fails
    }
    
    res.json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Login request received:', req.body);
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      console.error('Login failed: Missing phone number');
      res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
      return;
    }
    
    // Find the user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.error('Login failed: User not found');
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    console.log('User found:', user._id);
    
    // Delete any existing OTPs
    const deleteResult = await OTP.deleteMany({ userId: user._id });
    console.log('Deleted existing OTPs:', deleteResult.deletedCount);
    
    // Generate and send OTP
    const otpCode = generateOTP();
    console.log('Generated login OTP:', otpCode);
    
    // Save OTP to database with longer expiration
    const otp = new OTP({
      userId: user._id,
      phoneNumber,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });
    
    await otp.save();
    console.log('Login OTP saved to database, expires at:', otp.expiresAt);
    
    // Send OTP via Twilio
    try {
      await sendOtp(phoneNumber, `Your PayFusion login code is: ${otpCode}`);
      console.log('Login OTP sent successfully to:', phoneNumber);
    } catch (otpError: any) {
      console.error('Failed to send login OTP:', otpError.message);
      // Continue even if OTP sending fails
    }
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        userId: user._id,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    next(error);
  }
};