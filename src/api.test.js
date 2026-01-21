import axios from 'axios';

describe('API Endpoints', () => {
  // Example: Health check endpoint
  it('GET /api/health should return status 200 and status ok', async () => {
    const response = await axios.get('http://localhost:4000/api/health');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status', 'ok');
  });


});
