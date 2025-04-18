import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { KYC } from '../src/models/kycModel'; // Adjust the path as necessary

describe('KYC Verification Tests', () => {
  beforeAll(async () => {
    // Clear the KYC collection before tests
    await KYC.deleteMany({});
  });

  afterAll(async () => {
    // Close the database connection after tests
    await KYC.deleteMany({});
  });

  it('should create a new KYC entry', async () => {
    const response = await request(app)
      .post('/api/kyc') // Adjust the route as necessary
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dob: '1990-01-01',
        gender: 'Male',
        backgroundInfo: 'Some background info',
        country: 'USA',
        passport: 'base64EncodedPassportImage', // Mocked base64 image
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Your registration is complete.',
      data: expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
      }),
    });
  });

  it('should return an error for missing fields', async () => {
    const response = await request(app)
      .post('/api/kyc') // Adjust the route as necessary
      .send({
        firstName: 'John',
        // lastName is missing
        email: 'john.doe@example.com',
        dob: '1990-01-01',
        gender: 'Male',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Validation error: lastName is required.',
    });
  });

  it('should return an error for invalid email', async () => {
    const response = await request(app)
      .post('/api/kyc') // Adjust the route as necessary
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        dob: '1990-01-01',
        gender: 'Male',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Validation error: email must be a valid email address.',
    });
  });
});