import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  questionText: String,
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  aiEvaluation: {
    score: Number,
    feedback: String,
    mistakes: String,
    suggestion: String,
  },
});

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    answers: [answerSchema],
    totalQuestions: Number,
    correctCount: Number,
    incorrectCount: Number,
    score: Number,
    percentage: Number,
    timeTakenSeconds: Number,
    topicBreakdown: [
      {
        topic: String,
        correct: Number,
        total: Number,
      },
    ],
    aiFeedbackSummary: { type: String },
    aiRecommendations: [{ type: String }],
  },
  { timestamps: true }
);

resultSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Result", resultSchema);
