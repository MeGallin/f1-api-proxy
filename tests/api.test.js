const request = require('supertest');
const app = require('../src/app');

/**
 * F1 API Proxy Integration Tests
 * Professional test suite focusing on critical functionality
 */

describe('F1 API Proxy', () => {
  // System endpoints
  describe('System Endpoints', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'f1-api-proxy');
      expect(response.body).toHaveProperty('uptime');
    });

    test('GET /api/info should return API information', async () => {
      const response = await request(app).get('/api/info').expect(200);

      expect(response.body).toHaveProperty('name', 'F1 API Proxy');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('seasons');
    });

    test('GET /tools should return tools discovery', async () => {
      const response = await request(app).get('/tools').expect(200);

      expect(response.body).toHaveProperty('service', 'f1-api-proxy');
      expect(response.body).toHaveProperty('capabilities');
      expect(Array.isArray(response.body.capabilities)).toBe(true);
    });
  });

  // API endpoints (these will hit the real Jolpica API in integration tests)
  describe('F1 Data Endpoints', () => {
    test('GET /seasons should return seasons data', async () => {
      const response = await request(app).get('/seasons').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    }, 10000); // Extended timeout for external API

    test('GET /drivers should return current drivers', async () => {
      const response = await request(app).get('/drivers').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.meta).toHaveProperty('year', 'current');
    }, 10000);

    test('GET /constructors should return current constructors', async () => {
      const response = await request(app).get('/constructors').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    }, 10000);
  });

  // Validation tests
  describe('Parameter Validation', () => {
    test('GET /races/invalid-year should return 400', async () => {
      const response = await request(app).get('/races/invalid').expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/validation/i);
    });

    test('GET /standings/2023/invalid-type should return 400', async () => {
      const response = await request(app)
        .get('/standings/2023/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Error handling
  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  // CORS and security headers
  describe('Security Headers', () => {
    test('Should include security headers', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });

    test('Should handle CORS preflight', async () => {
      const response = await request(app)
        .options('/seasons')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});

// Cleanup
afterAll((done) => {
  done();
});
