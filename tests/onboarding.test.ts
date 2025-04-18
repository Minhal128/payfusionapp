import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { User } from '../src/models/userModel'; // Adjust the path as necessary

describe('Onboarding Flow', () => {
  let user;

  beforeAll(async () => {
    // Create a test user for onboarding
    user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      messagesConsent: true,
      transactionPin: '1234', // Example PIN
    });
  });

  afterAll(async () => {
    // Clean up the test user
    await User.deleteOne({ _id: user._id });
  });

  it('should prompt user to create a transaction PIN', async () => {
    const response = await request(app)
      .post('/api/onboarding/create-pin')
      .send({
        userId: user._id,
        transactionPin: '5678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('You have successfully created your transaction PIN.');
  });

  it('should require profile picture upload', async () => {
    const response = await request(app)
      .post('/api/onboarding/upload-profile-picture')
      .attach('profilePicture', 'path/to/test/image.jpg') // Adjust the path as necessary
      .send({ userId: user._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile picture uploaded successfully.');
  });

  it('should require utility bill upload', async () => {
    const response = await request(app)
      .post('/api/onboarding/upload-utility-bill')
      .attach('utilityBill', 'path/to/test/bill.jpg') // Adjust the path as necessary
      .send({ userId: user._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Utility bill uploaded successfully.');
  });
});