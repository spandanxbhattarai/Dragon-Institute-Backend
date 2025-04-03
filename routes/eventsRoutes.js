import express from 'express';
import * as controller from '../controllers/eventsController.js';

const router = express.Router();

router.post('/', controller.createEvent);
router.get('/', controller.getAllEvents);
router.get('/get/byMonthAndYear', controller.getByMonthAndYear)
router.get('/:id', controller.getEvent);
router.put('/:id', controller.updateEvent);
router.delete('/:id', controller.deleteEvent);

export default router;