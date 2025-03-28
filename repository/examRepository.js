import Exam from '../models/exams.js';

export const createExam = async (examData) => {
  const exam = new Exam(examData);
  return await exam.save();
};

export const getAllExams = async ({ 
  page = 1, 
  limit = 10
} = {}) => {
  const skip = (page - 1) * limit;

  const [exams, total] = await Promise.all([
    Exam.find()
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Exam.countDocuments()
  ]);

  return {
    data: exams,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getExamById = async (examId) => {
  return await Exam.findById(examId)
    .populate('eligibleCourses', 'name code')
    .populate('questionSheet')
    .lean();
};

export const getExamsForStudent = async (courseEnrolled, plan, currentTime = new Date()) => {
  const baseQuery = {
    eligibleCourses: { $in: courseEnrolled },
    endTime: { $gte: currentTime }
  };

  // Add plan condition
  if (plan === 'full') baseQuery['eligiblePlans.fullPlan'] = true;
  else if (plan === 'half') baseQuery['eligiblePlans.halfPayment'] = true;
  else if (plan === 'free') baseQuery['eligiblePlans.freePlan'] = true;

  const exams = await Exam.find(baseQuery)
    .select('title description startTime endTime questionSheet')
    .sort({ startTime: 1 })
    .lean();

    console.log(exams, plan, courseEnrolled);

  return exams.map(exam => ({
    ...exam,
    questionSheet: currentTime >= exam.startTime ? exam.questionSheet : undefined
  }));
};

export const updateExam = async (examId, updateData) => {
  return await Exam.findByIdAndUpdate(
    examId,
    updateData,
    { new: true, runValidators: true, lean: true }
  );
};

export const deleteExam = async (examId) => {
  return await Exam.findByIdAndDelete(examId);
};

// Helper Methods
export const getActiveExams = async () => {
  const now = new Date();
  return Exam.find({
    startTime: { $lte: now },
    endTime: { $gte: now }
  })
  .sort({ endTime: -1 })
  .lean();
};

export const getUpcomingExams = async (limit = 5) => {
  return Exam.find({
    startTime: { $gt: new Date() }
  })
  .sort({ startTime: 1 })
  .limit(limit)
  .lean();
};