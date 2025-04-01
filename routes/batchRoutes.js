import express from 'express';
import {
  createBatch,
  getBatch,
  getAllBatches,
  updateBatch,
  deleteBatch,
  addMeeting,
  updateMeeting,
  removeMeeting
} from '../controllers/batchController.js';

const router = express.Router();

// Batch CRUD routes
router.post('/', createBatch);
router.get('/', getAllBatches);
router.get('/:id', getBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

// Meeting management routes
router.post('/:batchId/meetings', addMeeting);
router.put('/:batchId/meetings/:meetingId', updateMeeting);
router.delete('/:batchId/meetings/:meetingId', removeMeeting);

export default router;