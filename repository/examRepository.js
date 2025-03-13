import { Exam } from '../models/exams.js';

// Create a new exam
export const createExam = async (examData) => {
  try {
    const exam = new Exam(examData);
    return await exam.save();
  } catch (error) {
    throw error;
  }
};

// Get all exams
export const getAllExams = async () => {
  try {
    return await Exam.find()
      .sort({ startTime: 1 });
  } catch (error) {
    throw error;
  }
};

// Get exam by ID
export const getExamById = async (examId) => {
  try {
    return await Exam.findById(examId)
      .populate('createdBy', 'fullname email')
      .populate('questionSheet')
      .populate('allowedStudents', 'fullname email');
  } catch (error) {
    throw error;
  }
};

// Get exams for eligible student
export const getExamsForStudent = async (courseEnrolled, plan, currentTime) => {
  try {
    const eligibilityQuery = {};

    console.log("plan:", plan, "enrolled:" , courseEnrolled)
    
    // Filter by plan
    if (plan === 'full') {
      eligibilityQuery['eligiblePlans.fullPlan'] = true;
    } else if (plan === 'half') {
      eligibilityQuery['eligiblePlans.halfPayment'] = true;
    } else if (plan === 'free') {
      eligibilityQuery['eligiblePlans.freePlan'] = true;
    }

    // Base query for exams
    const baseQuery = {
      ...eligibilityQuery,
      eligibleCourses: { $in: courseEnrolled },
      endTime: { $gte: currentTime }
    };

    // Query for exams
    let exams = await Exam.find(baseQuery)
      .sort({ startTime: 1 });

    
    // Modify the results to exclude questionSheet if exam hasn't started
    exams = exams.map(exam => {
      const examObj = exam
      
      // If current time is before start time, exclude the questionSheet
      if (currentTime < examObj.startTime) {
        delete examObj.questionSheet;
      }
      
      return examObj;
    });
    
    return exams;
  } catch (error) {
    throw error;
  }
};

// Update exam
export const updateExam = async (examId, updateData) => {
  try {
    return await Exam.findByIdAndUpdate(
      examId, 
      updateData, 
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};

// Delete exam
export const deleteExam = async (examId) => {
  try {
    return await Exam.findByIdAndDelete(examId);
  } catch (error) {
    throw error;
  }
};