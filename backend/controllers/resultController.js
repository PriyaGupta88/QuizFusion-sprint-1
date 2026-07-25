import Test from "../models/Test.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { evaluateAnswers } from "../services/groqService.js";

export const submitResult = async (req, res, next) => {
  try {
    const { testId, answers, timeTakenSeconds } = req.body;
    const test = await Test.findOne({ _id: testId, user: req.user._id });
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Objective grading (mcq/truefalse/fill) done locally; descriptive graded by AI.
    const objectiveTypes = ["mcq", "truefalse", "fill"];
    const needsAI = test.questions.some((q) => !objectiveTypes.includes(q.type));

    let aiResult = { evaluations: [], summary: "", recommendations: [] };
    if (needsAI) {
      aiResult = await evaluateAnswers({
        questions: test.questions.map((q, i) => ({
          index: i,
          questionText: q.questionText,
          type: q.type,
          correctAnswer: q.correctAnswer,
        })),
        answers: answers.map((a) => ({ index: a.questionIndex, userAnswer: a.userAnswer })),
      });
    }

    let correctCount = 0;
    const gradedAnswers = test.questions.map((q, i) => {
      const userAns = answers.find((a) => a.questionIndex === i)?.userAnswer ?? "";
      let isCorrect, evalData;

      if (objectiveTypes.includes(q.type)) {
        isCorrect = userAns.trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase();
        if (isCorrect) correctCount++;
      } else {
        const aiEval = aiResult.evaluations?.find((e) => e.questionIndex === i);
        isCorrect = aiEval?.isCorrect ?? false;
        if (isCorrect) correctCount++;
        evalData = aiEval
          ? {
              score: aiEval.score,
              feedback: aiEval.feedback,
              mistakes: aiEval.mistakes,
              suggestion: aiEval.suggestion,
            }
          : undefined;
      }

      return {
        questionIndex: i,
        questionText: q.questionText,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        aiEvaluation: evalData,
      };
    });

    const total = test.questions.length;
    const percentage = total ? Math.round((correctCount / total) * 100) : 0;

    const result = await Result.create({
      user: req.user._id,
      test: test._id,
      answers: gradedAnswers,
      totalQuestions: total,
      correctCount,
      incorrectCount: total - correctCount,
      score: correctCount,
      percentage,
      timeTakenSeconds,
      topicBreakdown: [{ topic: test.topic, correct: correctCount, total }],
      aiFeedbackSummary: aiResult.summary,
      aiRecommendations: aiResult.recommendations,
    });

    test.status = "completed";
    await test.save();

    // update user stats
    const user = await User.findById(req.user._id);
    user.stats.totalTests += 1;
    user.stats.totalScore += percentage;
    user.stats.bestScore = Math.max(user.stats.bestScore, percentage);
    user.stats.avgScore = Math.round(user.stats.totalScore / user.stats.totalTests);
    if (percentage < 60 && !user.weakTopics.includes(test.topic)) user.weakTopics.push(test.topic);
    if (percentage >= 80 && !user.strongTopics.includes(test.topic)) user.strongTopics.push(test.topic);
    await user.save();

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate("test", "subject topic difficulty").sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const getResultById = async (req, res, next) => {
  try {
    const result = await Result.findOne({ _id: req.params.id, user: req.user._id }).populate("test");
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
