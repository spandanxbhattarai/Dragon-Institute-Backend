import express from 'express';
import * as examController from '../controllers/examController.js';

const router = express.Router();

// Create exam
router.post('/', examController.createExam);

// Get exams by multiple IDs
router.post('/by-ids', examController.getExamsByIds);

// Get exams by batch ID with pagination
router.get('/batch/:batchId', examController.getExamsByBatch);

// Get all exams with pagination
router.get('/', examController.getPaginatedExams);

// Update an exam
router.put('/:examId', examController.updateExam);

// Delete an exam
router.delete('/:examId', examController.deleteExam);



export default router;