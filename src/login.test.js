
/**
 * @jest-environment node
 */
import axios from 'axios';

describe('API Endpoints', () => {
  // ...existing code...

  it('PATHCH /api/user/login should login successfully with valid credentials', async () => {
    const response = await axios.patch('http://localhost:4000/api/v1/user/login', {
      email: 'satya256prakash@gmail.com', // Replace with a valid test user
      password: 'satya@99380'       // Replace with the correct password
    });
    expect(response.status).toBe(200);
    expect(response.data.data).toHaveProperty('accessToken');
    expect(response.data.data).toHaveProperty('refreshToken');
  });

  // ...existing code...
});
