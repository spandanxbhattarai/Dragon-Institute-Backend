import express from 'express';
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAllAnnouncements,
} from '../controllers/announcementController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, isAdmin, createAnnouncement);
router.put('/:id', authenticateToken, isAdmin, updateAnnouncement);
router.delete('/:id',authenticateToken, isAdmin, deleteAnnouncement);
router.get('/:id', getAnnouncementById);
router.get('/', getAllAnnouncements);

export default router;