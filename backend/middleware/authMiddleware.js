import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization ? req.headers.authorization.trim() : '';

  // Read Bearer token case-insensitively and handle variable spacing
  if (authHeader && /^bearer\s+/i.test(authHeader)) {
    token = authHeader.split(/\s+/)[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // Decrypt and verify signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load active database record
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ApiError(401, 'User associated with this token no longer exists'));
    }

    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
};

// Check role clearances with normalized role comparison
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(500, 'Authorization guard applied before protect handler'));
    }

    const userRole = req.user.role;
    const normalizedUserRole = (userRole === 'SMM' || userRole === 'Social Media Manager') ? 'Social Media Manager' : userRole;
    
    const allowedRoles = roles.map(r => (r === 'SMM' || r === 'Social Media Manager') ? 'Social Media Manager' : r);

    if (!allowedRoles.includes(normalizedUserRole)) {
      return next(new ApiError(403, `User role '${userRole}' is not authorized to perform this operation`));
    }
    next();
  };
};
