const { asyncHandler, ExternalAPIError } = require('../utils/errorHandler');
const JolpicaF1Client = require('../services/jolpicaClient');
const logger = require('../utils/logger');

// Initialize F1 client
const f1Client = new JolpicaF1Client();

/**
 * Races Controller
 * Handles F1 races data endpoints
 */

/**
 * Get races for a season
 * @route GET /races/:year
 */
const getRaces = asyncHandler(async (req, res) => {
  const { year } = req.validatedParams;

  try {
    logger.info('Fetching races for season', { year });
    const data = await f1Client.getRaces(year);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/races/${year}`,
        year: year,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch races', { year, error: error.message });
    throw new ExternalAPIError(
      `Failed to fetch races for ${year}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get specific race data
 * @route GET /races/:year/:round
 */
const getRace = asyncHandler(async (req, res) => {
  const { year, round } = req.validatedParams;

  try {
    logger.info('Fetching race data', { year, round });
    const data = await f1Client.getRace(year, round);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/races/${year}/${round}`,
        year: year,
        round: round,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch race data', {
      year,
      round,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch race ${year}/${round} data`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get qualifying results
 * @route GET /qualifying/:year/:round
 */
const getQualifying = asyncHandler(async (req, res) => {
  const { year, round } = req.validatedParams;

  try {
    logger.info('Fetching qualifying data', { year, round });
    const data = await f1Client.getQualifying(year, round);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/qualifying/${year}/${round}`,
        year: year,
        round: round,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch qualifying data', {
      year,
      round,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch qualifying for ${year}/${round}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get lap times
 * @route GET /laps/:year/:round/:lap?
 */
const getLapTimes = asyncHandler(async (req, res) => {
  const { year, round, lap } = req.validatedParams;

  try {
    logger.info('Fetching lap times', { year, round, lap });
    const data = await f1Client.getLapTimes(year, round, lap);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: lap
          ? `/laps/${year}/${round}/${lap}`
          : `/laps/${year}/${round}`,
        year: year,
        round: round,
        lap: lap,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch lap times', {
      year,
      round,
      lap,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch lap times for ${year}/${round}${lap ? `/${lap}` : ''}`,
      error.status || 503,
      error,
    );
  }
});

/**
 * Get pit stops data
 * @route GET /pitstops/:year/:round
 */
const getPitStops = asyncHandler(async (req, res) => {
  const { year, round } = req.validatedParams;

  try {
    logger.info('Fetching pit stops data', { year, round });
    const data = await f1Client.getPitStops(year, round);

    res.json({
      success: true,
      data: data,
      meta: {
        endpoint: `/pitstops/${year}/${round}`,
        year: year,
        round: round,
        cached: true,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch pit stops data', {
      year,
      round,
      error: error.message,
    });
    throw new ExternalAPIError(
      `Failed to fetch pit stops for ${year}/${round}`,
      error.status || 503,
      error,
    );
  }
});

module.exports = {
  getRaces,
  getRace,
  getQualifying,
  getLapTimes,
  getPitStops,
};
