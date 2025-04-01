import mongoose from 'mongoose';

const scheduledMeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  meeting_link: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  expiryTime: { type: Date, required: true },
  duration_minutes: { type: Number, required: true }
}, { timestamps: true });

const batchSchema = new mongoose.Schema({
  batch_name: { type: String, required: true },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  scheduled_meetings: [scheduledMeetingSchema],
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);