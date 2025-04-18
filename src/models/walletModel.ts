import { Schema, model } from 'mongoose';

const walletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

walletSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Wallet = model('Wallet', walletSchema);

export default Wallet;