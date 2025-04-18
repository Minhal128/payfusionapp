import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import KYC from '../models/kycModel';
import User from '../models/userModel';

class KycController {
  async createKYC(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      // Check if KYC already exists for this user
      const existingKYC = await KYC.findOne({ userId });
      if (existingKYC) {
        return res.status(400).json({
          status: 'error',
          message: 'KYC information already exists. Use update endpoint instead.'
        });
      }
      
      const { identityType, identityNumber, address, dateOfBirth, occupation } = req.body;
      
      // Create new KYC entry
      const newKYC = new KYC({
        userId,
        identityType,
        identityNumber,
        address,
        dateOfBirth,
        occupation,
        status: 'pending',
        submittedAt: new Date()
      });
      
      await newKYC.save();
      
      // Update user status
      await User.findByIdAndUpdate(userId, { kycStatus: 'pending' });
      
      return res.status(201).json({
        status: 'success',
        message: 'KYC information submitted successfully',
        data: newKYC
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to submit KYC information',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  async getKYC(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const kycInfo = await KYC.findOne({ userId });
      
      if (!kycInfo) {
        return res.status(404).json({
          status: 'error',
          message: 'No KYC information found for this user'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'KYC information retrieved successfully',
        data: kycInfo
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve KYC information',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  async updateKYC(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const kycInfo = await KYC.findOne({ userId }).lean();
      
      if (!kycInfo) {
        return res.status(404).json({
          status: 'error',
          message: 'No KYC information found for this user'
        });
      }
      
      // Only allow updates if KYC is rejected
      if (kycInfo.status !== 'rejected') {
        return res.status(400).json({
          status: 'error',
          message: 'KYC information can only be updated if it was rejected'
        });
      }
      
      const { identityType, identityNumber, address, dateOfBirth, occupation } = req.body;
      
      // Update KYC information using findOneAndUpdate instead of direct property assignment
      const updatedKYC = await KYC.findOneAndUpdate(
        { userId },
        {
          $set: {
            identityType: identityType || kycInfo.identityType,
            identityNumber: identityNumber || kycInfo.identityNumber,
            address: address || kycInfo.address,
            dateOfBirth: dateOfBirth || kycInfo.dateOfBirth,
            occupation: occupation || kycInfo.occupation,
            status: 'pending',
            updatedAt: new Date()
          }
        },
        { new: true }
      );
      
      // Update user status
      await User.findByIdAndUpdate(userId, { kycStatus: 'pending' });
      
      return res.status(200).json({
        status: 'success',
        message: 'KYC information updated successfully',
        data: kycInfo
      });
    } catch (error: unknown) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update KYC information',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

export default new KycController();