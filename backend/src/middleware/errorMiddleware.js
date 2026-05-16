const AppError = require('../../src/utils/AppError');

/**
 * Global error handling middleware.
 * Must have 4 parameters so Express recognizes it as an error handler.
 *
 * The response format is intentionally kept consistent so the frontend
 * can always destructure { success, message, errors } from any response.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = null;

  // ---------- Mongoose bad ObjectId (e.g. invalid id in params) ----------
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ---------- Mongoose validation errors (missing/incorrect fields) ----------
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ---------- Mongoose duplicate key (e.g. unique email) ----------
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}. This ${field} is already taken.`;
  }

  // ---------- JWT errors ----------
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  // ---------- Express JSON parse error (malformed body) ----------
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // ---------- Build the response payload ----------
  const payload = {
    success: false,
    message,
    errors,
  };

  if (process.env.NODE_ENV === "development") {
    payload.stack = err.stack;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    if (process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
  }

  return res.status(statusCode).json(payload);
};

const notImplemented = (req, res) => {
  return res.status(501).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not implemented yet`,
    errors: null,
  });
};

/**
 * 404 handler – must be mounted AFTER all routes.
 * Catches requests that didn't match any route.
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = {
  errorHandler,
  notFound,
  notImplemented
};