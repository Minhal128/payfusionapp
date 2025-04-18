import { Twilio } from 'twilio';
import { config } from '../config/env';

const twilioClient = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTP = async (phoneNumber: string, otp: string) => {
    try {
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}. It is valid for 1 minute.`,
            from: config.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        return { success: true, message: 'OTP sent successfully.' };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'Failed to send OTP.' };
    }
};

const validateOTP = (inputOTP: string, generatedOTP: string, timestamp: number) => {
    const currentTime = Date.now();
    const isExpired = currentTime - timestamp > 60000; // 1 minute in milliseconds
    if (isExpired) {
        return { success: false, message: 'OTP has expired.' };
    }
    if (inputOTP === generatedOTP) {
        return { success: true, message: 'OTP is valid.' };
    }
    return { success: false, message: 'Invalid OTP.' };
};

export { generateOTP, sendOTP, validateOTP };