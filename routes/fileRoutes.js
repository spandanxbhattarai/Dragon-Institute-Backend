
// routes/fileRoutes.js
import express from 'express';
import { uploadFile, deleteFile, upload } from '../controllers/fileController.js';
import { authenticateToken, isUser, isBoth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Upload single file
router.post('/upload', authenticateToken, isUser, upload.single('file'), uploadFile);

// Delete file by public_id
router.delete('/delete/:public_id', authenticateToken, isBoth, deleteFile);

export default router;