import * as questionSheetService from '../services/questionSheetService.js';

export async function getAllQuestionSheets(req, res) {
  try {
    let { fields, page, pageSize} = req.query;
    page = page && parseInt(page) || 1;
    pageSize = pageSize && parseInt(pageSize) || 10;
    const questionSheets = await questionSheetService.getAllQuestionSheets(fields, page, pageSize);
    return res.status(200).json({
      success: true,
      data: questionSheets
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getQuestionSheetById(req, res) {
  try {
    const { id} = req.params;
    const questionSheet = await questionSheetService.getQuestionSheetById(id);
    return res.status(200).json({
      success: true,
      data: questionSheet
    });
  } catch (error) {
    if (error.message === 'Question sheet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function createQuestionSheet(req, res) {
  try {
    const questionSheetData = req.body;
    const newQuestionSheet = await questionSheetService.createQuestionSheet(questionSheetData);
    return res.status(201).json({
      success: true,
      data: newQuestionSheet
    });
  } catch (error) {
    if (error.message.includes('validation failed')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateQuestionSheet(req, res) {
  try {
    const { id } = req.params;
    const questionSheetData = req.body;
    const updatedQuestionSheet = await questionSheetService.updateQuestionSheet(id, questionSheetData);
    return res.status(200).json({
      success: true,
      data: updatedQuestionSheet
    });
  } catch (error) {
    if (error.message === 'Question sheet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('validation failed')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function deleteQuestionSheet(req, res) {
  try {
    const { id } = req.params;
    await questionSheetService.deleteQuestionSheet(id);
    return res.status(200).json({
      success: true,
      message: 'Question sheet deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Question sheet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function submitAnswers(req, res) {
  const { questionSheetId } = req.params;
  const {examId} = req.params;
  const userId = req.user.id;
  const { questions } = req.body; 
  const examTitle = req.body.examTitle;

  try {
    const result = await questionSheetService.calculateScoreAndPercentage(questionSheetId, questions, userId, examTitle, examId);
    return res.json({
      message: 'Score calculated successfully',
      result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}