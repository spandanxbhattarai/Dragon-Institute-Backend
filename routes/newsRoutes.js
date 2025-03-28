import express from 'express';
import {
  createNewsController,
  getNewsByIdController,
  getAllNewsController,
  updateNewsController,
  deleteNewsController
} from '../controllers/newsController.js';

const router = express.Router();

router.post('/', createNewsController);
router.get('/:id', getNewsByIdController);
router.get('/', getAllNewsController);
router.put('/:id', updateNewsController);
router.delete('/:id', deleteNewsController);

export default router;