import express from 'express';
import {
  register,
  login,
  verifyUserStatus,
  getUnverifiedUsers,
  getVerifiedUsers,
  updateUser,
  deleteUser,
  resetPassword,
  searchUsersByFullname
} from '../controllers/userController.js';
import { authenticateToken, isAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/search', searchUsersByFullname);

// Protected admin routes
router.get('/unverified',  authenticateToken, isAdmin, getUnverifiedUsers);
router.get('/verified',  authenticateToken, isAdmin, getVerifiedUsers);
router.put('/:userId',  authenticateToken, isAdmin, updateUser);
router.delete('/:userId',  authenticateToken, isAdmin, deleteUser);
router.post('/:userId/reset-password',  authenticateToken, isAdmin, resetPassword);

// User verification
router.put('/verify/:userId',  authenticateToken, isAdmin, verifyUserStatus);

export default router;