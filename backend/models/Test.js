import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["mcq", "coding", "short", "long", "fill", "truefalse"],
    required: true,
  },
  options: [{ type: String }],
  correctAnswer: { type: String },
  explanation: { type: String },
});

const testSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    questionType: { type: String, required: true },
    numQuestions: { type: Number, required: true },
    questions: [questionSchema],
    status: { type: String, enum: ["generated", "in-progress", "completed"], default: "generated" },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
