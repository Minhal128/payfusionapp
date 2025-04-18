import { Request, Response } from 'express';

export const formatResponse = (res: Response, statusCode: number, message: string, data?: any) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data: data || null,
    });
};

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex based on phone number format
    return phoneRegex.test(phone);
};

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

export const isOTPExpired = (timestamp: number, expiryTime: number = 60 * 1000): boolean => {
    return Date.now() - timestamp > expiryTime;
};