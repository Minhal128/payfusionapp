import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { createFundAccount, getFundAccount } from '../src/services/fundService';

jest.mock('../src/services/fundService');

describe('Fund Account API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /fund', () => {
    it('should create a fund account successfully', async () => {
      const mockResponse = { id: '123', balance: 1000 };
      createFundAccount.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/fund')
        .send({ amount: 1000 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Fund account created successfully',
        data: mockResponse,
      });
    });

    it('should return an error if fund account creation fails', async () => {
      createFundAccount.mockRejectedValue(new Error('Creation failed'));

      const response = await request(app)
        .post('/fund')
        .send({ amount: 1000 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Creation failed',
      });
    });
  });

  describe('GET /fund/:id', () => {
    it('should retrieve a fund account successfully', async () => {
      const mockResponse = { id: '123', balance: 1000 };
      getFundAccount.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/fund/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Fund account retrieved successfully',
        data: mockResponse,
      });
    });

    it('should return an error if fund account not found', async () => {
      getFundAccount.mockResolvedValue(null);

      const response = await request(app)
        .get('/fund/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Fund account not found',
      });
    });
  });
});