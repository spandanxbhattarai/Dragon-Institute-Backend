import express from 'express';
import * as examController from '../controllers/examController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import {authenticateToken} from "../middlewares/authMiddleware.js"

const router = express.Router();

// Admin/Teacher routes (requires authentication)
router.post('/', authenticateToken, isAdmin, examController.createExam);
router.get('/all', authenticateToken, isAdmin, examController.getAllExams);
router.put('/:examId', authenticateToken, isAdmin, examController.updateExam);
router.delete('/:examId', authenticateToken, isAdmin, examController.deleteExam);

// Student routes
router.get('/', authenticate, examController.getExamsForStudent);
router.get('/:examId', authenticate, examController.getExamById);

export default router;