import express from 'express';
import {
  createSubscriber,
  listSubscribers,
  deleteSubscriber,
  getSubscriberWithName
} from '../controllers/subscriberController.js';

const router = express.Router();

router.post('/', createSubscriber);
router.get('/', listSubscribers);
router.get('/getUser/:email', getSubscriberWithName);

router.delete('/:email', deleteSubscriber);

export default router;