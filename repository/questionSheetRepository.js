import { QuestionSheet } from '../models/questionSheet.js';

export async function findAllQuestionSheets() {
  try {
    return await QuestionSheet.find();
  } catch (error) {
    throw new Error(`Error fetching question sheets: ${error.message}`);
  }
}

export async function findQuestionSheetById(id) {
  try {
    const questionSheet = await QuestionSheet.findById(id)
      .populate({
        path: 'questions',
        select: '-correctAnswer' 
      });
    return questionSheet;
  } catch (error) {
    throw new Error(`Error fetching question sheet: ${error.message}`);
  }
}


export async function createQuestionSheet(questionSheetData) {
  try {
    const newQuestionSheet = new QuestionSheet(questionSheetData);
    return await newQuestionSheet.save();
  } catch (error) {
    throw new Error(`Error creating question sheet: ${error.message}`);
  }
}

export async function updateQuestionSheet(id, questionSheetData) {
  try {
    const options = { new: true, runValidators: true };
    return await QuestionSheet.findByIdAndUpdate(id, questionSheetData, options);
  } catch (error) {
    throw new Error(`Error updating question sheet: ${error.message}`);
  }
}

export async function deleteQuestionSheet(id) {
  try {
    return await QuestionSheet.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting question sheet: ${error.message}`);
  }
}