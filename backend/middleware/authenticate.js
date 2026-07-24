import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';

export const authenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization ? req.headers.authorization.trim() : '';

  // Read Bearer token case-insensitively
  if (authHeader && /^bearer\s+/i.test(authHeader)) {
    token = authHeader.split(/\s+/)[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Unauthorized: No token provided'));
  }

  try {
    // Verify JWT payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pathfinder_master_jwt_secret_key_2026_super_secure');

    // Load active user record from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'Unauthorized: User associated with token no longer exists'));
    }

    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role ? user.role.toUpperCase() : 'SOCIAL_MEDIA_MANAGER',
    };

    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
  }
};

export default authenticate;
