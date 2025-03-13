import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.patch('/verify/:userId', authenticateToken, isAdmin, userController.verifyUserStatus);

export default router;