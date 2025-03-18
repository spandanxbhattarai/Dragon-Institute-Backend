import Announcement from '../models/announcementModel.js';

export const createAnnouncement = async (announcementData) => {
  const announcement = new Announcement(announcementData);
  return await announcement.save();
};

export const updateAnnouncement = async (id, announcementData) => {
  return await Announcement.findByIdAndUpdate(id, announcementData, { new: true });
};

export const deleteAnnouncement = async (id) => {
  const result = await Announcement.deleteOne({ _id: id });
  return result.deletedCount;
};

export const getAnnouncementById = async (id) => {
  return await Announcement.findById(id);
};

export const getAllAnnouncements = async (page, limit) => {
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
  return await paginate(Announcement, {}, options);
};

const paginate = async (model, query, options) => {
  const { page, limit } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  // Get the total number of documents
  const totalObjects = await model.countDocuments(query).exec();
  results.totalObjects = totalObjects;

  // Calculate total pages
  const totalPages = Math.ceil(totalObjects / limit);
  results.totalPages = totalPages;

  // Add pagination details
  results.pageNumber = page;
  results.pageSize = limit;

  // Add next and previous page details
  if (endIndex < totalObjects) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  // Get the paginated results
  results.results = await model.find(query).limit(limit).skip(startIndex).exec();
  return results;
};