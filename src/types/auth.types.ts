export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  receiveMessages: boolean;
}

export interface UserLogin {
  phoneNumber: string;
  otp: string;
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
}

export interface CreatePIN {
  pin: string;
}

export interface TransactionPIN {
  transactionPin: string;
}

export interface DeviceVerification {
  accountNumber: string;
  transactionPin: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  balance: number;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: UserResponse;
}

export interface OTPResponse {
  status: string;
  message: string;
  otpSent: boolean;
}