import mongoose from 'mongoose';


const learningFormatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Format name is required']
  },
  description: {
    type: String,
    required: [true, 'Format description is required']
  }
}, { _id: false });

const curriculumItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Curriculum item title is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
    unique: true
  },
  image:{
    type: String,
    required: true,
  },
  description: {
    type: [String],
    required: [true, 'Description is required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(item => item.length > 0);
      },
      message: 'Description must contain at least one paragraph'
    }
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
    min: [0, 'Students enrolled cannot be negative']
  },
  teachersCount: {
    type: Number,
    required: [true, 'Teachers count is required'],
    min: [1, 'There must be at least one teacher'],
    default: 1
  },
  courseHighlights: {
    type: [String],
    required: [true, 'Course highlights are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one course highlight is required'
    }
  },
  overallHours: {
    type: Number,
    required: [true, 'Overall hours are required'],
    min: [1, 'Course must be at least 1 hour long']
  },
  moduleLeader: {
    type: String,
    required: [true, 'Module leader is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  learningFormat: {
    type: [learningFormatSchema],
    required: [true, 'Learning format is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one learning format is required'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  curriculum: {
    type: [curriculumItemSchema],
    required: [true, 'Curriculum is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one curriculum item is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating whenever reviews are updated
courseSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.overallRating = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.overallRating = parseFloat((sum / this.reviews.length).toFixed(1));
};

// Update students enrolled count
courseSchema.methods.updateEnrollment = function(count) {
  this.studentsEnrolled = count;
};

// Middleware to update timestamp on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;