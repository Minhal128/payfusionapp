import { Fund } from '../models/fundModel'; 
import User from '../models/userModel';

interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  statusCode: number;
}

class FundService {
    async fundAccount(userId: string, amount: number): Promise<ServiceResponse> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return { 
                    success: false, 
                    message: 'User not found', 
                    statusCode: 404 
                };
            }

            // Get the current balance using Mongoose's get method
            let currentBalance = user.get('balance') || 0;
            
            // Update the balance using Mongoose's set method
            user.set('balance', currentBalance + amount);
            await user.save();

            return { 
                success: true, 
                message: 'Account funded successfully',
                data: { balance: user.get('balance') }, 
                statusCode: 200 
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'Error funding account', 
                statusCode: 500 
            };
        }
    }

    async createVirtualCard(userId: string): Promise<ServiceResponse> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return { 
                    success: false, 
                    message: 'User not found', 
                    statusCode: 404 
                };
            }

            const newCard = new Fund({
                userId: user._id,
                cardNumber: this.generateCardNumber(),
                expiryDate: this.generateExpiryDate(),
            });

            await newCard.save();

            return { 
                success: true, 
                message: 'Virtual card created successfully',
                data: newCard, 
                statusCode: 201 
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'Error creating virtual card', 
                statusCode: 500 
            };
        }
    }

    private generateCardNumber(): string {
        // Logic to generate a random card number
        return '1234-5678-9012-3456';
    }

    private generateExpiryDate(): string {
        // Logic to generate an expiry date
        const date = new Date();
        date.setFullYear(date.getFullYear() + 3);
        return date.toISOString().split('T')[0];
    }
}

export default new FundService();