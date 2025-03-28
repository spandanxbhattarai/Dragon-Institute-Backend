import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const examsAttendedSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'user'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['verified', 'unverified'],
    default: 'unverified'
  },
  courseEnrolled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
  citizenshipImageUrl: {
    type: String,
    required: true
  },

  plan: {
    type: String,
    enum: ['full', 'half', 'free' ],
    required: true
  },
  examsAttended: [examsAttendedSchema  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});





// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;