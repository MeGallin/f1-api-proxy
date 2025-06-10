const { asyncHandler, ExternalAPIError } = require('../utils/errorHandler');
const JolpicaF1Client = require('../services/jolpicaClient');
const logger = require('../utils/logger');

// Initialize F1 client
const f1Client = new JolpicaF1Client();

/**
 * Drivers Controller
 * Handles F1 drivers data endpoints
 */

/**
 * Get drivers for a season
 * @route GET /drivers/:year?
 */
const getDrivers = asyncHandler(async (req, res) => {
  const { year = 'current' } = req.validatedParams;

  try {
    logger.info('Fetching drivers data', { year });
    const data = await f1Client.getDrivers(year);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/drivers/${year}`,
        year: year,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch drivers', { year, error: error.message });
    throw new ExternalAPIError(
      `Failed to fetch drivers for ${year}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get specific driver data
 * @route GET /drivers/:year/:driverId
 */
const getDriver = asyncHandler(async (req, res) => {
  const { year, driverId } = req.validatedParams;

  try {
    logger.info('Fetching driver data', { year, driverId });
    const data = await f1Client.getDriver(year, driverId);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/drivers/${year}/${driverId}`,
        year: year,
        driverId: driverId,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch driver data', {
      year,
      driverId,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch driver ${driverId} for ${year}`,
      error.status || 503,
      error,
    );
  }
});

module.exports = {
  getDrivers,
  getDriver,
};
