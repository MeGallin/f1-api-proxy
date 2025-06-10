/**
 * Cache Helper Utilities
 * Determines appropriate cache TTL based on data type and freshness requirements
 */

/**
 * Data type enumeration for cache strategy
 */
const DataTypes = {
  HISTORICAL: 'historical',
  CURRENT_SEASON: 'current_season', 
  LIVE_RACE: 'live_race',
  DEFAULT: 'default'
};

/**
 * Determine data type based on endpoint and parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {string} - Data type
 */
function determineDataType(endpoint, params = {}) {
  // Check if it's current season data
  if (endpoint.includes('/current/') || params.year === 'current') {
    return DataTypes.CURRENT_SEASON;
  }

  // Check if it's historical data (year < current year)
  const currentYear = new Date().getFullYear();
  const requestYear = parseInt(params.year) || extractYearFromEndpoint(endpoint);
  
  if (requestYear && requestYear < currentYear) {
    return DataTypes.HISTORICAL;
  }

  // Check if it's live race data (lap times, pit stops during race weekend)
  if (endpoint.includes('/laps/') || endpoint.includes('/pitstops/')) {
    return DataTypes.LIVE_RACE;
  }

  return DataTypes.DEFAULT;
}

/**
 * Extract year from endpoint path
 * @private
 * @param {string} endpoint - API endpoint
 * @returns {number|null} - Extracted year or null
 */
function extractYearFromEndpoint(endpoint) {
  const yearMatch = endpoint.match(/\/(\d{4})\//);
  return yearMatch ? parseInt(yearMatch[1]) : null;
}

/**
 * Get cache TTL based on data type
 * @param {string} dataType - Data type from DataTypes enum
 * @returns {number} - TTL in seconds
 */
function getCacheTTL(dataType) {
  switch (dataType) {
    case DataTypes.HISTORICAL:
      return parseInt(process.env.CACHE_TTL_HISTORICAL) || 86400; // 24 hours
    case DataTypes.CURRENT_SEASON:
      return parseInt(process.env.CACHE_TTL_CURRENT) || 3600; // 1 hour
    case DataTypes.LIVE_RACE:
      return parseInt(process.env.CACHE_TTL_LIVE) || 300; // 5 minutes
    default:
      return parseInt(process.env.CACHE_TTL_DEFAULT) || 300; // 5 minutes
  }
}

/**
 * Generate cache key for consistent caching
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {string} - Cache key
 */
function generateCacheKey(endpoint, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
  return `${endpoint}_${JSON.stringify(sortedParams)}`;
}

module.exports = {
  DataTypes,
  determineDataType,
  getCacheTTL,
  generateCacheKey
};
