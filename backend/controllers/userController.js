import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Create User
// @route   POST /api/users
// @access  Private (ADMIN only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Name, email, and password are required'));
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    const allowedRoles = ['ADMIN', 'SOCIAL_MEDIA_MANAGER'];
    const finalRole = role && allowedRoles.includes(role) ? role : 'SOCIAL_MEDIA_MANAGER';

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: finalRole,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        'User created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users
// @route   GET /api/users
// @access  Private (ADMIN only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');

    res.status(200).json(
      new ApiResponse(200, users, 'Users retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private (ADMIN only)
export const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, `User not found with id of ${req.params.id}`));
    }

    const { name, email, role, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.trim().toLowerCase();
    if (role && ['ADMIN', 'SOCIAL_MEDIA_MANAGER'].includes(role)) {
      user.role = role;
    }
    if (password && password.trim().length >= 6) {
      user.password = password;
    }

    await user.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          updatedAt: user.updatedAt,
        },
        'User updated successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private (ADMIN only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, `User not found with id of ${req.params.id}`));
    }

    // Prevent admin self-deletion
    if (user._id.toString() === req.user.id.toString()) {
      return next(new ApiError(400, 'Cannot delete your own active Admin session account'));
    }

    await user.deleteOne();

    res.status(200).json(
      new ApiResponse(200, null, 'User deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
