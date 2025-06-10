const { asyncHandler, ExternalAPIError } = require('../utils/errorHandler');
const { validateMiddleware } = require('../utils/validation');
const JolpicaF1Client = require('../services/jolpicaClient');
const logger = require('../utils/logger');

// Initialize F1 client
const f1Client = new JolpicaF1Client();

/**
 * Seasons Controller
 * Handles F1 seasons data endpoints
 */

/**
 * Get all F1 seasons
 * @route GET /seasons
 */
const getSeasons = asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching all F1 seasons');
    const data = await f1Client.getSeasons();

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: '/seasons',
        cached: true, // Will be determined by client
      },
    });
  } catch (error) {
    logger.error('Failed to fetch seasons', { error: error.message });
    throw new ExternalAPIError(
      'Failed to fetch F1 seasons data',
      error.status || 503,
      error,
    );
  }
});

/**
 * Get specific season data
 * @route GET /seasons/:year
 */
const getSeason = asyncHandler(async (req, res) => {
  const { year } = req.validatedParams;

  try {
    logger.info('Fetching season data', { year });
    const data = await f1Client.getSeason(year);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/seasons/${year}`,
        year: year,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch season data', { year, error: error.message });
    throw new ExternalAPIError(
      `Failed to fetch F1 season ${year} data`,
      error.status || 503,
      error,
    );
  }
});

module.exports = {
  getSeasons,
  getSeason,
};
