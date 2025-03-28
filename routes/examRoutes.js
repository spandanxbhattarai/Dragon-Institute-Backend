import express from 'express';
import * as examController from '../controllers/examController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import {authenticateToken} from "../middlewares/authMiddleware.js"
import Exam from '../models/exams.js';
import mongoose from 'mongoose';
import moment from 'moment';

const router = express.Router();

// Admin/Teacher routes (requires authentication)
router.post('/', authenticateToken, isAdmin, examController.createExam);
router.get('/all', authenticateToken, isAdmin, examController.getAllExams);
router.put('/:examId', authenticateToken, isAdmin, examController.updateExam);
router.delete('/:examId', authenticateToken, isAdmin, examController.deleteExam);
router.post('/seed', async (req, res) => {
    try {
      const { count = 2000 } = req.body;
      const courseId = new mongoose.Types.ObjectId();
      const questionSheetId = new mongoose.Types.ObjectId();
      
      const exams = [];
      const now = new Date();
      
      for (let i = 0; i < count; i++) {
        const startTime = moment(now).add(i % 365, 'days').toDate();
        const endTime = moment(startTime).add(2, 'hours').toDate();
        
        exams.push({
          title: `Exam ${i + 1}`,
          description: `Test exam #${i + 1}`,
          startTime,
          endTime,
          eligiblePlans: {
            fullPlan: i % 2 === 0,
            halfPayment: i % 3 === 0,
            freePlan: i % 5 === 0
          },
          eligibleCourses: [courseId],
          questionSheet: questionSheetId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Batch insert every 100 records
        if (i % 100 === 0 && exams.length > 0) {
          await Exam.insertMany(exams);
          exams.length = 0; // Clear array
        }
      }
      
      // Insert remaining exams
      if (exams.length > 0) {
        await Exam.insertMany(exams);
      }
      
      res.json({
        success: true,
        message: `Successfully seeded ${count} exams`
      });
    } catch (error) {
      console.error('Seeding failed:', error);
      res.status(500).json({
        success: false,
        message: 'Seeding failed',
        error: error.message
      });
    }
  });

// Student routes
router.get('/', authenticate, examController.getExamsForStudent);
router.get('/:examId', authenticate, examController.getExamById);

export default router;