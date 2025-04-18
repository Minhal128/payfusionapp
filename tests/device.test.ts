import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { Device } from '../src/models/deviceModel'; // Adjust the path as necessary

describe('Device Management Tests', () => {
  let deviceId;

  beforeAll(async () => {
    // Setup: Create a device for testing
    const device = await Device.create({ /* mock device data */ });
    deviceId = device._id;
  });

  afterAll(async () => {
    // Cleanup: Remove the test device
    await Device.deleteMany({});
  });

  test('should verify device successfully', async () => {
    const response = await request(app)
      .post('/api/devices/verify') // Adjust the endpoint as necessary
      .send({ deviceId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Device verified successfully',
      data: expect.any(Object),
    });
  });

  test('should return error for invalid device ID', async () => {
    const response = await request(app)
      .post('/api/devices/verify')
      .send({ deviceId: 'invalid-id' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Invalid device ID',
    });
  });

  test('should handle device change request', async () => {
    const response = await request(app)
      .post('/api/devices/change') // Adjust the endpoint as necessary
      .send({ deviceId, newDeviceId: 'new-device-id' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Device change request submitted successfully',
    });
  });

  test('should return error for unauthorized device change', async () => {
    const response = await request(app)
      .post('/api/devices/change')
      .send({ deviceId: 'unauthorized-id', newDeviceId: 'new-device-id' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Unauthorized device change request',
    });
  });
});