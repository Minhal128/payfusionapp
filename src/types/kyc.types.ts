export interface KYCForm {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // ISO format date string
    gender: 'male' | 'female' | 'other';
}

export interface KYCBackgroundInfo {
    backgroundInfo: string;
    country: string;
    passport: string; // URL or path to the uploaded passport
}

export interface KYCResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        kycId: string; // Unique identifier for the KYC submission
    };
}