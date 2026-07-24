import ApiError from '../utils/apiError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: Authentication required before authorization'));
    }

    const userRole = req.user.role ? req.user.role.trim() : '';

    // Map common role variations to standard uppercase values
    const roleMapping = {
      'admin': 'ADMIN',
      'social_media_manager': 'SOCIAL_MEDIA_MANAGER',
      'social media manager': 'SOCIAL_MEDIA_MANAGER',
      'visitor': 'VISITOR',
    };

    const normalizedUserRole = roleMapping[userRole.toLowerCase()] || userRole.toUpperCase();
    const normalizedAllowedRoles = roles.map(r => roleMapping[r.toLowerCase()] || r.toUpperCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(new ApiError(403, `Forbidden: User role '${userRole}' is not authorized to access this resource`));
    }

    next();
  };
};

export default authorize;
