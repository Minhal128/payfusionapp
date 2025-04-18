import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { Investment } from '../src/models/investmentModel'; // Adjust the import based on your model structure

describe('Investment API', () => {
  beforeAll(async () => {
    // Setup code, e.g., connecting to the database
  });

  afterAll(async () => {
    // Cleanup code, e.g., disconnecting from the database
  });

  it('should create a new investment', async () => {
    const investmentData = {
      userId: '12345', // Replace with a valid user ID
      amount: 1000,
      fundId: '67890', // Replace with a valid fund ID
    };

    const response = await request(app)
      .post('/api/investments') // Adjust the endpoint as necessary
      .send(investmentData)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Investment created successfully');
    expect(response.body.data).toHaveProperty('id');
  });

  it('should retrieve all investments for a user', async () => {
    const userId = '12345'; // Replace with a valid user ID

    const response = await request(app)
      .get(`/api/investments/${userId}`) // Adjust the endpoint as necessary
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Investments retrieved successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should fail to create an investment with invalid data', async () => {
    const investmentData = {
      userId: '12345',
      amount: -100, // Invalid amount
      fundId: '67890',
    };

    const response = await request(app)
      .post('/api/investments') // Adjust the endpoint as necessary
      .send(investmentData)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Invalid investment data');
  });
});