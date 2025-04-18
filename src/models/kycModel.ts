import mongoose, { Schema, Document } from 'mongoose';

export interface IKYC extends Document {
  userId: mongoose.Types.ObjectId;
  identityType: 'passport' | 'national_id' | 'drivers_license';
  identityNumber: string;
  address: string;
  dateOfBirth: Date;
  occupation: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

const kycSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  identityType: {
    type: String,
    enum: ['passport', 'national_id', 'drivers_license'],
    required: true,
  },
  identityNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  rejectionReason: {
    type: String,
  }
});

export default mongoose.model<IKYC>('KYC', kycSchema);