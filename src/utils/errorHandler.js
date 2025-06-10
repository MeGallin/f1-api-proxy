const logger = require('./logger');

/**
 * Custom error classes for different types of errors
 */
class APIError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

class ValidationError extends APIError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details;
  }
}

class ExternalAPIError extends APIError {
  constructor(message, status = 503, originalError = null) {
    super(message, status, 'EXTERNAL_API_ERROR');
    this.name = 'ExternalAPIError';
    this.originalError = originalError;
  }
}

/**
 * Standard error response format
 * @param {Error} error - The error object
 * @param {string} requestId - Request ID for tracking
 * @returns {Object} - Formatted error response
 */
function formatErrorResponse(error, requestId = null) {
  const response = {
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR',
      status: error.status || 500
    }
  };

  if (requestId) {
    response.error.requestId = requestId;
  }

  // Include validation details if available
  if (error.details) {
    response.error.details = error.details;
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * Express error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Generate request ID for tracking
  const requestId = req.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Log the error with context
  logger.error('Request error', {
    requestId,
    error: err.message,
    status: err.status || 500,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    stack: err.stack
  });

  // Handle different error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(formatErrorResponse(err, requestId));
  }

  if (err.name === 'ExternalAPIError') {
    return res.status(err.status).json(formatErrorResponse(err, requestId));
  }

  if (err.status) {
    return res.status(err.status).json(formatErrorResponse(err, requestId));
  }

  // Default internal server error
  const internalError = new APIError('Internal Server Error', 500);
  res.status(500).json(formatErrorResponse(internalError, requestId));
}

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler
 * @returns {Function} - Wrapped handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler for unknown routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  const error = new APIError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
  res.status(404).json(formatErrorResponse(error));
}

module.exports = {
  APIError,
  ValidationError,
  ExternalAPIError,
  formatErrorResponse,
  errorHandler,
  asyncHandler,
  notFoundHandler
};
