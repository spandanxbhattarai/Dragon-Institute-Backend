import * as examRepository from '../repository/examRepository.js';
import moment from 'moment-timezone';

// Create a new exam
export const createExam = async (examData) => {
  try {
    // Validate times
    if (new Date(examData.endTime) <= new Date(examData.startTime)) {
      throw new Error('End time must be after start time');
    }
    
    // Create the exam
    const exam = await examRepository.createExam(examData);
    return exam;
  } catch (error) {
    throw error;
  }
};

// Get all exams
export const getAllExams = async () => {
  try {
    return await examRepository.getAllExams();
  } catch (error) {
    throw error;
  }
};

// Get exam by ID
export const getExamById = async (examId) => {
  try {
    return await examRepository.getExamById(examId);
  } catch (error) {
    throw error;
  }
};

// Get exams for student based on JWT token
export const getExamsForStudent = async (courseEnrolled, plan) => {
  try {
    const currentTime = moment().tz('Asia/Kathmandu').toDate();
    
    // Get eligible exams for student
    let exams = await examRepository.getExamsForStudent(courseEnrolled, plan, currentTime);

    
    // Process exams to hide question sheet IDs if needed
    exams = exams.map(exam => {
      
      // Hide question sheet if exam has not started yet
      if (new Date(exam.startTime) > currentTime) {
        delete exam.questionSheet;
      }
      
      return exam;
    });
    
    return exams;
  } catch (error) {
    throw error;
  }
};

// Update exam
export const updateExam = async (examId, updateData) => {
  try {
    // Validate that user is the creator of this exam
    const exam = await examRepository.getExamById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }
    
    
    // Update the exam
    return await examRepository.updateExam(examId, updateData);
  } catch (error) {
    throw error;
  }
};

// Delete exam
export const deleteExam = async (examId) => {
  try {
    // Validate that user is the creator of this exam
    const exam = await examRepository.getExamById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }
    
    if (exam.createdBy.toString() !== userId) {
      throw new Error('Unauthorized to delete this exam');
    }
    
    // Delete the exam
    return await examRepository.deleteExam(examId);
  } catch (error) {
    throw error;
  }
};