import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import * as ResponseHandler from '../middleware/responseHandler';

interface AuthenticatedRequest extends Request {
    user?: any;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return ResponseHandler.sendError(res, 401, 'Access token is missing');

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return ResponseHandler.sendError(res, 403, 'Invalid access token');
        req.user = user;
        next();
    });
};

const checkUserExists = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            return ResponseHandler.sendError(res, 400, 'Phone number is required');
        }
        
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return ResponseHandler.sendError(res, 404, 'User not found');
        }
        
        next();
    } catch (error) {
        return ResponseHandler.sendError(res, 500, 'Server error');
    }
};

export { authenticateToken, checkUserExists };