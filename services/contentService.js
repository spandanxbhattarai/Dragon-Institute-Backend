import ContentModel from '../models/content.js';
import * as ContentRepository from '../repository/contentRepository.js';
import { ContentType } from '../models/content.js';

// Error factory functions
const createError = (name, message, statusCode) => {
  const error = new Error(message);
  error.name = name;
  error.statusCode = statusCode;
  return error;
};

const validationError = (message) => createError('ValidationError', message, 400);
const notFoundError = (message) => createError('NotFoundError', message, 404);
const databaseError = (message) => createError('DatabaseError', message, 500);

// Helper function for enum validation
const validateEnum = (value, enumObject, fieldName) => {
  if (!Object.values(enumObject).includes(value)) {
    throw validationError(
      `Invalid ${fieldName}. Must be one of: ${Object.values(enumObject).join(', ')}`
    );
  }
};

// Content Service Functions
export const createContent = async (data) => {
  try {
    // Validate required fields
    if (!data?.title || !data?.category) {
      throw validationError('Title and category are required fields');
    }

    validateEnum(data.category, ContentType, 'content type');

    // Validate execution date if provided
    if (data.executionDate && new Date(data.executionDate) <= new Date()) {
      throw validationError('Execution date must be in the future');
    }

    return await ContentRepository.createContent(data);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to create content: ${error.message}`);
  }
};

export const getContentById = async (id) => {
  try {
    if (!id) {
      throw validationError('Content ID is required');
    }

    const content = await ContentRepository.findContentById(id);
    if (!content) {
      throw notFoundError(`Content with ID ${id} not found`);
    }
    return content;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to retrieve content: ${error.message}`);
  }
};

export const getContents = async (filters = {}, options = {}) => {
  try {
    // Validate pagination parameters
    if (options.page && isNaN(options.page)) {
      throw validationError('Page must be a number');
    }
    if (options.limit && isNaN(options.limit)) {
      throw validationError('Limit must be a number');
    }

    const contents = await ContentRepository.findContents(filters, {
      page: options.page || 1,
      limit: options.limit || 10,
      sortBy: options.sortBy || 'createdAt'
    });

    if (!contents?.length) {
      throw notFoundError('No contents found matching the criteria');
    }

    return contents;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to fetch contents: ${error.message}`);
  }
};

export const getLatestContents = async (limit = 5) => {
  try {
    if (isNaN(limit)) {
      throw validationError('Limit must be a number');
    }

    const contents = await ContentRepository.findContents({}, {
      page: 1,
      limit: Number(limit),
      sortBy: 'createdAt'
    });

    if (!contents?.length) {
      throw notFoundError('No latest contents found');
    }

    return contents;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to fetch latest contents: ${error.message}`);
  }
};

export const updateContent = async (id, data) => {
  try {
    if (!id) {
      throw validationError('Content ID is required for update');
    }

    // Verify content exists
    await getContentById(id);

    if (data.category) {
      validateEnum(data.category, ContentType, 'content type');
    }

    const updatedContent = await ContentRepository.updateContent(id, {
      ...data,
      updatedAt: new Date()
    });

    if (!updatedContent) {
      throw databaseError('Failed to update content');
    }

    return updatedContent;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to update content: ${error.message}`);
  }
};

export const deleteContent = async (id) => {
  try {
    if (!id) {
      throw validationError('Content ID is required for deletion');
    }

    // Verify content exists
    await getContentById(id);

    const result = await ContentRepository.deleteContent(id);
    if (!result) {
      throw databaseError('Failed to delete content');
    }

    return result;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to delete content: ${error.message}`);
  }
};

export const getContentsByCategory = async (category, options = {}) => {
  try {
    if (!category) {
      throw validationError('Category is required');
    }

    validateEnum(category, ContentType, 'category');

    const contents = await ContentRepository.findContents(
      { category },
      {
        page: options.page || 1,
        limit: options.limit || 10,
        sortBy: 'createdAt'
      }
    );

    if (!contents?.length) {
      throw notFoundError(`No contents found in category ${category}`);
    }

    return contents;
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      throw error;
    }
    throw databaseError(`Failed to fetch contents by category: ${error.message}`);
  }
};