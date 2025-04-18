import twilio from 'twilio';
import { env } from '../config/env';

// Initialize Twilio client
const client = twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS using Twilio
 * @param phoneNumber - Recipient's phone number in E.164 format
 * @param message - SMS message content
 */
export const sendOtp = async (phoneNumber: string, message: string): Promise<void> => {
  try {
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