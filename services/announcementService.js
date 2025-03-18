import * as announcementRepository from '../repository/announcementRepository.js';

export const createAnnouncement = async (announcementData) => {
  return await announcementRepository.createAnnouncement(announcementData);
};

export const updateAnnouncement = async (id, announcementData) => {
  return await announcementRepository.updateAnnouncement(id, announcementData);
};

export const deleteAnnouncement = async (id) => {
  return await announcementRepository.deleteAnnouncement(id);
};

export const getAnnouncementById = async (id) => {
  return await announcementRepository.getAnnouncementById(id);
};

export const getAllAnnouncements = async (page, limit) => {
  return await announcementRepository.getAllAnnouncements(page, limit);
};