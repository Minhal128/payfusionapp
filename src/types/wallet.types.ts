export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transaction {
    id: string;
    walletId: string;
    amount: number;
    transactionType: 'credit' | 'debit';
    description?: string;
    createdAt: Date;
}

export interface VirtualCard {
    id: string;
    walletId: string;
    cardNumber: string;
    expirationDate: Date;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
}