import express from 'express';
import * as questionSheetController from '../controllers/questionSheetController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authenticateToken, isAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, isAdmin,questionSheetController.getAllQuestionSheets);
router.get('/:id', authenticateToken, isUser, questionSheetController.getQuestionSheetById);
router.post('/', authenticateToken, isAdmin, questionSheetController.createQuestionSheet);
router.put('/:id',authenticateToken, isAdmin, questionSheetController.updateQuestionSheet);
router.delete('/:id',authenticateToken, isAdmin, questionSheetController.deleteQuestionSheet);
router.post('/:questionSheetId/submit', authenticate, questionSheetController.submitAnswers);

export default router;