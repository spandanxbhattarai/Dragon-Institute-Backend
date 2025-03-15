import * as questionSheetRepository from '../repository/questionSheetRepository.js';
import { addExamResults } from '../repository/userRepository.js';

export async function getAllQuestionSheets(fields, page, pageSize) {
  try {
    return await questionSheetRepository.findAllQuestionSheets(fields, page, pageSize);
  } catch (error) {
    throw error;
  }
}

export async function getQuestionSheetById(id) {
  try {
    const questionSheet = await questionSheetRepository.findQuestionSheetById(id);
    if (!questionSheet) {
      throw new Error('Question sheet not found');
    }
    return questionSheet;
  } catch (error) {
    throw error;
  }
}

export async function createQuestionSheet(questionSheetData) {
  try {
    // Validate data
    if (!questionSheetData.questions || !Array.isArray(questionSheetData.questions) || questionSheetData.questions.length === 0) {
      throw new Error('Question sheet must contain at least one question');
    }
    
    // Validate each question
    questionSheetData.questions.forEach((q, index) => {
      if (!q.question) {
        throw new Error(`Question at index ${index} is missing question text`);
      }
      if (!q.answers || !Array.isArray(q.answers) || q.answers.length < 2) {
        throw new Error(`Question at index ${index} must have at least 2 answers`);
      }
      if (!q.correctAnswer) {
        throw new Error(`Question at index ${index} is missing correct answer`);
      }
      if (!q.answers.includes(q.correctAnswer)) {
        throw new Error(`Question at index ${index} has a correct answer that is not in the answers array`);
      }
    });
    
    return await questionSheetRepository.createQuestionSheet(questionSheetData);
  } catch (error) {
    throw error;
  }
}

export async function updateQuestionSheet(id, questionSheetData) {
  try {
    // Check if question sheet exists
    const existingSheet = await questionSheetRepository.findQuestionSheetById(id);
    if (!existingSheet) {
      throw new Error('Question sheet not found');
    }
    
    // If questions are provided, validate them
    if (questionSheetData.questions) {
      if (!Array.isArray(questionSheetData.questions) || questionSheetData.questions.length === 0) {
        throw new Error('Question sheet must contain at least one question');
      }
      
      // Validate each question
      questionSheetData.questions.forEach((q, index) => {
        if (!q.question) {
          throw new Error(`Question at index ${index} is missing question text`);
        }
        if (!q.answers || !Array.isArray(q.answers) || q.answers.length < 2) {
          throw new Error(`Question at index ${index} must have at least 2 answers`);
        }
        if (!q.correctAnswer) {
          throw new Error(`Question at index ${index} is missing correct answer`);
        }
        if (!q.answers.includes(q.correctAnswer)) {
          throw new Error(`Question at index ${index} has a correct answer that is not in the answers array`);
        }
      });
    }
    
    return await questionSheetRepository.updateQuestionSheet(id, questionSheetData);
  } catch (error) {
    throw error;
  }
}

export async function deleteQuestionSheet(id) {
  try {
    const questionSheet = await questionSheetRepository.deleteQuestionSheet(id);
    if (!questionSheet) {
      throw new Error('Question sheet not found');
    }
    return questionSheet;
  } catch (error) {
    throw error;
  }
}

export async function calculateScoreAndPercentage(questionSheetId, userAnswers, userId, examTitle) {
  const questionSheet = await questionSheetRepository.findQuestionSheetsById(questionSheetId);
  if (!questionSheet) {
    throw new Error('Question sheet not found');
  }

  let correctAnswersCount = 0;

  console.log(userAnswers)
  console.log(questionSheet)

  // Iterate over each question from the frontend and compare with the stored data
  for (let i = 0; i < userAnswers.length; i++) {
    const userAnswer = userAnswers[i];
    const question = questionSheet.questions.find(q => q.question === userAnswer.question);

    if (question && question.correctAnswer === userAnswer.correctAnswer) {
      correctAnswersCount++;
    }
  }


  const totalQuestions = questionSheet.questions.length;
  const percentage = (correctAnswersCount / totalQuestions) * 100;

  const message = await addExamResults(userId, { examName : examTitle, totalQuestions, correctAnswers: correctAnswersCount });
  if(message === "Sucessfull")
  {
  return {
    totalQuestions,
    correctAnswersCount,
    percentage
  };
} else 
return{
  "message" : "Sorry An Error Occured"
}
}



