import { Twilio } from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '../config/env';

const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendNotification = async (to: string, message: string) => {
    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: to,
        });
        return {
            status: 'success',
            message: 'Notification sent successfully',
            data: response,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Failed to send notification',
            error: error.message,
        };
    }
};