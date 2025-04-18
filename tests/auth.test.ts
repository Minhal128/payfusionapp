import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { User } from '../src/models/userModel'; // Adjust the path as necessary
import { generateOTP } from '../src/services/otpService'; // Adjust the path as necessary

jest.mock('../src/services/otpService');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should register a user and send OTP', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dob: '1990-01-01',
        gender: 'Male',
        phoneNumber: '1234567890',
        sendMessages: true,
      };

      (generateOTP as jest.Mock).mockReturnValue('123456');

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'OTP sent to your phone number.',
        data: {
          phoneNumber: userData.phoneNumber,
        },
      });
    });

    it('should return an error if user already exists', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        dob: '1990-01-01',
        gender: 'Female',
        phoneNumber: '1234567890',
        sendMessages: true,
      };

      await User.create(userData); // Simulate user already exists

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User already exists.',
      });
    });
  });

  describe('User Login', () => {
    it('should log in a user and send OTP', async () => {
      const userData = {
        phoneNumber: '1234567890',
      };

      (generateOTP as jest.Mock).mockReturnValue('654321');

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'OTP sent to your phone number.',
      });
    });

    it('should return an error if phone number is not registered', async () => {
      const userData = {
        phoneNumber: '0987654321',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found.',
      });
    });
  });

  // Additional tests for OTP verification, PIN creation, etc. can be added here
});