import express from 'express';
import * as questionSheetController from '../controllers/questionSheetController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', questionSheetController.getAllQuestionSheets);
router.get('/:id', questionSheetController.getQuestionSheetById);
router.post('/', questionSheetController.createQuestionSheet);
router.put('/:id', questionSheetController.updateQuestionSheet);
router.delete('/:id', questionSheetController.deleteQuestionSheet);
router.post('/:questionSheetId/submit', authenticate, questionSheetController.submitAnswers);

export default router;