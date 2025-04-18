export interface Device {
    id: string;
    userId: string;
    deviceId: string;
    deviceType: string;
    deviceName: string;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeviceChangeRequest {
    userId: string;
    oldDeviceId: string;
    newDeviceId: string;
    requestDate: Date;
    status: 'pending' | 'approved' | 'denied';
}