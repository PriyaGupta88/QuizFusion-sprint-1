import Test from "../models/Test.js";
import { generateQuestions } from "../services/groqService.js";

export const generateTest = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, numQuestions, questionType } = req.body;
    if (!subject || !topic || !difficulty || !numQuestions || !questionType) {
      return res.status(400).json({ message: "subject, topic, difficulty, numQuestions and questionType are required" });
    }
    if (numQuestions < 1 || numQuestions > 50) {
      return res.status(400).json({ message: "numQuestions must be between 1 and 50" });
    }

    const questions = await generateQuestions({ subject, topic, difficulty, numQuestions, questionType });

    const test = await Test.create({
      user: req.user._id,
      subject,
      topic,
      difficulty,
      questionType,
      numQuestions: questions.length,
      questions,
      status: "generated",
    });

    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
};

export const getTests = async (req, res, next) => {
  try {
    const tests = await Test.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    next(err);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, user: req.user._id });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    next(err);
  }
};

export const deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test deleted" });
  } catch (err) {
    next(err);
  }
};
