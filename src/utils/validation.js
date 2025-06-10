const { z } = require('zod');

/**
 * Validation schemas for F1 API endpoints
 * Using Zod for runtime validation and type safety
 */

// Common parameter schemas
const yearSchema = z.string().regex(/^\d{4}$|^current$/, 'Year must be a 4-digit year or "current"');
const roundSchema = z.string().regex(/^\d+$/, 'Round must be a positive integer');
const driverIdSchema = z.string().min(1, 'Driver ID cannot be empty');
const constructorIdSchema = z.string().min(1, 'Constructor ID cannot be empty');
const lapSchema = z.string().regex(/^\d+$/, 'Lap must be a positive integer');
const standingTypeSchema = z.enum(['drivers', 'constructors'], 'Type must be "drivers" or "constructors"');

/**
 * Validation schemas for different endpoints
 */
const validationSchemas = {
  // Seasons
  seasons: z.object({}),
  season: z.object({
    year: yearSchema
  }),

  // Races
  races: z.object({
    year: yearSchema
  }),
  race: z.object({
    year: yearSchema,
    round: roundSchema
  }),

  // Drivers
  drivers: z.object({
    year: yearSchema.optional()
  }),
  driver: z.object({
    year: yearSchema,
    driverId: driverIdSchema
  }),

  // Constructors
  constructors: z.object({
    year: yearSchema.optional()
  }),
  constructor: z.object({
    year: yearSchema,
    constructorId: constructorIdSchema
  }),

  // Qualifying
  qualifying: z.object({
    year: yearSchema,
    round: roundSchema
  }),

  // Lap times
  lapTimes: z.object({
    year: yearSchema,
    round: roundSchema,
    lap: lapSchema.optional()
  }),

  // Pit stops
  pitStops: z.object({
    year: yearSchema,
    round: roundSchema
  }),

  // Standings
  standings: z.object({
    year: yearSchema,
    type: standingTypeSchema.optional()
  }),

  // Results
  results: z.object({
    year: yearSchema,
    round: roundSchema
  })
};

/**
 * Validate request parameters against schema
 * @param {string} schemaName - Name of the validation schema
 * @param {Object} data - Data to validate
 * @returns {Object} - Validation result
 */
function validateParams(schemaName, data) {
  const schema = validationSchemas[schemaName];
  if (!schema) {
    throw new Error(`Unknown validation schema: ${schemaName}`);
  }

  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    };
  }
}

/**
 * Express middleware for parameter validation
 * @param {string} schemaName - Name of the validation schema
 * @returns {Function} - Express middleware function
 */
function validateMiddleware(schemaName) {
  return (req, res, next) => {
    const params = { ...req.params, ...req.query };
    const validation = validateParams(schemaName, params);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: validation.error
      });
    }
    
    req.validatedParams = validation.data;
    next();
  };
}

module.exports = {
  validationSchemas,
  validateParams,
  validateMiddleware
};
