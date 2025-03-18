import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  additionalDetails: { type: mongoose.Schema.Types.Mixed }, // Extra fields for more information
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;