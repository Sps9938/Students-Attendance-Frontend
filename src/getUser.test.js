
/**
 * @jest-environment node
 */
import axios from 'axios';

describe('API Endpoints', () => {
  // ...existing code...

  it('GET /api/v1/user/get-user should return user details with valid token', async () => {
    // First, login to get the accessToken
    const loginRes = await axios.patch('http://localhost:4000/api/v1/user/login', {
      email: 'satya256prakash@gmail.com', // Replace with a valid test user
      password: 'satya@99380' // Replace with the correct password
    });
    const token = loginRes.data.data.accessToken;
    // Now, use the token to get user details
    const response = await axios.get('http://localhost:4000/api/v1/user/get-user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.status).toBe(200);
    expect(response.data.data).toHaveProperty('email');
    expect(response.data.data).toHaveProperty('fullname');
    // Add more property checks as needed
  });

  // ...existing code...
});
