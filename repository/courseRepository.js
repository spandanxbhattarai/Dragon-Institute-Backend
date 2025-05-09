import Course from '../models/course.js';

export async function findCoursesSummary(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const courses = await Course.find({})
    .select('title category studentsEnrolled moduleLeader overallHours price teachersCount image')
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Course.countDocuments({});
  
  return {
    courses: courses.map(course => ({
      ...course
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

export const incrementStudentsEnrolled = async (courseId) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { studentsEnrolled: 1 } }, 
      { new: true } 
    );

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return updatedCourse;
  } catch (error) {
    throw error;
  }
};

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

export async function getCourseById(id){
  return await Course.findById(id)
}

