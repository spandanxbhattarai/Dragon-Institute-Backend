import ContentModel from "../models/content.js";

export async function createContent(data) {
  try {
    const content = new ContentModel(data);
    return await content.save();
  } catch (error) {
    throw new Error(`Error creating content: ${error.message}`);
  }
}

export async function findContentById(id) {
  try {
    return await ContentModel.findById(id);
  } catch (error) {
    throw new Error(`Error finding content by ID: ${error.message}`);
  }
}

export async function findContents(filters = {}, options = {}) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt' 
    } = options;
    
    return await ContentModel.find(filters)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } catch (error) {
    throw new Error(`Error finding contents: ${error.message}`);
  }
}

export async function updateContent(id, data) {
  try {
    return await ContentModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  } catch (error) {
    throw new Error(`Error updating content: ${error.message}`);
  }
}

export async function deleteContent(id) {
  try {
    return await ContentModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting content: ${error.message}`);
  }
}

export async function findContentsByCategory(category, options = {}) {
  try {
    const { 
      page = 1, 
      limit = 10 
    } = options;
    
    return await ContentModel.find({ category })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } catch (error) {
    throw new Error(`Error finding contents by category: ${error.message}`);
  }
}