import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  recipientId?: mongoose.Types.ObjectId;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  description?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
}

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['transfer', 'deposit', 'withdrawal', 'payment'],
    required: true,
  },
  description: {
    type: String,
  },
  reference: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);