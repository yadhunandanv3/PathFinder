import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type', // Mongoose type indicator
  collection: 'resources',  // Force all types into a single collection
  timestamps: true,
};

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    thumbnail: {
      type: String, // Path or Base64 URI
    },
    pdf: {
      type: String, // Path or Base64 URI
    },
    author: {
      type: String, // Optional author signature
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  baseOptions
);

// Base Model
const Resource = mongoose.model('Resource', resourceSchema);

// 1. Concept Note Discriminator
export const ConceptNote = Resource.discriminator(
  'ConceptNote',
  new mongoose.Schema({
    downloadCount: {
      type: Number,
      default: 0,
    },
  })
);

// 2. Public Handbook Discriminator
export const PublicHandbook = Resource.discriminator(
  'PublicHandbook',
  new mongoose.Schema({
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    chapters: {
      type: [String],
      default: [],
    },
  })
);

// 3. Inspiration Discriminator
export const Inspiration = Resource.discriminator(
  'Inspiration',
  new mongoose.Schema({
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
    },
    roleTitle: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      trim: true,
    },
    socialLink: {
      type: String,
      trim: true,
    },
  })
);

// 4. Testimonial Discriminator
export const Testimonial = Resource.discriminator(
  'Testimonial',
  new mongoose.Schema({
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientAvatar: {
      type: String, // Client avatar URL or Base64
    },
    clientCompany: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      required: [true, 'Testimonial quote is required'],
      trim: true,
    },
  })
);

export default Resource;
