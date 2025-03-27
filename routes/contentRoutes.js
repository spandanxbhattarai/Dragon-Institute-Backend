import express from 'express';
import * as ContentController from '../controllers/contentController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create new content
router.post('/', authenticateToken, isAdmin, ContentController.createContent);

// Get contents with optional filtering and pagination
router.get('/', ContentController.getContents);

// Get contents by category
router.get('/category/content', ContentController.getContentsByCategory);

// Get latest contents
router.get('/latest/content', ContentController.getLatestContents);

// Get content by ID
router.get('/:id', ContentController.getContentById);

// Update content
router.put('/:id', authenticateToken, isAdmin, ContentController.updateContent);

// Delete content
router.delete('/:id', authenticateToken, isAdmin, ContentController.deleteContent);

export default router;