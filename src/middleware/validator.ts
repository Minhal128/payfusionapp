import { Request, Response, NextFunction } from 'express';

/**
 * Validates user registration data
 */
// Add this to your existing validator.ts file

/**
 * Validates onboarding data
 */
// import { Request, Response, NextFunction } from 'express';

export const validateTransactionPIN = (req: Request, res: Response, next: NextFunction): void => {
  const { transactionPIN } = req.body;
  const errors = [];
  
  if (!transactionPIN) {
    errors.push('Transaction PIN is required');
  } else if (!/^\d{4}$/.test(transactionPIN)) {
    errors.push('Transaction PIN must be a 4-digit number');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};
export const validateTransaction = (req: Request, res: Response, next: NextFunction): void => {
  // Validate transaction data
  const { amount, recipientId } = req.body;
  
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    res.status(400).json({
      success: false,
      message: 'Valid amount is required'
    });
    return;
  }
  
  if (!recipientId) {
    res.status(400).json({
      success: false,
      message: 'Recipient ID is required'
    });
    return;
  }
  
  next();
};
export const validateOnboarding = (req: Request, res: Response, next: NextFunction): void => {
  const { transactionPin } = req.body;
  const errors = [];
  
  // Validate transaction PIN if it's being set
  if (req.path.includes('transaction-pin')) {
    if (!transactionPin) {
      errors.push('Transaction PIN is required');
    } else if (!/^\d{4}$/.test(transactionPin)) {
      errors.push('Transaction PIN must be a 4-digit number');
    }
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};
export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { firstName, lastName, email, phoneNumber, dob, gender } = req.body;
  const errors = [];
  
  // Validate first name
  if (!firstName) {
    errors.push('First name is required');
  }
  
  // Validate last name
  if (!lastName) {
    errors.push('Last name is required');
  }
  
  // Validate email
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }
  
  // Validate phone number
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    errors.push('Phone number must be in international format (e.g., +1234567890)');
  }
  
  // Validate date of birth
  if (!dob) {
    errors.push('Date of birth is required');
  } else {
    const dobDate = new Date(dob);
    const now = new Date();
    const ageInYears = (now.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (isNaN(dobDate.getTime())) {
      errors.push('Invalid date of birth format');
    } else if (ageInYears < 18) {
      errors.push('User must be at least 18 years old');
    }
  }
  
  // Validate gender
  if (!gender) {
    errors.push('Gender is required');
  } else if (!['Male', 'Female', 'Other'].includes(gender)) {
    errors.push('Gender must be Male, Female, or Other');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};

/**
 * Validates login data
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { phoneNumber } = req.body;
  const errors = [];
  
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    errors.push('Phone number must be in international format (e.g., +1234567890)');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};

/**
 * Validates OTP verification data
 */
export const validateOTP = (req: Request, res: Response, next: NextFunction): void => {
  const { phoneNumber, otp } = req.body;
  const errors = [];
  
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    errors.push('Phone number must be in international format (e.g., +1234567890)');
  }
  
  if (!otp) {
    errors.push('OTP is required');
  } else if (!/^\d{4}$/.test(otp)) {
    errors.push('OTP must be a 4-digit number');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};

// Keep your existing validateKYC and other validator functions
export const validateKYC = (req: Request, res: Response, next: NextFunction): void => {
  const { identityType, identityNumber, address, dateOfBirth, occupation } = req.body;
  const errors = [];
  
  // Validate identity type
  if (!identityType) {
    errors.push('Identity type is required');
  } else if (!['passport', 'national_id', 'drivers_license'].includes(identityType)) {
    errors.push('Invalid identity type');
  }
  
  // Validate identity number
  if (!identityNumber) {
    errors.push('Identity number is required');
  }
  
  // Validate address
  if (!address) {
    errors.push('Address is required');
  }
  
  // Validate date of birth
  if (!dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const ageInYears = (now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (isNaN(dob.getTime())) {
      errors.push('Invalid date of birth format');
    } else if (ageInYears < 18) {
      errors.push('User must be at least 18 years old');
    }
  }
  
  // Validate occupation
  if (!occupation) {
    errors.push('Occupation is required');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }
  
  next();
};