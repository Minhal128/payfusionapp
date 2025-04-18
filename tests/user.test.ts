import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { User } from '../src/models/userModel'; // Adjust the path as necessary

describe('User Management Tests', () => {
  beforeAll(async () => {
    await User.deleteMany({}); // Clear the user collection before tests
  });

  afterAll(async () => {
    await User.deleteMany({}); // Clean up after tests
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register') // Adjust the route as necessary
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        dob: '1990-01-01',
        gender: 'Male',
        sendMessages: true,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Registration successful. Please verify your OTP.');
  });

  it('should send OTP for verification', async () => {
    const response = await request(app)
      .post('/api/auth/send-otp') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'OTP sent successfully.');
  });

  it('should verify OTP', async () => {
    const response = await request(app)
      .post('/api/auth/verify-otp') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
        otp: '123456', // Replace with the actual OTP sent
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'OTP verified successfully.');
  });

  it('should create a transaction PIN', async () => {
    const response = await request(app)
      .post('/api/auth/create-pin') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
        pin: '1234', // Replace with the desired PIN
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Congratulations! Your PIN has been created.');
  });

  it('should log in the user', async () => {
    const response = await request(app)
      .post('/api/auth/login') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful. Please verify your OTP.');
  });

  it('should verify OTP during login', async () => {
    const response = await request(app)
      .post('/api/auth/verify-login-otp') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
        otp: '123456', // Replace with the actual OTP sent
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful.');
  });

  it('should handle device verification', async () => {
    const response = await request(app)
      .post('/api/auth/verify-device') // Adjust the route as necessary
      .send({
        phoneNumber: '1234567890',
        accountNumber: '123456789', // Replace with actual account number
        transactionPin: '1234', // Replace with actual transaction PIN
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Your device change request has been successfully approved.');
  });
});