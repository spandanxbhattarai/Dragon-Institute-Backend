import Course from '../models/course.js';
export async function findAllCourses(fields = [], pages, pageLimits) {
  const skip = (pages - 1) * pageLimits;

  const projection = {};
  if (Array.isArray(fields) && fields.length > 0) {
    fields.forEach(field => {
      projection[field] = 1;
    });
  }

  const selectFields = fields.length > 0  ? fields.split(',').join(' ') : '';


  const courses = await Course.find({}, projection)
  .select(selectFields)
    .skip(skip)
    .limit(pageLimits)
    .lean();
  

  const totalCount = await Course.countDocuments({});

  const totalPages = Math.ceil(totalCount / pageLimits);
  const hasNextPage = pages < totalPages;
  const hasPrevPage = pages > 1;
  
  return {
    courses,
    pagination: {
      currentPage: pages,
      pageLimit: pageLimits,
      totalCount : totalCount,
      totalPages: totalPages,
      hasNextPage : hasNextPage,
      hasPrevPage : hasPrevPage
    }
  };
}

export async function findCourseById(id) {
  return await Course.findById(id);
}

export async function createCourse(courseData) {
  return await Course.create(courseData);
}

export async function updateCourse(id, courseData) {
  return await Course.findByIdAndUpdate(id, courseData, {
    new: true,
    runValidators: true
  });
}

export async function deleteCourse(id) {
  return await Course.findByIdAndDelete(id);
}

export async function addReviewToCourse(id, reviewData) {
  const course = await Course.findById(id);
  if (!course) return null;
  
  course.reviews.push(reviewData);
  course.calculateAverageRating();
  await course.save();
  
  return course;
}