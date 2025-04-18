export interface FundAccount {
    id: string;
    userId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface FundTransaction {
    id: string;
    fundAccountId: string;
    amount: number;
    transactionType: 'credit' | 'debit';
    createdAt: Date;
    updatedAt: Date;
}

export interface FundTransfer {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    transactionPin: string;
    createdAt: Date;
    updatedAt: Date;
}