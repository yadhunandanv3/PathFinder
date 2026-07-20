import ApiError from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    const message = `Resource not found with id of ${error.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    const fields = Object.keys(error.keyValue).join(', ');
    const message = `Duplicate field value entered for: ${fields}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message).join(', ');
    error = new ApiError(400, message);
  }

  // Handle JWT web token errors
  if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }

  if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please log in again.');
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

export default errorHandler;
