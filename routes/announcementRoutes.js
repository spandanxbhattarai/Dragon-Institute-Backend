import express from 'express';
import * as controller from '../controllers/announcementController.js';

const router = express.Router();

router.post('/', controller.createAnnouncement);
router.get('/', controller.getAllAnnouncements);
router.get('/:id', controller.getAnnouncement);
router.put('/:id', controller.updateAnnouncement);
router.delete('/:id', controller.deleteAnnouncement);

export default router;