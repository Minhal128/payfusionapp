export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    transactionPin?: string;
    profilePictureUrl?: string;
    utilityBillUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegistrationResponse {
    status: string;
    message: string;
    data?: User;
}

export interface UserLoginResponse {
    status: string;
    message: string;
    data?: {
        user: User;
        token: string;
    };
}

export interface UpdateUserProfileResponse {
    status: string;
    message: string;
    data?: User;
}