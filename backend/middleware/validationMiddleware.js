import ApiError from '../utils/apiError.js';

const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(', ');
    return next(new ApiError(400, errorMessages));
  }
  // Store validated, sanitized data back to req.body
  req.body = result.data;
  next();
};

export default validateRequest;
