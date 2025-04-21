import * as examRepository from '../repository/examRepository.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';
import User from '../models/user.js';

export const createExam = async (examData) => {
    if (!examData.batches || examData.batches.length === 0) {
        throw new ValidationError('At least one batch must be specified');
    }

    return await examRepository.createExam(examData);
};

export const getExamsByIds = async (examIds) => {
    if (!examIds || !Array.isArray(examIds) || examIds.length === 0) {
        throw new ValidationError('Please provide valid exam IDs');
    }
    
    const exams = await examRepository.findExamsByIds(examIds);
    
    if (exams.length === 0) {
        throw new NotFoundError('No exams found with the provided IDs');
    }
    
    return exams;
};

export const getExamsByBatch = async (batchId, page, limit, userId, status) => {
    if (page <= 0 || limit <= 0) {
        throw new ValidationError('Page and limit must be positive numbers');
    }

    if(status === "upComming"){
        return await examRepository.getUpcomingExamsByBatch(batchId, page, limit, userId);

    } else if(status==="current") {
        return await examRepository.getCurrentExamsByBatch(batchId, page, limit, userId);

    } else {
        throw new Error("Valid Status is required")
    }
    
    
};

export const getPaginatedExams = async (page, limit) => {
    if (page <= 0 || limit <= 0) {
        throw new ValidationError('Page and limit must be positive numbers');
    }
    
    return await examRepository.getAllExamsPaginated(page, limit);
};

export const updateExam = async (examId, updateData) => {
    if (!examId) {
        throw new ValidationError('Exam ID is required');
    }
    
    return await examRepository.updateExamById(examId, updateData);
};

export const deleteExam = async (examId) => {
    if (!examId) {
        throw new ValidationError('Exam ID is required');
    }
    
    return await examRepository.deleteExamById(examId);
};

// Common utility function for user and batch validation 
export const validateUserBatch = async (userId, batchId) => {
    if (!userId) return null;
  
    const user = await User.findById(userId);
    if (user && user.batch && user.batch.toString() !== batchId.toString()) {
      throw new Error("User doesn't belong to the specified batch");
    }
    return user;
  };
  
  // Common function to get attended exam IDs
export const getAttendedExamIds = (user) => {
    return user?.examsAttended?.map(e => e.examId.toString()) || [];
  };
  
  // Common function to process exams
export const processExams = (exams, status, user = null, attendedExamIds = []) => {
    return exams.map(exam => {
      const examObj = exam.toObject ? exam.toObject() : {...exam};
      examObj.status = status;
  
      // Hide question_sheet_id if:
      // 1. No user is specified, OR
      // 2. User has already attended this exam
      // 3. For upcoming exams (handled in the query)
      if (status === "active" && (!user || attendedExamIds.includes(exam._id.toString()))) {
        examObj.question_sheet_id = undefined;
      }
  
      return examObj;
    });
  };
  