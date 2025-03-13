import * as courseService from '../services/courseService.js';

export async function getAllCourses(req, res) {
    try {
      console.log("hello")
      const { fields, page, pageLimit } = req.query;

        let pages = Math.max(1, parseInt(page)) || 1;
        let pageLimits = Math.max(1, parseInt(pageLimit)) || 10;


      
      const courses = await courseService.getAllCourses(fields, pages, pageLimits);
      
      res.status(200).json({
        status: 'success',
        results: courses.length,
        data: {
          courses
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

export async function getCourseById(req, res) {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}

export async function createCourse(req, res) {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}

export async function deleteCourse(req, res) {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(200).json({
      status: 'success',
      message: "Course Deleted Sucessfully"
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}

export async function addReview(req, res) {
  try {
    const course = await courseService.addReview(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}