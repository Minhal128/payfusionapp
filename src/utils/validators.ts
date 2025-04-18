import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('dob').isDate().withMessage('Date of birth is required and must be a valid date.'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other.'),
    body('sendMessages').isBoolean().withMessage('Send messages must be a boolean value.'),
];

export const validateLogin = [
    body('phoneNumber').notEmpty().withMessage('Phone number is required.'),
];

export const validateTransactionPIN = [
    body('transactionPIN').notEmpty().withMessage('Transaction PIN is required.'),
];

export const validateKYC = [
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('dob').isDate().withMessage('Date of birth is required and must be a valid date.'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other.'),
    body('backgroundInfo').notEmpty().withMessage('Background information is required.'),
    body('country').notEmpty().withMessage('Country is required.'),
];

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    next();
};