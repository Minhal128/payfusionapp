import { Response } from 'express';

/**
 * Send an error response
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param message Error message
 * @param errors Optional array of detailed errors
 */
export const sendError = (res: Response, statusCode: number, message: string, errors: any[] = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date()
  });
};

/**
 * Send a success response
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param data Response data
 * @param message Optional success message
 */
export const sendSuccess = (res: Response, statusCode: number = 200, data: any = null, message: string = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date()
  });
};

/**
 * Express response handler middleware
 */
export const responseHandler = (req: any, res: any, next: any) => {
  // Attach success and error methods to the response object
  res.success = (message: string, data: any = null, statusCode: number = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date()
    });
  };
  
  res.error = (message: string, errors: any[] = [], statusCode: number = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date()
    });
  };
  
  next();
};