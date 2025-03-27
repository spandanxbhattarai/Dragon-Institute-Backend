import Course from '../models/course.js';

export async function findCoursesSummary(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const courses = await Course.find({})
    .select('title category studentsEnrolled overallRating moduleLeader overallHours price curriculum teachersCount')
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Course.countDocuments({});
  
  return {
    courses: courses.map(course => ({
      ...course,
      curriculumCount: course.curriculum.length
    })),
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1
    }
  };
}

export async function findCoursesFullDetails(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const courses = await Course.find({})
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Course.countDocuments({});
  
  return {
    courses,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1
    }
  };
}

export async function createCourse(courseData) {
  return await Course.create(courseData);
}

export async function updateCourse(id, updateData) {
  return await Course.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  );
}

export async function deleteCourse(id) {
  return await Course.findByIdAndDelete(id);
}

export async function addReview(id, reviewData) {
  const course = await Course.findById(id);
  
  if (!course) {
    return null;
  }
  
  // Add new review
  course.reviews.push(reviewData);
  
  // Recalculate overall rating
  if (course.reviews.length === 0) {
    course.overallRating = 0;
  } else {
    const sum = course.reviews.reduce((acc, review) => acc + review.rating, 0);
    course.overallRating = parseFloat((sum / course.reviews.length).toFixed(1));
  }
  
  await course.save();
  return course;
}