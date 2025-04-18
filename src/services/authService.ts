import { User } from '../models/userModel';
import { OtpService } from './otpService';
import { TwilioService } from './twilioService';
import { ResponseHandler } from '../middleware/responseHandler';
import { generateTransactionPin } from '../utils/helpers';

class AuthService {
    private otpService: OtpService;
    private twilioService: TwilioService;

    constructor() {
        this.otpService = new OtpService();
        this.twilioService = new TwilioService();
    }

    async registerUser(userData: any) {
        const { phoneNumber, firstName, lastName, email, dob, gender, receiveMessages } = userData;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return ResponseHandler.error('User already exists', 400);
        }

        const otp = this.otpService.generateOtp();
        await this.twilioService.sendOtp(phoneNumber, otp);

        const newUser = new User({
            phoneNumber,
            firstName,
            lastName,
            email,
            dob,
            gender,
            receiveMessages,
            otp,
            otpExpiry: Date.now() + 60000 // 1 minute expiry
        });

        await newUser.save();
        return ResponseHandler.success('OTP sent successfully', { phoneNumber });
    }

    async verifyOtp(phoneNumber: string, otp: string) {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return ResponseHandler.error('Invalid or expired OTP', 400);
        }

        user.otp = null; // Clear OTP after verification
        user.otpExpiry = null; // Clear OTP expiry
        user.transactionPin = generateTransactionPin(); // Generate transaction PIN
        await user.save();

        return ResponseHandler.success('OTP verified successfully', { transactionPin: user.transactionPin });
    }

    async loginUser(phoneNumber: string) {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        const otp = this.otpService.generateOtp();
        await this.twilioService.sendOtp(phoneNumber, otp);

        user.otp = otp;
        user.otpExpiry = Date.now() + 60000; // 1 minute expiry
        await user.save();

        return ResponseHandler.success('OTP sent for login', { phoneNumber });
    }

    async changeDeviceVerification(phoneNumber: string, accountNumber: string, transactionPin: string, otp: string) {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        if (user.transactionPin !== transactionPin) {
            return ResponseHandler.error('Invalid transaction PIN', 400);
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return ResponseHandler.error('Invalid or expired OTP', 400);
        }

        user.deviceVerified = true; // Mark device as verified
        await user.save();

        return ResponseHandler.success('Device change request approved', {});
    }
}

export const authService = new AuthService();