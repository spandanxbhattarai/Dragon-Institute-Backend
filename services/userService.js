import * as userRepository from '../repository/userRepository.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (userData) => {
  try {
    // Set status to unverified by default
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

export const verifyUser = async (userId, currentUser) => {
  try {
    // Only admin can verify users
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

    // Check if user is verified
    if (user.status !== 'verified') {
      throw new Error('Account not verified yet');
    }

    // Generate JWT token
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



