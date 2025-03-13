import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Rating is required']
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalHours: {
    type: Number,
    required: [true, 'Total hours is required']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required']
  },
  image: {
    type: String,
    default: 'default.jpg'
  },
  requirements: {
    type: [String],
    required: [true, 'Requirements are required']
  },
  students: {
    type: Number,
    default: 0
  },
  learningOutcomes: {
    type: [String],
    required: [true, 'Learning outcomes are required']
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings = sum / this.reviews.length;
  }
  return this.ratings;
};

const Course = mongoose.model('Course', courseSchema);

export default Course;