import { Wallet } from '../models/walletModel';
import { User } from '../models/userModel';
import { Transaction } from '../models/transactionModel';
import { ResponseHandler } from '../middleware/responseHandler';
import { WalletTypes } from '../types/wallet.types';

class WalletService {
    async createWallet(userId: string): Promise<WalletTypes> {
        const wallet = new Wallet({ userId });
        await wallet.save();
        return wallet;
    }

    async getWallet(userId: string): Promise<WalletTypes | null> {
        return await Wallet.findOne({ userId });
    }

    async sendMoney(senderId: string, receiverId: string, amount: number): Promise<string> {
        const senderWallet = await this.getWallet(senderId);
        const receiverWallet = await this.getWallet(receiverId);

        if (!senderWallet || !receiverWallet) {
            throw new Error('Wallet not found');
        }

        if (senderWallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save();
        await receiverWallet.save();

        const transaction = new Transaction({
            senderId,
            receiverId,
            amount,
            type: 'send',
        });
        await transaction.save();

        return 'Payment Successful';
    }

    async receiveMoney(receiverId: string, amount: number): Promise<string> {
        const receiverWallet = await this.getWallet(receiverId);

        if (!receiverWallet) {
            throw new Error('Wallet not found');
        }

        receiverWallet.balance += amount;
        await receiverWallet.save();

        const transaction = new Transaction({
            receiverId,
            amount,
            type: 'receive',
        });
        await transaction.save();

        return 'Money Received Successfully';
    }

    async createVirtualCard(userId: string): Promise<string> {
        // Logic to create a virtual card
        return 'Virtual Card Created Successfully';
    }
}

export const walletService = new WalletService();