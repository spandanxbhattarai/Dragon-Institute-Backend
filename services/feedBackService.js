import {
    createFeedback as createFeedbackRepo,
    getFeedbacks as getFeedbacksRepo,
    getPositiveFeedbacks as getPositiveFeedbacksRepo,
    countFeedbacks as countFeedbacksRepo,
    countPositiveFeedbacks as countPositiveFeedbacksRepo
  } from '../repository/feedbackRepository.js';
  import AppError from '../utils/ErrorHandling/feedBackError.js';
  
  export const createFeedback = async (feedbackData) => {
    try {
      if (!feedbackData.name || !feedbackData.email || !feedbackData.rating || !feedbackData.feedback) {
        throw new AppError('All fields are required', 400);
      }
  
      if (feedbackData.rating < 1 || feedbackData.rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }
  
      return await createFeedbackRepo(feedbackData);
    } catch (error) {
      throw error;
    }
  };
  
  export const getFeedbacks = async (page = 1, limit = 10) => {
    try {
      if (page < 1 || limit < 1) {
        throw new AppError('Invalid pagination parameters', 400);
      }
  
      const [feedbacks, total] = await Promise.all([
        getFeedbacksRepo(page, limit),
        countFeedbacksRepo()
      ]);
  
      return {
        data: feedbacks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  };
  
  export const getPositiveFeedbacks = async (page = 1, limit = 10) => {
    try {
      if (page < 1 || limit < 1) {
        throw new AppError('Invalid pagination parameters', 400);
      }
  
      const [feedbacks, total] = await Promise.all([
        getPositiveFeedbacksRepo(page, limit),
        countPositiveFeedbacksRepo()
      ]);
  
      return {
        data: feedbacks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  };