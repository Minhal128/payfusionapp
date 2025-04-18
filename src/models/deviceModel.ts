import { Schema, model } from 'mongoose';

const deviceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    deviceType: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet','android','ios'],
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Device = model('Device', deviceSchema);

export default Device;