import Exam from '../models/exams.js';
import User from '../models/user.js';

export const createExam = async (examData) => {
    return await Exam.create(examData);
};

export const findExamsByIds = async (examIds) => {
    return await Exam.find({ exam_id: { $in: examIds } });
};

export const getExamsByBatch = async (batchId, page = 1, limit = 10, userId = null) => {
  const skip = (page - 1) * limit;
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" });

  console.log(now)
  
  // Base query for exams in the batch where endDateTime is greater than current time
  let query = { 
      batches: batchId,
      endDateTime: { $gte: now } // Only fetch exams that haven't ended yet
  };
  
  const [total, exams] = await Promise.all([
      Exam.countDocuments(query),
      Exam.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ startDateTime: 1 }) // Sort by startDateTime ascending
  ]);
  
  // Get user's attended exams if userId is provided
  let attendedExamIds = [];
  let user;
  if (userId) {
      user = await User.findById(userId);
      attendedExamIds = user?.examsAttended?.map(e => e.examId.toString()) || [];
  } 
  
  
  // Process exams based on time boundaries and user attendance
  const processedExams = exams.map(exam => {
      const examObj = exam.toObject ? exam.toObject() : {...exam};
      
      // Check if current time is within exam time boundary
      const isWithinTimeBoundary = now >= exam.startDateTime && now <= exam.endDateTime;
      
      // Hide question_sheet_id only if user has attended AND exam is within time boundary
      if (userId && attendedExamIds.includes(exam._id.toString()) && !isWithinTimeBoundary) {
          examObj.question_sheet_id = undefined;
      }

      if(!user){
        examObj.question_sheet_id = undefined;
      }
      
      return examObj;
  });
  
  return {
      exams: processedExams,
      pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrevious: page > 1
      }
  };
};

export const getAllExamsPaginated = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const [exams, total] = await Promise.all([
        Exam.find()
            .populate({
                path: 'question_sheet_id',
                select: 'sheetName _id',
            })
            .populate({
                path: 'batches',
                select: 'batch_name _id',
            })
            .skip(skip)
            .limit(limit)
            .lean() 
            .exec(), 
        Exam.countDocuments().exec() 
    ]);
    
    
    return {
        exams,
        pagination: {
            totalObjects: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1
        }
    };
};

export const updateExamById = async (examId, updateData) => {
    const exam = await Exam.findOneAndUpdate(
        { exam_id: examId },
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!exam) {
        throw new NotFoundError(`Exam with ID ${examId} not found`);
    }
    
    return exam;
};

export const deleteExamById = async (examId) => {
    const exam = await Exam.findOneAndDelete({ _id: examId });
    
    if (!exam) {
        throw new NotFoundError(`Exam with ID ${examId} not found`);
    }
    
    return exam;
};