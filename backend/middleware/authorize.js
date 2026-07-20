import ApiError from '../utils/apiError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: Authentication required before authorization'));
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return next(new ApiError(403, `Forbidden: User role '${userRole}' is not authorized to access this resource`));
    }

    next();
  };
};

export default authorize;
