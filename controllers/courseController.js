import * as courseService from '../services/courseService.js';

export async function getAllCoursesSummary(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive numbers', 400);
    }

    const result = await courseService.getCoursesSummary(page, limit);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function getAllCoursesFullDetails(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive numbers', 400);
    }

    const result = await courseService.getCoursesFullDetails(page, limit);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function createCourse(req, res) {
  try {
    const courseData = req.body;

    const requiredFields = [
      'title', 'description', 'teachersCount', 
      'courseHighlights', 'overallHours', 'moduleLeader',
      'category', 'learningFormat', 'price', 'curriculum'
    ];
    
    for (const field of requiredFields) {
      if (!courseData[field]) {
        throw new Error(`${field} is required`, 400);
      }
    }

    if (!Array.isArray(courseData.description)) {
      throw new Error('Description must be an array of strings', 400);
    }
    
    if (courseData.teachersCount < 1) {
      throw new Error('There must be at least one teacher', 400);
    }
    
    if (courseData.price < 0) {
      throw new Error('Price cannot be negative', 400);
    }

    const newCourse = await courseService.createCourse(courseData);
    
    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse
      }
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function getCourseById(req, res){
  try{
    const {id} = req.params;
    const result = await courseService.getCourseById(id)

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
    
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const protectedFields = ['overallRating', 'reviews', 'studentsEnrolled'];
    for (const field of protectedFields) {
      if (updateData[field] !== undefined) {
        throw new Error(`Cannot modify ${field} directly`, 403);
      }
    }

    if (updateData.teachersCount !== undefined && updateData.teachersCount < 1) {
      throw new Error('There must be at least one teacher', 400);
    }

    const updatedCourse = await courseService.updateCourse(id, updateData);
    
    res.status(200).json({
      status: 'success',
      data: {
        course: updatedCourse
      }
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    await courseService.deleteCourse(id);
    
    res.status(201).json({
      status: 'success',
      message: 'Course deleted sucessfully'
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message
    });
  }
}

