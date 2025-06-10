const { asyncHandler, ExternalAPIError } = require('../utils/errorHandler');
const JolpicaF1Client = require('../services/jolpicaClient');
const logger = require('../utils/logger');

// Initialize F1 client
const f1Client = new JolpicaF1Client();

/**
 * Constructors Controller
 * Handles F1 constructors/teams data endpoints
 */

/**
 * Get constructors for a season
 * @route GET /constructors/:year?
 */
const getConstructors = asyncHandler(async (req, res) => {
  const { year = 'current' } = req.validatedParams;

  try {
    logger.info('Fetching constructors data', { year });
    const data = await f1Client.getConstructors(year);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/constructors/${year}`,
        year: year,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch constructors', {
      year,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch constructors for ${year}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get specific constructor data
 * @route GET /constructors/:year/:constructorId
 */
const getConstructor = asyncHandler(async (req, res) => {
  const { year, constructorId } = req.validatedParams;

  try {
    logger.info('Fetching constructor data', { year, constructorId });
    const data = await f1Client.getConstructor(year, constructorId);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/constructors/${year}/${constructorId}`,
        year: year,
        constructorId: constructorId,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch constructor data', {
      year,
      constructorId,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch constructor ${constructorId} for ${year}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get championship standings
 * @route GET /standings/:year/:type?
 */
const getStandings = asyncHandler(async (req, res) => {
  const { year, type = 'drivers' } = req.validatedParams;

  try {
    logger.info('Fetching standings data', { year, type });
    const data = await f1Client.getStandings(year, type);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/standings/${year}/${type}`,
        year: year,
        type: type,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch standings', {
      year,
      type,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch ${type} standings for ${year}`,
      error.status || 503,
      error,
    );
  }
});

module.exports = {
  getConstructors,
  getConstructor,
  getStandings,
};
