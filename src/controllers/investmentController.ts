import { Request, Response } from 'express';
import InvestmentService from '../services/investmentService';
import { ResponseTypes } from '../types/response.types';

class InvestmentController {
    async getInvestments(req: Request, res: Response): Promise<Response> {
        try {
            const investments = await InvestmentService.getAllInvestments();
            return res.status(200).json({
                status: 'success',
                message: 'Investments retrieved successfully',
                data: investments,
            } as ResponseTypes);
        } catch (error: unknown) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve investments',
                error: error instanceof Error ? error.message : String(error),
            } as ResponseTypes);
        }
    }

    async createInvestment(req: Request, res: Response): Promise<Response> {
        const { amount, fundId } = req.body;

        if (!amount || !fundId) {
            return res.status(400).json({
                status: 'error',
                message: 'Amount and Fund ID are required',
            } as ResponseTypes);
        }

        try {
            const newInvestment = await InvestmentService.createInvestment(amount, fundId);
            return res.status(201).json({
                status: 'success',
                message: 'Investment created successfully',
                data: newInvestment,
            } as ResponseTypes);
        } catch (error: unknown) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create investment',
                error: error instanceof Error ? error.message : String(error),
            } as ResponseTypes);
        }
    }

    async getInvestmentById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const investment = await InvestmentService.getInvestmentById(id);
            if (!investment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Investment not found',
                } as ResponseTypes);
            }
            return res.status(200).json({
                status: 'success',
                message: 'Investment retrieved successfully',
                data: investment,
            } as ResponseTypes);
        } catch (error: unknown) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve investment',
                error: error instanceof Error ? error.message : String(error),
            } as ResponseTypes);
        }
    }
}

export default new InvestmentController();