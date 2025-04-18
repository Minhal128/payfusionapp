export interface Investment {
    id: string;
    userId: string;
    fundId: string;
    amount: number;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
}

export interface Fund {
    id: string;
    name: string;
    description: string;
    minimumInvestment: number;
    expectedReturn: number;
    riskLevel: 'low' | 'medium' | 'high';
}

export interface InvestmentResponse {
    success: boolean;
    message: string;
    data?: Investment | Investment[];
}