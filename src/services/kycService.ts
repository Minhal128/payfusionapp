import { KYCModel } from '../models/kycModel';
import { Response } from 'express';
import { KYCData } from '../types/kyc.types';

export const createKYC = async (kycData: KYCData, res: Response) => {
    try {
        const newKYC = new KYCModel(kycData);
        await newKYC.save();
        return res.status(201).json({
            status: 'success',
            message: 'Your registration is complete.',
            data: newKYC,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your request.',
            error: error.message,
        });
    }
};

export const getKYC = async (userId: string, res: Response) => {
    try {
        const kycData = await KYCModel.findOne({ userId });
        if (!kycData) {
            return res.status(404).json({
                status: 'error',
                message: 'KYC data not found.',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: kycData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while retrieving KYC data.',
            error: error.message,
        });
    }
};