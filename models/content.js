import mongoose from 'mongoose';

// Enum for content types
export const ContentType = {
  EVENT: 'event',
  NEWS: 'news',
  ANNOUNCEMENT: 'announcement'
};

// Main Schema
const ContentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(ContentType)
  },
  subCategory: {
    type: String,
    trim: true
  },

  // Execution and Timing
  executionDate: {
    type: Date,
    required: true
  },
  expirationDate: {
    type: Date
  },

  // Content Details
  content: [{
    type: String,
    trim: true,
    required: true
  }],

  // Additional Metadata
  author: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    enum: ['online', 'offline', 'hybrid']
  },

  // Resource Materials
  resourceMaterials: [{
    materialName: {
      type: String,
      trim: true
    },
    fileType: {
      type: String,
      trim: true
    },
    fileSize: Number,
    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  }],

  // Sub-Information
  subInformation: [{
    title: {
      type: String,
      trim: true
    },
    bulletPoints: [{
      type: String,
      trim: true
    }],
    description: {
      type: String,
      trim: true
    }
  }],

  // Call to Action (Optional)
  cta: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true
      },
      imageUrl: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      buttons: [{
        buttonName: {
          type: String,
          trim: true
        },
        href: {
          type: String,
          trim: true
        }
      }]
    }, { _id: false }),
    default: undefined
  },

  // Importance and Visibility
  isImportant: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const ContentModel = mongoose.model('Content', ContentSchema);

export default ContentModel;
