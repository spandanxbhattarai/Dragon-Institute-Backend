import * as examService from '../services/examService.js';

// Create a new exam
export const createExam = async (req, res) => {
  try {
    const exam = await examService.createExam(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all exams (admin access)
export const getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get exam by ID
export const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await examService.getExamById(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get exams for student
export const getExamsForStudent = async (req, res) => {
  try {

    const courseEnrolled = req.user.courseEnrolled;
    const plan = req.user.plan;
    
    const exams = await examService.getExamsForStudent(courseEnrolled, plan);
    
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update exam
export const updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await examService.updateExam(examId, req.body);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete exam
export const deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await examService.deleteExam(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};