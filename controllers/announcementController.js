import * as announcementService from '../services/announcementService.js';

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.body);
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.updateAnnouncement(id, req.body);
    res.status(200).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await announcementService.deleteAnnouncement(id);
    res.status(200).json({message: "Announcement Deleted", deletedAnnouncementCount: deletedAnnouncement});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.getAnnouncementById(id);
    res.status(200).json(announcement);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const announcements = await announcementService.getAllAnnouncements(page, limit);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};