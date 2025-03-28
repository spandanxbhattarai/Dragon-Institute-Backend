import * as repository from '../repository/eventsRepository.js';

export const createEvent = async (eventData) => {
  return await repository.createEvent(eventData);
};

export const getEvent = async (id) => {
  const event = await repository.getEventById(id);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

export const getAllEvents = async (page, limit) => {
  return await repository.getAllEvents(page, limit);
};

export const updateEvent = async (id, updateData) => {
  const event = await repository.updateEvent(id, updateData);
  if (!event) {
    throw new Error('Event not found or not updated');
  }
  return event;
};

export const deleteEvent = async (id) => {
  const event = await repository.deleteEvent(id);
  if (!event) {
    throw new Error('Event not found or not deleted');
  }
  return event;
};