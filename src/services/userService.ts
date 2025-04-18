import { UserModel } from '../models/userModel';
import { ResponseHandler } from '../middleware/responseHandler';
import { OTPService } from './otpService';
import { TwilioService } from './twilioService';
import { StorageService } from './storageService';
import { User } from '../types/user.types';

class UserService {
    private otpService: OTPService;
    private twilioService: TwilioService;
    private storageService: StorageService;

    constructor() {
        this.otpService = new OTPService();
        this.twilioService = new TwilioService();
        this.storageService = new StorageService();
    }

    async registerUser(userData: User) {
        const { phoneNumber, firstName, lastName, email, dob, gender, receiveMessages } = userData;

        const existingUser = await UserModel.findOne({ phoneNumber });
        if (existingUser) {
            return ResponseHandler.error('User already exists', 400);
        }

        const otp = this.otpService.generateOTP();
        await this.twilioService.sendOTP(phoneNumber, otp);

        const newUser = new UserModel({
            phoneNumber,
            firstName,
            lastName,
            email,
            dob,
            gender,
            receiveMessages,
            otp,
            otpExpiry: Date.now() + 60000 // OTP valid for 1 minute
        });

        await newUser.save();
        return ResponseHandler.success('OTP sent successfully', { phoneNumber });
    }

    async verifyOTP(phoneNumber: string, otp: string) {
        const user = await UserModel.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return ResponseHandler.error('Invalid or expired OTP', 400);
        }

        user.otp = null; // Clear OTP after verification
        user.otpExpiry = null;
        await user.save();

        return ResponseHandler.success('OTP verified successfully', { phoneNumber });
    }

    async createTransactionPIN(phoneNumber: string, pin: string) {
        const user = await UserModel.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        user.transactionPIN = pin;
        await user.save();

        return ResponseHandler.success('Transaction PIN created successfully');
    }

    async uploadProfilePicture(phoneNumber: string, file: Express.Multer.File) {
        const user = await UserModel.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        const filePath = await this.storageService.uploadFile(file);
        user.profilePicture = filePath;
        await user.save();

        return ResponseHandler.success('Profile picture uploaded successfully', { filePath });
    }

    async uploadUtilityBill(phoneNumber: string, file: Express.Multer.File) {
        const user = await UserModel.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        const filePath = await this.storageService.uploadFile(file);
        user.utilityBill = filePath;
        await user.save();

        return ResponseHandler.success('Utility bill uploaded successfully', { filePath });
    }
}

export const userService = new UserService();