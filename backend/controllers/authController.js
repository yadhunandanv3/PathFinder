import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecretKey } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Verify duplicate emails
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    // RBAC: Role assignment handling with secret key fallback
    let finalRole = role || 'Visitor';
    if (role && role !== 'Visitor') {
      const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'pathfinder_admin_master_creation_secret_key_99';
      if (adminSecretKey && adminSecretKey !== expectedAdminKey) {
        return next(new ApiError(403, 'Invalid master secret key for privileged role'));
      }
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: finalRole,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Standard User Authentication flow from MongoDB
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Compare hashed passwords using bcryptjs
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};
