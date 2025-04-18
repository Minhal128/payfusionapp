import mongoose, { Document, Schema } from 'mongoose';

interface IFund extends Document {
  userId: mongoose.Types.ObjectId;
  cardNumber: string;
  expiryDate: string;
}

const fundSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
});

export const Fund = mongoose.model<IFund>('Fund', fundSchema);