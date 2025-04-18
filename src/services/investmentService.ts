import Investment from '../models/investmentModel';
import { Types } from 'mongoose';

class InvestmentService {
  async getAllInvestments(): Promise<any[]> {
    return Investment.find({});
  }

  async createInvestment(amount: number, fundId: string): Promise<any> {
    const investment = new Investment({
      amount,
      fundId,
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