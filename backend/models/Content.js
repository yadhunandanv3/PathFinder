import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['CONCEPT_NOTE', 'PUBLIC_HANDBOOK', 'INSPIRATION', 'TESTIMONIAL'],
      required: [true, 'ContentType is required'],
    },
    image: {
      type: String,
      default: '',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    chapters: [
      {
        type: String,
      },
    ],
    personName: {
      type: String,
      default: '',
    },
    roleTitle: {
      type: String,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      default: '',
    },
    socialLink: {
      type: String,
      default: '',
    },
    clientName: {
      type: String,
      default: '',
    },
    clientCompany: {
      type: String,
      default: '',
    },
    clientAvatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'PUBLISHED',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
