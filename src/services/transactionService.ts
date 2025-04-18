import { TransactionModel } from '../models/transactionModel';
import { UserModel } from '../models/userModel';
import { WalletModel } from '../models/walletModel';
import { ResponseHandler } from '../middleware/responseHandler';
import { TransactionTypes } from '../types/transaction.types';

class TransactionService {
    async sendMoney(senderId: string, receiverId: string, amount: number, transactionPin: string): Promise<TransactionTypes> {
        const sender = await UserModel.findById(senderId);
        const receiver = await UserModel.findById(receiverId);
        
        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        const senderWallet = await WalletModel.findOne({ userId: senderId });
        if (senderWallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Validate transaction PIN (this should be implemented)
        const isPinValid = await this.validateTransactionPin(senderId, transactionPin);
        if (!isPinValid) {
            throw new Error('Invalid transaction PIN');
        }

        // Create transaction record
        const transaction = new TransactionModel({
            sender: senderId,
            receiver: receiverId,
            amount,
            type: 'send',
            date: new Date(),
        });

        await transaction.save();

        // Update sender's wallet balance
        senderWallet.balance -= amount;
        await senderWallet.save();

        // Optionally, update receiver's wallet balance
        const receiverWallet = await WalletModel.findOne({ userId: receiverId });
        receiverWallet.balance += amount;
        await receiverWallet.save();

        return ResponseHandler.success('Payment Successful', transaction);
    }

    async receiveMoney(receiverId: string, amount: number): Promise<TransactionTypes> {
        const receiver = await UserModel.findById(receiverId);
        if (!receiver) {
            throw new Error('User not found');
        }

        // Create transaction record
        const transaction = new TransactionModel({
            receiver: receiverId,
            amount,
            type: 'receive',
            date: new Date(),
        });

        await transaction.save();

        // Update receiver's wallet balance
        const receiverWallet = await WalletModel.findOne({ userId: receiverId });
        receiverWallet.balance += amount;
        await receiverWallet.save();

        return ResponseHandler.success('Money received successfully', transaction);
    }

    private async validateTransactionPin(userId: string, pin: string): Promise<boolean> {
        const user = await UserModel.findById(userId);
        return user.transactionPin === pin; // Assuming transactionPin is stored in user model
    }
}

export const transactionService = new TransactionService();