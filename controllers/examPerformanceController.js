import {
  initializePerformanceRecord,
  updateStudentPerformance,
  getPerformanceByYear,
  getPerformanceById,
  getYearlySummary,
  checkForPreviousYearsRecords,
  cleanupPreviousYearsData,
  getAllPerformanceData,
getPreviousYearsData
} from '../services/examPerformanceService.js';

export async function handleInitializePerformanceRecord(req, res) {
  try {
    const { batchId, academicYear, examId } = req.body;
    const record = await initializePerformanceRecord(batchId, academicYear, examId);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleUpdateStudentPerformance(req, res) {
  try {
    const { studentId, percentage, examId } = req.body;
    const updatedRecord = await updateStudentPerformance(
      examId,
      studentId, 
      percentage
    );
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleGetPerformanceByYear(req, res) {
  try {
    const { academicYear, batchId } = req.params;
    const records = await getPerformanceByYear(academicYear, batchId);
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleGetPerformanceById(req, res) {
  try {
    const { id } = req.params;
    const record = await getPerformanceById(id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleGetYearlySummary(req, res) {
  try {
    const { academicYear, batchId } = req.params;
    const summary = await getYearlySummary(academicYear, batchId);
    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleCheckPreviousYearsData(req, res) {
  try {
    const { academicYear } = req.params;
    const hasPreviousRecords = await checkForPreviousYearsRecords(academicYear);
    res.json({ hasPreviousRecords });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleCleanupPreviousYearsData(req, res) {
  try {
    const { academicYear } = req.params;
    const result = await cleanupPreviousYearsData(academicYear);
    res.json({
      message: `Deleted ${result.deletedCount} previous years records`,
      academicYear
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getPreviousYearData(req, res) {
  try {
    const { academicYear } = req.params;
    const {page , limit} = req.query;
    const record = await getPreviousYearsData(academicYear, page , limit);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleGetAllPerformanceData(req, res) {
  try {
    const { batchId } = req.params;
    const records = await getAllPerformanceData(batchId);
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
