import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  // Eligible student plans
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
  // Eligible courses
  eligibleCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  questionSheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionSheet',
    required: true
  }
}, { timestamps: true });

export const Exam = mongoose.model('Exam', examSchema);