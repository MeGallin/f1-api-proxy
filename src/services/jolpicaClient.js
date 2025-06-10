const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');
const { determineDataType, getCacheTTL } = require('../utils/cacheHelper');

/**
 * Jolpica F1 API Client
 * Single responsibility: Handle all communication with the Jolpica F1 API
 * Implements caching, error handling, and retry logic
 */
class JolpicaF1Client {
  constructor(options = {}) {
    this.baseURL = options.baseURL || process.env.JOLPICA_API_URL || 'http://api.jolpi.ca/ergast/f1';
    this.timeout = options.timeout || parseInt(process.env.API_TIMEOUT) || 10000;
    this.cache = new NodeCache({ 
      stdTTL: parseInt(process.env.CACHE_TTL_DEFAULT) || 300,
      checkperiod: 120 
    });
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'User-Agent': 'F1-MCP-Proxy/1.0.0',
        'Accept': 'application/json'
      }
    });

    this._setupInterceptors();
  }

  /**
   * Setup request/response interceptors for logging and error handling
   * @private
   */
  _setupInterceptors() {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Making API request', { 
          url: config.url, 
          method: config.method 
        });
        return config;
      },
      (error) => {
        logger.error('Request setup failed', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API response received', { 
          url: response.config.url, 
          status: response.status,
          dataSize: JSON.stringify(response.data).length 
        });
        return response;
      },
      (error) => {
        const errorDetails = {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message
        };
        logger.error('API request failed', errorDetails);
        return Promise.reject(this._normalizeError(error));
      }
    );
  }

  /**
   * Normalize API errors to consistent format
   * @private
   * @param {Error} error - The original error
   * @returns {Error} - Normalized error
   */
  _normalizeError(error) {
    if (error.response) {
      // Server responded with error status
      const normalizedError = new Error(`API Error: ${error.response.status}`);
      normalizedError.status = error.response.status;
      normalizedError.data = error.response.data;
      return normalizedError;
    } else if (error.request) {
      // Network error
      const normalizedError = new Error('Network Error: Unable to reach F1 API');
      normalizedError.status = 503;
      return normalizedError;
    } else {
      // Other error
      return error;
    }
  }

  /**
   * Generic method to make cached API calls
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - API response data
   */
  async _makeRequest(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options.params || {})}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      logger.debug('Cache hit', { endpoint, cacheKey });
      return cached;
    }

    try {
      const response = await this.client.get(endpoint, options);
      const data = response.data;

      // Determine cache TTL based on data type
      const dataType = determineDataType(endpoint, options.params);
      const ttl = getCacheTTL(dataType);
      
      // Cache the response
      this.cache.set(cacheKey, data, ttl);
      logger.debug('Data cached', { endpoint, ttl, dataType });

      return data;
    } catch (error) {
      logger.error('API request failed', { endpoint, error: error.message });
      throw error;
    }
  }

  // Core F1 API Methods

  /**
   * Get all F1 seasons
   * @returns {Promise<Object>} - Seasons data
   */
  async getSeasons() {
    return this._makeRequest('/seasons.json');
  }

  /**
   * Get specific season data
   * @param {string} year - Season year
   * @returns {Promise<Object>} - Season data
   */
  async getSeason(year) {
    return this._makeRequest(`/${year}.json`);
  }

  /**
   * Get races for a season
   * @param {string} year - Season year
   * @returns {Promise<Object>} - Races data
   */
  async getRaces(year) {
    return this._makeRequest(`/${year}.json`);
  }

  /**
   * Get specific race data
   * @param {string} year - Season year
   * @param {string} round - Race round
   * @returns {Promise<Object>} - Race data
   */
  async getRace(year, round) {
    return this._makeRequest(`/${year}/${round}.json`);
  }

  /**
   * Get drivers for a season
   * @param {string} year - Season year (default: 'current')
   * @returns {Promise<Object>} - Drivers data
   */
  async getDrivers(year = 'current') {
    return this._makeRequest(`/${year}/drivers.json`);
  }

  /**
   * Get specific driver data
   * @param {string} year - Season year
   * @param {string} driverId - Driver ID
   * @returns {Promise<Object>} - Driver data
   */
  async getDriver(year, driverId) {
    return this._makeRequest(`/${year}/drivers/${driverId}.json`);
  }

  /**
   * Get constructors for a season
   * @param {string} year - Season year (default: 'current')
   * @returns {Promise<Object>} - Constructors data
   */
  async getConstructors(year = 'current') {
    return this._makeRequest(`/${year}/constructors.json`);
  }

  /**
   * Get specific constructor data
   * @param {string} year - Season year
   * @param {string} constructorId - Constructor ID
   * @returns {Promise<Object>} - Constructor data
   */
  async getConstructor(year, constructorId) {
    return this._makeRequest(`/${year}/constructors/${constructorId}.json`);
  }

  /**
   * Get qualifying results
   * @param {string} year - Season year
   * @param {string} round - Race round
   * @returns {Promise<Object>} - Qualifying data
   */
  async getQualifying(year, round) {
    return this._makeRequest(`/${year}/${round}/qualifying.json`);
  }

  /**
   * Get lap times
   * @param {string} year - Season year
   * @param {string} round - Race round
   * @param {string} lap - Specific lap (optional)
   * @returns {Promise<Object>} - Lap times data
   */
  async getLapTimes(year, round, lap) {
    const endpoint = lap 
      ? `/${year}/${round}/laps/${lap}.json`
      : `/${year}/${round}/laps.json`;
    return this._makeRequest(endpoint);
  }

  /**
   * Get pit stops data
   * @param {string} year - Season year
   * @param {string} round - Race round
   * @returns {Promise<Object>} - Pit stops data
   */
  async getPitStops(year, round) {
    return this._makeRequest(`/${year}/${round}/pitstops.json`);
  }

  /**
   * Get championship standings
   * @param {string} year - Season year
   * @param {string} type - Standing type ('drivers' or 'constructors')
   * @returns {Promise<Object>} - Standings data
   */
  async getStandings(year, type = 'drivers') {
    const endpoint = type === 'constructors' 
      ? `/${year}/constructorStandings.json`
      : `/${year}/driverStandings.json`;
    return this._makeRequest(endpoint);
  }

  /**
   * Get race results
   * @param {string} year - Season year
   * @param {string} round - Race round
   * @returns {Promise<Object>} - Results data
   */
  async getResults(year, round) {
    return this._makeRequest(`/${year}/${round}/results.json`);
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache() {
    this.cache.flushAll();
    logger.info('Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

module.exports = JolpicaF1Client;
