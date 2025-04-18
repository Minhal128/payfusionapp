import { DeviceModel } from '../models/deviceModel';
import { UserModel } from '../models/userModel';
import { ResponseHandler } from '../middleware/responseHandler';

export class DeviceService {
    async verifyDevice(userId: string, deviceId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return ResponseHandler.error('User not found', 404);
        }

        const device = await DeviceModel.findOne({ userId, deviceId });
        if (device) {
            return ResponseHandler.success('Device verified successfully', { device });
        } else {
            return ResponseHandler.error('Device not recognized', 401);
        }
    }

    async registerDevice(userId: string, deviceId: string) {
        const existingDevice = await DeviceModel.findOne({ userId, deviceId });
        if (existingDevice) {
            return ResponseHandler.error('Device already registered', 409);
        }

        const newDevice = new DeviceModel({ userId, deviceId });
        await newDevice.save();
        return ResponseHandler.success('Device registered successfully', { device: newDevice });
    }

    async removeDevice(userId: string, deviceId: string) {
        const result = await DeviceModel.deleteOne({ userId, deviceId });
        if (result.deletedCount === 0) {
            return ResponseHandler.error('Device not found', 404);
        }
        return ResponseHandler.success('Device removed successfully');
    }
}