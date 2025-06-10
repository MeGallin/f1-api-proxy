const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs all incoming requests with timing information
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Generate unique request ID
  req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log request start
  logger.info('Request started', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    referer: req.get('Referer')
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    // Log request completion
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
}

module.exports = requestLogger;
