import * as ContentService from '../services/contentService.js';

// Create new content
export async function createContent(req, res) {
  try {
    const content = await ContentService.createContent(req.body);
    res.status(201).json({
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    res.status(400).json({
      message: 'Content creation failed',
      error: error.message
    });
  }
}

// Get content by ID
export async function getContentById(req, res) {
  try {
    const content = await ContentService.getContentById(req.params.id);
    res.status(200).json(content);
  } catch (error) {
    res.status(404).json({
      message: 'Content not found',
      error: error.message
    });
  }
}

// Get contents with optional filtering and pagination
export async function getContents(req, res) {
  try {
    const { 
      category, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt' 
    } = req.query;

    const filters = category ? { category } : {};
    const contents = await ContentService.getContents(filters, { 
      page: Number(page), 
      limit: Number(limit), 
      sortBy: String(sortBy) 
    });

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total: contents.length,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve contents',
      error: error.message
    });
  }
}

// Get contents by category
export async function getContentsByCategory(req, res) {
  try {
    const { page = 1, limit = 10 , category} = req.query;
 
    const contents = await ContentService.getContentsByCategory(
      category,
      { page: Number(page), limit: Number(limit) }
    );

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total: contents.length,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve contents by category',
      error: error.message
    });
  }
}

// Get latest contents
export async function getLatestContents(req, res) {
  try {
    const { limit = 5 } = req.query;
    const contents = await ContentService.getLatestContents(Number(limit));
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve latest contents',
      error: error.message
    });
  }
}

// Update content
export async function updateContent(req, res) {
  try {
    const content = await ContentService.updateContent(req.params.id, req.body);
    res.status(200).json({
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    res.status(400).json({
      message: 'Content update failed',
      error: error.message
    });
  }
}

// Delete content
export async function deleteContent(req, res) {
  try {
    await ContentService.deleteContent(req.params.id);
    res.status(200).json({
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      message: 'Content deletion failed',
      error: error.message
    });
  }
}