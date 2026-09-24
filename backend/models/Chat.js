import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testContext: { type: mongoose.Schema.Types.ObjectId, ref: "Test", default: null },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, testContext: 1 });

export default mongoose.model("Chat", chatSchema);
