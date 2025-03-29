import * as repository from '../repository/announcementRepository.js';

export const createAnnouncement = async (announcementData) => {
    return await repository.createAnnouncement(announcementData);
};

export const getAnnouncement = async (id) => {
    const announcement = await repository.getAnnouncementById(id);
    if (!announcement) {
        throw new Error('Announcement not found');
    }
    return announcement;
};

export const getAllAnnouncements = async (page, limit) => {
    return await repository.getAllAnnouncements(page, limit);
};

export const updateAnnouncement = async (id, updateData) => {
    const announcement = await repository.updateAnnouncement(id, updateData);
    if (!announcement) {
        throw new Error('Announcement not found or not updated');
    }
    return announcement;
};

export const deleteAnnouncement = async (id) => {
    const announcement = await repository.deleteAnnouncement(id);
    if (!announcement) {
        throw new Error('Announcement not found or not deleted');
    }
    return announcement;
};