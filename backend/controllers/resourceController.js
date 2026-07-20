import Resource from '../models/Resource.js';
import Category from '../models/Category.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all resources (filtered, sorted, paginated)
// @route   GET /resources
// @access  Public
export const getResources = async (req, res, next) => {
  try {
    const { search, category, type, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by polymorphic resource type
    if (type) {
      query.type = type;
    }

    // Regex search (matches title, description, personName, or clientName)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { personName: searchRegex },
        { clientName: searchRegex },
      ];
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting overrides
    let sortBy = '-createdAt';
    if (sort) {
      sortBy = sort.split(',').join(' ');
    }

    const resources = await Resource.find(query)
      .populate('createdBy', 'name email role')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);
    const pages = Math.ceil(total / limitNum);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          resources,
          pagination: {
            page: pageNum,
            limit: limitNum,
            pages,
            total,
          },
        },
        'Resources retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single resource by ID
// @route   GET /resources/:id
// @access  Public
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!resource) {
      return next(
        new ApiError(404, `Resource not found with id of ${req.params.id}`)
      );
    }

    // Audit ConceptNote downloads
    if (req.query.download === 'true' && resource.type === 'ConceptNote') {
      resource.downloadCount = (resource.downloadCount || 0) + 1;
      await resource.save();
    }

    res
      .status(200)
      .json(new ApiResponse(200, resource, 'Resource retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resource
// @route   POST /resources
// @access  Private (Admin, Social Media Manager)
export const createResource = async (req, res, next) => {
  try {
    const { category, type } = req.body;

    const allowedTypes = [
      'ConceptNote',
      'PublicHandbook',
      'Inspiration',
      'Testimonial',
    ];
    if (!type || !allowedTypes.includes(type)) {
      return next(
        new ApiError(
          400,
          `Invalid resource type. Must be one of: ${allowedTypes.join(', ')}`
        )
      );
    }

    // Verify tag matches active category definitions
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return next(
        new ApiError(
          400,
          `Category '${category}' does not exist. Please create it first.`
        )
      );
    }

    // Bind authenticated owner identity
    req.body.createdBy = req.user.id;

    // Automatic instantiation of polymorphic discriminator models
    const resource = await Resource.create(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, resource, 'Resource created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a resource
// @route   PUT /resources/:id
// @access  Private (Admin, Social Media Manager)
export const updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(
        new ApiError(404, `Resource not found with id of ${req.params.id}`)
      );
    }

    const { category } = req.body;
    if (category) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return next(
          new ApiError(400, `Category '${category}' does not exist.`)
        );
      }
    }

    // Block modifications of immutable type keys and audits
    delete req.body.type;
    delete req.body.createdBy;

    // Save triggers schema hooks
    Object.assign(resource, req.body);
    await resource.save();

    res
      .status(200)
      .json(new ApiResponse(200, resource, 'Resource updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resource
// @route   DELETE /resources/:id
// @access  Private (Admin only)
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(
        new ApiError(404, `Resource not found with id of ${req.params.id}`)
      );
    }

    await resource.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, 'Resource deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /resources/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('createdBy', 'name');
    res
      .status(200)
      .json(
        new ApiResponse(200, categories, 'Categories retrieved successfully')
      );
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /resources/categories
// @access  Private (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(new ApiError(400, 'Category name is required'));
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return next(new ApiError(400, 'Category already exists'));
    }

    const category = await Category.create({
      name,
      createdBy: req.user.id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, category, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /resources/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }

    await category.deleteOne();
    res
      .status(200)
      .json(new ApiResponse(200, null, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};
