import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getPositiveFeedbacks,
  deleteFeedback
} from '../controllers/feedBackController.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.get('/positive', getPositiveFeedbacks);
router.delete('/:id', deleteFeedback);


export default router;