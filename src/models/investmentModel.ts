import { Schema, model } from 'mongoose';

const investmentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    investmentType: {
        type: String,
        required: true,
        enum: ['stocks', 'bonds', 'real estate', 'mutual funds', 'cryptocurrency']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    dateInvested: {
        type: Date,
        default: Date.now
    },
    expectedReturn: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'completed', 'cancelled']
    }
}, { timestamps: true });

const Investment = model('Investment', investmentSchema);

export default Investment;