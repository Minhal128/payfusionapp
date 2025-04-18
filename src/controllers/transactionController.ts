import { Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import Transaction from '../models/transactionModel';
import User from '../models/userModel';

class TransactionController {
  async createTransaction(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const { amount, type, recipientId, description } = req.body;
      
      // Create transaction
      const transaction = new Transaction({
        userId,
        amount,
        type,
        recipientId,
        description,
        status: 'pending',
        date: new Date()
      });
      
      await transaction.save();
      
      return res.status(201).json({
        status: 'success',
        message: 'Transaction created successfully',
        data: transaction
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create transaction',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async getTransactionHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const transactions = await Transaction.find({ 
        $or: [{ userId }, { recipientId: userId }] 
      }).sort({ date: -1 });
      
      return res.status(200).json({
        status: 'success',
        message: 'Transaction history retrieved successfully',
        data: transactions
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve transaction history',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async sendMoney(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const { recipientPhone, amount, description } = req.body;
      
      // Find sender
      const sender = await User.findById(userId);
      if (!sender) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Check if sender has enough balance
      if (!sender.balance || sender.balance < amount) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient balance'
        });
      }
      
      // Find recipient
      const recipient = await User.findOne({ phoneNumber: recipientPhone });
      if (!recipient) {
        return res.status(404).json({
          status: 'error',
          message: 'Recipient not found'
        });
      }
      
      // Create transaction
      const transaction = new Transaction({
        userId,
        recipientId: recipient._id,
        amount,
        type: 'transfer',
        description,
        status: 'completed',
        date: new Date()
      });
      
      // Update balances
      sender.balance -= amount;
      recipient.balance = (recipient.balance || 0) + amount;
      
      // Save all changes in a transaction
      await sender.save();
      await recipient.save();
      await transaction.save();
      
      return res.status(200).json({
        status: 'success',
        message: 'Money sent successfully',
        data: {
          transaction,
          balance: sender.balance
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send money',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async receiveMoney(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      // This would typically integrate with an external payment gateway
      // For now, we'll just create a "received" transaction entry
      const { amount, source, reference } = req.body;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Create transaction
      const transaction = new Transaction({
        userId,
        amount,
        type: 'deposit',
        description: `Received from ${source}`,
        reference,
        status: 'completed',
        date: new Date()
      });
      
      // Update balance
      user.balance = (user.balance || 0) + amount;
      
      await user.save();
      await transaction.save();
      
      return res.status(200).json({
        status: 'success',
        message: 'Money received successfully',
        data: {
          transaction,
          balance: user.balance
        }
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to receive money',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

export default new TransactionController();