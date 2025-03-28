import EventModel from '../models/eventsModel.js';

export const createEvent = async (eventData) => {
  const event = new EventModel(eventData);
  return await event.save();
};

export const getEventById = async (id) => {
  return await EventModel.findById(id);
};

export const getAllEvents = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await EventModel.find()
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);
};

export const updateEvent = async (id, updateData) => {
  return await EventModel.findByIdAndUpdate(id, updateData, { 
    new: true, 
    runValidators: true 
  });
};

export const deleteEvent = async (id) => {
  return await EventModel.findByIdAndDelete(id);
};