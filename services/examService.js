import * as examRepository from '../repository/examRepository.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';

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

export const getExamsByBatch = async (batchId, page, limit, userId) => {
    if (page <= 0 || limit <= 0) {
        throw new ValidationError('Page and limit must be positive numbers');
    }
    
    return await examRepository.getExamsByBatch(batchId, page, limit, userId);
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