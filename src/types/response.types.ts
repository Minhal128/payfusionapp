export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errorCode?: string;
}

export interface RegistrationResponse {
  userId: string;
  phoneNumber: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
}

export interface TransactionResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface KycResponse {
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface FundAccountResponse {
  balance: number;
  currency: string;
}

export interface InvestmentResponse {
  investmentId: string;
  amount: number;
  status: 'active' | 'completed' | 'failed';
}

export interface ResponseTypes {
  status: 'success' | 'error';
  message: string;
  data?: any;
  error?: string;
}