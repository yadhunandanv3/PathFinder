const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Pathfinder Library & Resources API',
    version: '1.0.0',
    description: 'REST API documentation for Pathfinder site Library/Resources. Supports JWT security and Role-Based Access Controls.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your JWT bearer token in the format: Bearer <Token>',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'password123' },
          role: { type: 'string', enum: ['Admin', 'Social Media Manager', 'Visitor'], example: 'Visitor' },
          adminSecretKey: { type: 'string', example: 'pathfinder_admin_master_creation_secret_key_99' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '60c72b2f9b1d8a23d8c12345' },
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@example.com' },
                  role: { type: 'string', example: 'Visitor' },
                },
              },
            },
          },
        },
      },
      CategoryResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1d8a23d8c54321' },
          name: { type: 'string', example: 'Concepts' },
          createdBy: { type: 'string', example: '60c72b2f9b1d8a23d8c12345' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ResourceBase: {
        type: 'object',
        required: ['title', 'description', 'category', 'type'],
        properties: {
          title: { type: 'string', example: 'Mental Models for 0 to 1' },
          description: { type: 'string', example: 'Strategic pathways used by start-up founders.' },
          category: { type: 'string', example: 'Concepts' },
          type: { type: 'string', enum: ['ConceptNote', 'PublicHandbook', 'Inspiration', 'Testimonial'], example: 'ConceptNote' },
          thumbnail: { type: 'string', example: 'http://localhost:5000/uploads/thumbnail.png' },
          pdf: { type: 'string', example: 'http://localhost:5000/uploads/document.pdf' },
          author: { type: 'string', example: 'Jane Author' },
        },
      },
      ConceptNoteSchema: {
        allOf: [
          { $ref: '#/components/schemas/ResourceBase' },
          {
            type: 'object',
            properties: {
              downloadCount: { type: 'integer', example: 12 },
            },
          },
        ],
      },
      PublicHandbookSchema: {
        allOf: [
          { $ref: '#/components/schemas/ResourceBase' },
          {
            type: 'object',
            properties: {
              readTimeMinutes: { type: 'integer', example: 15 },
              chapters: {
                type: 'array',
                items: { type: 'string' },
                example: ['Introduction', 'Scaling Operations', 'Fundraising Frameworks'],
              },
            },
          },
        ],
      },
      InspirationSchema: {
        allOf: [
          { $ref: '#/components/schemas/ResourceBase' },
          {
            type: 'object',
            properties: {
              personName: { type: 'string', example: 'Paul Graham' },
              roleTitle: { type: 'string', example: 'Co-founder' },
              companyName: { type: 'string', example: 'Y Combinator' },
              quote: { type: 'string', example: 'It’s better to make a few users love you than a lot of users like you.' },
              socialLink: { type: 'string', example: 'https://twitter.com/paulg' },
            },
          },
        ],
      },
      TestimonialSchema: {
        allOf: [
          { $ref: '#/components/schemas/ResourceBase' },
          {
            type: 'object',
            properties: {
              clientName: { type: 'string', example: 'Sarah Jenkins' },
              clientAvatar: { type: 'string', example: 'http://localhost:5000/uploads/avatar.png' },
              clientCompany: { type: 'string', example: 'Acme Ventures' },
              quote: { type: 'string', example: 'Pathfinder completely changed how we ran our pre-seed phase.' },
            },
          },
        ],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error description text' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Bad request validation errors',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in an existing user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          401: {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user profile',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User profile retrieved successfully' },
          401: { description: 'Unauthorized token' },
        },
      },
    },
    '/resources': {
      get: {
        summary: 'Retrieve resources Catalog',
        description: 'Browse all resources with support for searching, category tagging, polymorphic type separation, sorting, and pagination.',
        tags: ['Resources'],
        parameters: [
          { name: 'search', in: 'query', description: 'Keyword matching title/description/name', required: false, schema: { type: 'string' } },
          { name: 'category', in: 'query', description: 'Exact category name filtering', required: false, schema: { type: 'string' } },
          { name: 'type', in: 'query', description: 'Discriminator type matching', required: false, schema: { type: 'string', enum: ['ConceptNote', 'PublicHandbook', 'Inspiration', 'Testimonial'] } },
          { name: 'sort', in: 'query', description: 'Sorting criteria (e.g. createdAt, -createdAt)', required: false, schema: { type: 'string', default: '-createdAt' } },
          { name: 'page', in: 'query', description: 'Page index', required: false, schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Page items count', required: false, schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        resources: { type: 'array', items: { type: 'object' } },
                        pagination: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new resource',
        description: 'Adds a polymorphic resource. Supported roles: Admin, Social Media Manager.',
        tags: ['Resources'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/ConceptNoteSchema' },
                  { $ref: '#/components/schemas/PublicHandbookSchema' },
                  { $ref: '#/components/schemas/InspirationSchema' },
                  { $ref: '#/components/schemas/TestimonialSchema' },
                ],
              },
            },
          },
        },
        responses: {
          201: { description: 'Resource created successfully' },
          400: { description: 'Bad validation fields or missing category' },
          401: { description: 'Not authorized' },
          403: { description: 'Insufficient permissions' },
        },
      },
    },
    '/resources/{id}': {
      get: {
        summary: 'Get resource details',
        description: 'Fetch complete metadata of a single resource. Add query `download=true` to increment ConceptNote download counts.',
        tags: ['Resources'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'download', in: 'query', description: 'Set true to trigger download logs', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Success' },
          404: { description: 'Resource not found' },
        },
      },
      put: {
        summary: 'Update a resource',
        description: 'Edits resource fields. Supported roles: Admin, Social Media Manager.',
        tags: ['Resources'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResourceBase' },
            },
          },
        },
        responses: {
          200: { description: 'Success' },
          401: { description: 'Unauthorized' },
          404: { description: 'Resource not found' },
        },
      },
      delete: {
        summary: 'Delete a resource',
        description: 'Removes resource from the catalog. Restricted to Admin role only.',
        tags: ['Resources'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Resource deleted successfully' },
          401: { description: 'Unauthorized' },
          403: { description: 'Permission forbidden (SMM/Visitor)' },
          404: { description: 'Resource not found' },
        },
      },
    },
    '/resources/categories': {
      get: {
        summary: 'List all categories',
        tags: ['Categories'],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/CategoryResponse' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new category',
        description: 'Saves category lookup options. Admin role only.',
        tags: ['Categories'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: { name: { type: 'string', example: 'Concepts' } },
              },
            },
          },
        },
        responses: {
          201: { description: 'Created successfully' },
          400: { description: 'Category name required or duplicated' },
          403: { description: 'Insufficient permissions' },
        },
      },
    },
    '/resources/categories/{id}': {
      delete: {
        summary: 'Delete a category',
        description: 'Removes category options. Admin role only.',
        tags: ['Categories'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Category deleted successfully' },
          403: { description: 'Insufficient permissions' },
          404: { description: 'Category not found' },
        },
      },
    },
    '/upload': {
      post: {
        summary: 'Upload image or PDF',
        description: 'Receives multipart/form-data file and routes to local disk or Base64 conversion based on settings.',
        tags: ['Uploads'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary', description: 'PDF or Image file' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Upload success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        fileUrl: { type: 'string', example: 'http://localhost:5000/uploads/162391039-file.pdf' },
                        filename: { type: 'string', example: '162391039-file.pdf' },
                        mimetype: { type: 'string', example: 'application/pdf' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Missing file or invalid mimetype' },
          403: { description: 'Forbidden uploads (Visitors)' },
        },
      },
    },
  },
};

export default swaggerDocument;
