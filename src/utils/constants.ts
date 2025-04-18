export const RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
};

export const RESPONSE_MESSAGES = {
    USER_REGISTERED: 'User registered successfully.',
    OTP_SENT: 'OTP has been sent to your phone.',
    OTP_VERIFIED: 'OTP verified successfully.',
    DEVICE_CHANGE_REQUEST: 'It seems you are logging in from a new device.',
    PAYMENT_SUCCESSFUL: 'Payment Successful',
    REGISTRATION_COMPLETE: 'Your registration is complete.',
    TRANSACTION_PIN_CREATED: 'You have successfully created your transaction PIN.',
};

export const OTP_VALIDITY = 1 * 60 * 1000; // 1 minute in milliseconds

export const GENDER_OPTIONS = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
};

export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
};