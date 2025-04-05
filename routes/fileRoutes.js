import express from 'express';
import { uploadFile, deleteFile, upload } from '../controllers/fileController.js';

const router = express.Router();

// Upload single file
router.post('/upload', upload.single('file'), uploadFile);

// Delete file by public_id
router.delete('/delete/:public_id', deleteFile);

export default router;