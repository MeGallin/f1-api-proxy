const { asyncHandler } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * System Controller
 * Handles health checks, API info, and service discovery endpoints
 */

/**
 * Health check endpoint
 * @route GET /health
 */
const healthCheck = asyncHandler(async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    service: 'f1-api-proxy',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  logger.debug('Health check requested', { status: healthStatus });
  res.json(healthStatus);
});

/**
 * API information endpoint
 * @route GET /api/info
 */
const apiInfo = asyncHandler(async (req, res) => {
  const apiInfo = {
    name: 'F1 API Proxy',
    description: 'Formula 1 data API proxy service',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: {
      seasons: '/seasons',
      races: '/races/:year/:round?',
      drivers: '/drivers/:year?/:driverId?',
      constructors: '/constructors/:year?/:constructorId?',
      qualifying: '/qualifying/:year/:round',
      results: '/results/:year/:round',
      standings: '/standings/:year/:type?',
      lapTimes: '/laps/:year/:round/:lap?',
      pitStops: '/pitstops/:year/:round',
    },
    documentation: 'https://github.com/your-org/f1-api-proxy/docs',
    source: 'Jolpica F1 API (Ergast Motor Racing Developer API)',
  };

  res.json(apiInfo);
});

/**
 * Tools discovery endpoint for MCP integration
 * @route GET /tools
 */
const toolsDiscovery = asyncHandler(async (req, res) => {
  const tools = {
    service: 'f1-api-proxy',
    version: '1.0.0',
    capabilities: [
      'seasons',
      'races',
      'drivers',
      'constructors',
      'qualifying',
      'results',
      'standings',
      'lap-times',
      'pit-stops',
    ],
    endpoints: [
      {
        name: 'get_seasons',
        path: '/seasons',
        method: 'GET',
        description: 'Get all F1 seasons',
        parameters: {},
      },
      {
        name: 'get_races',
        path: '/races/:year/:round?',
        method: 'GET',
        description: 'Get race schedules and details',
        parameters: {
          year: { type: 'string', required: true },
          round: { type: 'string', required: false },
        },
      },
      {
        name: 'get_drivers',
        path: '/drivers/:year?/:driverId?',
        method: 'GET',
        description: 'Get driver information',
        parameters: {
          year: { type: 'string', required: false, default: 'current' },
          driverId: { type: 'string', required: false },
        },
      },
      {
        name: 'get_constructors',
        path: '/constructors/:year?/:constructorId?',
        method: 'GET',
        description: 'Get constructor/team data',
        parameters: {
          year: { type: 'string', required: false, default: 'current' },
          constructorId: { type: 'string', required: false },
        },
      },
      {
        name: 'get_standings',
        path: '/standings/:year/:type?',
        method: 'GET',
        description: 'Get championship standings',
        parameters: {
          year: { type: 'string', required: true },
          type: {
            type: 'string',
            required: false,
            default: 'drivers',
            enum: ['drivers', 'constructors'],
          },
        },
      },
    ],
  };

  res.json(tools);
});

module.exports = {
  healthCheck,
  apiInfo,
  toolsDiscovery,
};
