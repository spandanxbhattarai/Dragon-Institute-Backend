import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(v) {
        return v > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  eligiblePlans: {
    fullPlan: {
      type: Boolean,
      default: false
    },
    halfPayment: {
      type: Boolean,
      default: false
    },
    freePlan: {
      type: Boolean,
      default: false
    }
  },
  eligibleCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  questionSheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionSheet',
    required: [true, 'Question sheet is required']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Optimized compound index for getExamsForStudent
examSchema.index({
  eligibleCourses: 1,
  'eligiblePlans.fullPlan': 1,
  'eligiblePlans.halfPayment': 1,
  'eligiblePlans.freePlan': 1,
  endTime: -1,
  startTime: 1
});

// Secondary index for general queries
examSchema.index({ startTime: 1 });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;