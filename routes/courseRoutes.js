import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { authenticateToken, isAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(courseController.getAllCourses)
  .post(authenticateToken, isAdmin, courseController.createCourse);

router.route('/:id')
  .get(courseController.getCourseById)
  .patch(authenticateToken, isAdmin, courseController.updateCourse)
  .delete(authenticateToken, isAdmin, courseController.deleteCourse);

router.route('/:id/reviews')
  .post(authenticateToken, isUser, courseController.addReview);

export default router;