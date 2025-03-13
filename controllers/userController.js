import * as userService from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const { fullname, role, email, phone, password, citizenshipImageUrl, plan, courseEnrolled } = req.body;
    
    // Basic validation
    if (!fullname || !role || !email || !phone || !password || !citizenshipImageUrl || !plan || !courseEnrolled ) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate role
    if (!['admin', 'teacher', 'user'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be admin, teacher, or user' 
      });
    }

    const result = await userService.registerUser({
      fullname,
      role,
      email,
      phone,
      password,
      citizenshipImageUrl,
      plan,
      courseEnrolled
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Error registering user' 
    });
  }
};

export const verifyUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.verifyUser(userId, req.user);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Verification error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    if (error.message.includes('User not found')) {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Error verifying user' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const result = await userService.loginUser(email, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message.includes('Invalid email or password') || 
        error.message.includes('Account not verified')) {
      return res.status(401).json({ 
        success: false, 
        message: error.message 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Error during login' 
    });
  }
};