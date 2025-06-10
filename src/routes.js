const express = require('express');
const { validateMiddleware } = require('./utils/validation');

// Import controllers
const systemController = require('./controllers/systemController');
const seasonsController = require('./controllers/seasonsController');
const racesController = require('./controllers/racesController');
const driversController = require('./controllers/driversController');
const constructorsController = require('./controllers/constructorsController');
const resultsController = require('./controllers/resultsController');

const router = express.Router();

/**
 * API Routes Configuration
 * All routes use validation middleware for parameter checking
 */

// System routes
router.get('/health', systemController.healthCheck);
router.get('/api/info', systemController.apiInfo);
router.get('/tools', systemController.toolsDiscovery);

// Seasons routes
router.get(
  '/seasons',
  validateMiddleware('seasons'),
  seasonsController.getSeasons,
);
router.get(
  '/seasons/:year',
  validateMiddleware('season'),
  seasonsController.getSeason,
);

// Races routes
router.get(
  '/races/:year',
  validateMiddleware('races'),
  racesController.getRaces,
);
router.get(
  '/races/:year/:round',
  validateMiddleware('race'),
  racesController.getRace,
);

// Qualifying routes
router.get(
  '/qualifying/:year/:round',
  validateMiddleware('qualifying'),
  racesController.getQualifying,
);

// Lap times routes
router.get(
  '/laps/:year/:round',
  validateMiddleware('lapTimes'),
  racesController.getLapTimes,
);
router.get(
  '/laps/:year/:round/:lap',
  validateMiddleware('lapTimes'),
  racesController.getLapTimes,
);

// Pit stops routes
router.get(
  '/pitstops/:year/:round',
  validateMiddleware('pitStops'),
  racesController.getPitStops,
);

// Drivers routes
router.get(
  '/drivers',
  validateMiddleware('drivers'),
  driversController.getDrivers,
);
router.get(
  '/drivers/:year',
  validateMiddleware('drivers'),
  driversController.getDrivers,
);
router.get(
  '/drivers/:year/:driverId',
  validateMiddleware('driver'),
  driversController.getDriver,
);

// Constructors routes
router.get(
  '/constructors',
  validateMiddleware('constructors'),
  constructorsController.getConstructors,
);
router.get(
  '/constructors/:year',
  validateMiddleware('constructors'),
  constructorsController.getConstructors,
);
router.get(
  '/constructors/:year/:constructorId',
  validateMiddleware('constructor'),
  constructorsController.getConstructor,
);

// Standings routes
router.get(
  '/standings/:year',
  validateMiddleware('standings'),
  constructorsController.getStandings,
);
router.get(
  '/standings/:year/:type',
  validateMiddleware('standings'),
  constructorsController.getStandings,
);

// Results routes
router.get(
  '/results/:year/:round',
  validateMiddleware('results'),
  resultsController.getResults,
);

module.exports = router;
