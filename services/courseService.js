import * as courseRepository from '../repository/courseRepository.js';

export async function getCoursesSummary(page = 1, limit = 10) {
  const result = await courseRepository.findCoursesSummary(page, limit);
  
  if (!result.courses || result.courses.length === 0) {
    throw new Error('No courses found', 404);
  }

  return {
    courses: result.courses,
    pagination: result.pagination
  };cd 
}

export async function getCoursesFullDetails(page = 1, limit = 10) {
  const result = await courseRepository.findCoursesFullDetails(page, limit);
  
  if (!result.courses || result.courses.length === 0) {
    throw new Error('No courses found', 404);
  }

  return {
    courses: result.courses,
    pagination: result.pagination
  };
}

export async function createCourse(courseData) {
  // Ensure non-modifiable fields are not set
  const sanitizedData = { ...courseData };
  delete sanitizedData.overallRating;
  delete sanitizedData.reviews;
  delete sanitizedData.studentsEnrolled;

  // Additional service-level validation
  if (sanitizedData.overallHours < 1) {
    throw new Error('Course must be at least 1 hour long', 400);
  }

  if (!Array.isArray(sanitizedData.curriculum) || sanitizedData.curriculum.length === 0) {
    throw new Error('At least one curriculum item is required', 400);
  }

  return await courseRepository.createCourse(sanitizedData);
}

export async function updateCourse(id, updateData) {
  // Additional service-level validation
  if (updateData.price !== undefined && updateData.price < 0) {
    throw new Error('Price cannot be negative', 400);
  }

  const updatedCourse = await courseRepository.updateCourse(id, updateData);
  
  if (!updatedCourse) {
    throw new Error('Course not found', 404);
  }

  return updatedCourse;
}
export async function getCourseById(id){
  const course = await courseRepository.getCourseById(id)

  if(!course._id){
    throw new Error('Course Not found', 404)
  }
  
  return course;
}
export async function deleteCourse(id) {
  const deletedCourse = await courseRepository.deleteCourse(id);
  
  if (!deletedCourse) {
    throw new Error('Course not found', 404);
  }

  return deletedCourse;
}

export async function addReview(id, userId, reviewData) {
  // Add student ID to review data
  const completeReviewData = {
    ...reviewData,
    studentId: userId,
    date: new Date()
  };

  const updatedCourse = await courseRepository.addReview(id, completeReviewData);
  
  if (!updatedCourse) {
    throw new Error('Course not found', 404);
  }

  return updatedCourse;
}