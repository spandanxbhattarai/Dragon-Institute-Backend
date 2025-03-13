import User from '../models/user.js';

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const updateUserStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );
};

export async function addExamResults(userId, examData) {
  try {
    console.log(userId, examData)
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.examsAttended.push({
      examName: examData.examName,
      totalQuestions: examData.totalQuestions,
      correctAnswers: examData.correctAnswers
    });

    await user.save();
    return "Sucessfull";
  } catch (error) {
    throw new Error(`Error adding exam results: ${error.message}`);
  }
}