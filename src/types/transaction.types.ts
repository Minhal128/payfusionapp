export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    transactionType: 'send' | 'receive' | 'topup' | 'withdraw';
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    memo?: string;
}

export interface TransactionHistory {
    transactions: Transaction[];
    totalCount: number;
    totalAmount: number;
}