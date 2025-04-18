import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { createWallet, getWallet, sendMoney, receiveMoney } from '../src/controllers/walletController';

jest.mock('../src/controllers/walletController');

describe('Wallet API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /wallet/create', () => {
    it('should create a wallet successfully', async () => {
      const mockResponse = { status: 'success', data: { walletId: '12345' } };
      createWallet.mockResolvedValue(mockResponse);

      const response = await request(app).post('/wallet/create').send({ userId: 'user123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(createWallet).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should return an error if wallet creation fails', async () => {
      const mockError = { status: 'error', message: 'Failed to create wallet' };
      createWallet.mockRejectedValue(mockError);

      const response = await request(app).post('/wallet/create').send({ userId: 'user123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockError);
    });
  });

  describe('GET /wallet/:userId', () => {
    it('should retrieve wallet details successfully', async () => {
      const mockResponse = { status: 'success', data: { balance: 100 } };
      getWallet.mockResolvedValue(mockResponse);

      const response = await request(app).get('/wallet/user123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(getWallet).toHaveBeenCalledWith('user123');
    });

    it('should return an error if wallet retrieval fails', async () => {
      const mockError = { status: 'error', message: 'Wallet not found' };
      getWallet.mockRejectedValue(mockError);

      const response = await request(app).get('/wallet/user123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual(mockError);
    });
  });

  describe('POST /wallet/send', () => {
    it('should send money successfully', async () => {
      const mockResponse = { status: 'success', message: 'Payment Successful' };
      sendMoney.mockResolvedValue(mockResponse);

      const response = await request(app).post('/wallet/send').send({
        fromUserId: 'user123',
        toUserId: 'user456',
        amount: 50,
        transactionPin: '1234'
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(sendMoney).toHaveBeenCalledWith({
        fromUserId: 'user123',
        toUserId: 'user456',
        amount: 50,
        transactionPin: '1234'
      });
    });

    it('should return an error if sending money fails', async () => {
      const mockError = { status: 'error', message: 'Insufficient funds' };
      sendMoney.mockRejectedValue(mockError);

      const response = await request(app).post('/wallet/send').send({
        fromUserId: 'user123',
        toUserId: 'user456',
        amount: 50,
        transactionPin: '1234'
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockError);
    });
  });

  describe('POST /wallet/receive', () => {
    it('should receive money successfully', async () => {
      const mockResponse = { status: 'success', message: 'Money received' };
      receiveMoney.mockResolvedValue(mockResponse);

      const response = await request(app).post('/wallet/receive').send({
        userId: 'user456',
        amount: 50
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(receiveMoney).toHaveBeenCalledWith({
        userId: 'user456',
        amount: 50
      });
    });

    it('should return an error if receiving money fails', async () => {
      const mockError = { status: 'error', message: 'Failed to receive money' };
      receiveMoney.mockRejectedValue(mockError);

      const response = await request(app).post('/wallet/receive').send({
        userId: 'user456',
        amount: 50
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(mockError);
    });
  });
});