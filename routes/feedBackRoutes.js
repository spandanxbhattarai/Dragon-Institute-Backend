import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getPositiveFeedbacks
} from '../controllers/feedBackController.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.get('/positive', getPositiveFeedbacks);

export default router;