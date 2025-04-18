import twilio from 'twilio';
import { env } from '../config/env';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize Twilio client only if not in development mode
const client = !isDevelopment ? twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
) : null;

/**
 * Send OTP via SMS using Twilio or console log in development
 */
export const sendOtp = async (phoneNumber: string, message: string): Promise<void> => {
  try {
    // In development mode, just log the OTP
    if (isDevelopment || !client) {
      console.log(`[DEV MODE] Would send to ${phoneNumber}: ${message}`);
      return;
    }

    // Real Twilio implementation for production
    await client.messages.create({
      body: message,
      from: env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log(`OTP sent to ${phoneNumber}`);
  } catch (error: unknown) {
    console.error('Error sending OTP:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    } else {
      throw new Error('Failed to send OTP');
    }
  }
};