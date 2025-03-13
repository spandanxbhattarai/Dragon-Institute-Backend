import * as courseRepository from '../repository/courseRepository.js';

export async function getAllCourses(fields = [], pages = 1, pageLimits = 10) {
  
  return await courseRepository.findAllCourses(fields, pages, pageLimits);
}

export async function getCourseById(id) {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
}

export async function createCourse(courseData) {
  return await courseRepository.createCourse(courseData);
}

export async function updateCourse(id, courseData) {
  const course = await courseRepository.updateCourse(id, courseData);
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
}

export async function deleteCourse(id) {
  const course = await courseRepository.deleteCourse(id);
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
}

export async function addReview(id, reviewData) {
  const course = await courseRepository.addReviewToCourse(id, reviewData);
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
}