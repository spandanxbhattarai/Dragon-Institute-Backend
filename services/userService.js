import * as userRepository from '../repository/userRepository.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const searchUsers = async (searchTerm, pagination) => {
  // Validation
  if (!searchTerm?.trim()) {
    throw new Error('Search term cannot be empty');
  }

  if (searchTerm.trim().length < 2) {
    throw new Error('Search term must be at least 2 characters');
  }

  // Execute search
  return await userRepository.searchUsersByFullname(searchTerm, pagination);
};
// Register a new user
export const registerUser = async (userData) => {
  try {
    userData.status = 'unverified';
    const user = await userRepository.createUser(userData);
    return {
      success: true,
      message: 'User registered successfully',
      userId: user._id
    };
  } catch (error) {
    throw error;
  }
};

// Verify user (admin only)
export const verifyUser = async (userId, currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can verify users');
    }

    const updatedUser = await userRepository.updateUserStatus(userId, 'verified');
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'User verified successfully',
      user: {
        id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        status: updatedUser.status
      }
    };
  } catch (error) {
    throw error;
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'verified') {
      throw new Error('Account not verified yet');
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        plan: user.plan,
        courseEnrolled: user.courseEnrolled
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get unverified users (admin only)
export const getUnverifiedUsers = async (currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can access this resource');
    }

    const users = await userRepository.findUnverifiedUsers();
    return {
      success: true,
      count: users.length,
      users
    };
  } catch (error) {
    throw error;
  }
};

// Get verified users (admin only)
export const getVerifiedUsers = async (currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can access this resource');
    }

    const users = await userRepository.findVerifiedUsers();
    return {
      success: true,
      count: users.length,
      users
    };
  } catch (error) {
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId, updateData, currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can update users');
    }

    // Remove sensitive fields that shouldn't be updated here
    delete updateData.password;
    delete updateData.role;

    const updatedUser = await userRepository.updateUserById(userId, updateData);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    };
  } catch (error) {
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId, currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can delete users');
    }

    const deletedUser = await userRepository.deleteUserById(userId);
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    throw error;
  }
};

// Reset user password (admin only)
export const resetUserPassword = async (userId, newPassword, currentUser) => {
  try {
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admin can reset passwords');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const updatedUser = await userRepository.updateUserPassword(userId, hashedPassword);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'Password reset successfully',
      userId: updatedUser._id
    };
  } catch (error) {
    throw error;
  }
};

// Verify JWT token
export const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};