import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { createTransaction, getTransactionHistory } from '../src/services/transactionService';

jest.mock('../src/services/transactionService');

describe('Transaction API', () => {
  describe('POST /transactions', () => {
    it('should create a transaction successfully', async () => {
      const mockTransaction = {
        id: '1',
        amount: 100,
        type: 'send',
        status: 'success',
      };

      createTransaction.mockResolvedValue(mockTransaction);

      const response = await request(app)
        .post('/transactions')
        .send({
          amount: 100,
          type: 'send',
          transactionPIN: '1234',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Transaction created successfully',
        data: mockTransaction,
      });
    });

    it('should return an error if transaction creation fails', async () => {
      createTransaction.mockRejectedValue(new Error('Transaction failed'));

      const response = await request(app)
        .post('/transactions')
        .send({
          amount: 100,
          type: 'send',
          transactionPIN: '1234',
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Transaction failed',
      });
    });
  });

  describe('GET /transactions/history', () => {
    it('should return transaction history successfully', async () => {
      const mockHistory = [
        { id: '1', amount: 100, type: 'send', status: 'success' },
        { id: '2', amount: 50, type: 'receive', status: 'success' },
      ];

      getTransactionHistory.mockResolvedValue(mockHistory);

      const response = await request(app).get('/transactions/history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Transaction history retrieved successfully',
        data: mockHistory,
      });
    });

    it('should return an error if fetching transaction history fails', async () => {
      getTransactionHistory.mockRejectedValue(new Error('Failed to fetch history'));

      const response = await request(app).get('/transactions/history');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Failed to fetch history',
      });
    });
  });
});