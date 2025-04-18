import Investment from '../models/investmentModel';
import { Types } from 'mongoose';

class InvestmentService {
  async getAllInvestments(): Promise<any[]> {
    return Investment.find({});
  }

  async createInvestment(userId: string, amount: number, fundId: string, investmentType: string, expectedReturn: number): Promise<any> {
    const investment = new Investment({
      userId,
      amount,
      fundId,
      investmentType,
      expectedReturn,
      startDate: new Date(),
      status: 'active'
    });
    
    return investment.save();
  }

  async getInvestmentById(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid investment ID');
    }
    
    return Investment.findById(id);
  }
}

export default new InvestmentService();