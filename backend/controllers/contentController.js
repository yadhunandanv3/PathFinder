import Content from '../models/Content.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Create new Content
// @route   POST /api/content
// @access  Private (ADMIN, SOCIAL_MEDIA_MANAGER)
export const createContent = async (req, res, next) => {
  try {
    const { title, description, contentType } = req.body;

    if (!title || !description || !contentType) {
      return next(new ApiError(400, 'Title, description, and contentType are required'));
    }

    const allowedTypes = ['CONCEPT_NOTE', 'PUBLIC_HANDBOOK', 'INSPIRATION', 'TESTIMONIAL'];
    if (!allowedTypes.includes(contentType)) {
      return next(new ApiError(400, `Invalid contentType. Must be one of: ${allowedTypes.join(', ')}`));
    }

    // Attach creator identity
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

    const content = await Content.create(req.body);

    res.status(201).json(
      new ApiResponse(201, content, 'Content created successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Content (filtered, sorted, paginated)
// @route   GET /api/content
// @access  Public / Staff (ADMIN, SOCIAL_MEDIA_MANAGER)
export const getAllContent = async (req, res, next) => {
  try {
    const { search, category, contentType, type, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    const typeFilter = contentType || type;
    if (typeFilter) {
      // Map both camelCase and uppercase enums to database values
      const typeMapping = {
        'ConceptNote': 'CONCEPT_NOTE',
        'PublicHandbook': 'PUBLIC_HANDBOOK',
        'Inspiration': 'INSPIRATION',
        'Testimonial': 'TESTIMONIAL',
        'concept_note': 'CONCEPT_NOTE',
        'public_handbook': 'PUBLIC_HANDBOOK',
        'inspiration': 'INSPIRATION',
        'testimonial': 'TESTIMONIAL',
      };
      
      const normalizedType = typeMapping[typeFilter] || typeFilter.toUpperCase();
      query.contentType = normalizedType;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { personName: searchRegex },
        { clientName: searchRegex },
        { quote: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const contentList = await Content.find(query)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Content.countDocuments(query);
    const pages = Math.ceil(total / limitNum) || 1;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          resources: contentList,
          content: contentList,
          pagination: {
            page: pageNum,
            limit: limitNum,
            pages,
            total,
          },
        },
        'Content items retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Content by ID
// @route   GET /api/content/:id
// @access  Public / Staff (ADMIN, SOCIAL_MEDIA_MANAGER)
export const getContentById = async (req, res, next) => {
  try {
    const { download } = req.query;

    let content;
    if (download === 'true') {
      content = await Content.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      )
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');
    } else {
      content = await Content.findById(req.params.id)
        .populate('createdBy', 'name email role')
        .populate('updatedBy', 'name email role');
    }

    if (!content) {
      return next(new ApiError(404, `Content not found with id of ${req.params.id}`));
    }

    res.status(200).json(
      new ApiResponse(200, content, 'Content retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update Content
// @route   PUT /api/content/:id
// @access  Private (ADMIN, SOCIAL_MEDIA_MANAGER)
export const updateContent = async (req, res, next) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return next(new ApiError(404, `Content not found with id of ${req.params.id}`));
    }

    // Automatically update updatedBy to active user
    req.body.updatedBy = req.user.id;
    delete req.body.createdBy;

    Object.assign(content, req.body);
    await content.save();

    res.status(200).json(
      new ApiResponse(200, content, 'Content updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Content
// @route   DELETE /api/content/:id
// @access  Private (ADMIN only)
export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return next(new ApiError(404, `Content not found with id of ${req.params.id}`));
    }

    await content.deleteOne();

    res.status(200).json(
      new ApiResponse(200, null, 'Content deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
