import { ExamPerformance } from '../models/examPerformanceModel.js';

export async function createInitialPerformanceRecord(batchId, academicYear, examId) {
  const newRecord = new ExamPerformance({
    batchId,
    academicYear,
    examId,
    overallPercentage: 0,
    numberOfExaminees: 0,
    highestScorers: []
  });
  return await newRecord.save();
}

export async function findPerformanceByExamId( examId) {
  return await ExamPerformance.findOne({ examId });
}

export async function findPerformanceById(id) {
  return await ExamPerformance.findById(id);
}

export async function findPerformanceByAcademicYear(academicYear, batchId) {
  return await ExamPerformance.find({ academicYear, batchId }).populate({
    path: 'examId',
    select: 'title _id',
}).populate({
  path: 'batchId',
  select: 'batch_name _id',
});
}

export async function findYearlySummary(academicYear, batchId) {
  return await ExamPerformance.find({ academicYear, batchId }).select('-highestScorers').populate({
    path: 'examId',
    select: 'title _id',
}).populate({
  path: 'batchId',
  select: 'batch_name _id',
});
}

export async function updatePerformanceRecord(id, updateData) {
  return await ExamPerformance.findByIdAndUpdate(id, updateData, { new: true });
}

export async function deleteAllExceptCurrentYear(academicYear) {
  return await ExamPerformance.deleteMany({ academicYear: { $ne: academicYear } });
}

export async function checkPreviousYearsRecords(academicYear) {
  const count = await ExamPerformance.countDocuments({ academicYear: { $ne: academicYear } });
  return count > 0;
}

export async function getAllPerformanceRecords(batchId) {
  return await ExamPerformance.find({batchId}).select('-highestScorers');
}

export async function getPreviousYearsRecords(academicYear, page = 1, limit = 10) {
  page = parseInt(page)
  const skip = (page - 1) * limit;

  const query = { academicYear: { $ne: academicYear } };

  const [totalCount, records] = await Promise.all([
    ExamPerformance.countDocuments(query),
    ExamPerformance.find(query).skip(skip).limit(limit).lean(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    records,
    meta: {
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

