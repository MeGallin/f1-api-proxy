const { asyncHandler, ExternalAPIError } = require('../utils/errorHandler');
const JolpicaF1Client = require('../services/jolpicaClient');
const logger = require('../utils/logger');

// Initialize F1 client
const f1Client = new JolpicaF1Client();

/**
 * Results Controller
 * Handles F1 race results data endpoints
 */

/**
 * Get race results
 * @route GET /results/:year/:round
 */
const getResults = asyncHandler(async (req, res) => {
  const { year, round } = req.validatedParams;

  try {
    logger.info('Fetching race results', { year, round });
    const data = await f1Client.getResults(year, round);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/results/${year}/${round}`,
        year: year,
        round: round,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch race results', {
      year,
      round,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch results for ${year}/${round}`,
      error.status || 503,
      error,
    );
  }
});

module.exports = {
  getResults,
};
