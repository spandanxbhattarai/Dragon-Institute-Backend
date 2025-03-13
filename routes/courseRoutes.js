import express from 'express';
import * as courseController from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router.route('/:id')
  .get(courseController.getCourseById)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

router.route('/:id/reviews')
  .post(courseController.addReview);

export default router;