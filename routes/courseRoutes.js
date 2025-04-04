import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { authenticateToken, isAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(courseController.getAllCoursesFullDetails)
  .post( courseController.createCourse);

router.route('/summary')
   .get(courseController.getAllCoursesSummary);

router.route('/getById/:id')
   .get(courseController.getCourseById);

router.route('/:id')
  .patch(authenticateToken, isAdmin, courseController.updateCourse)
  .delete(authenticateToken, isAdmin, courseController.deleteCourse);

router.route('/:id/reviews')
  .post(authenticateToken, isUser, courseController.addReview);

export default router;