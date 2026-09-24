import Chat from "../models/Chat.js";
import Test from "../models/Test.js";
import User from "../models/User.js";
import { chatAssistant, generateRecommendations } from "../services/groqService.js";

export const chat = async (req, res, next) => {
  try {
    const { message, testId } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    let chatDoc = await Chat.findOne({ user: req.user._id, testContext: testId || null });
    if (!chatDoc) {
      chatDoc = await Chat.create({ user: req.user._id, testContext: testId || null, messages: [] });
    }

    let testContextLabel = null;
    if (testId) {
      const test = await Test.findById(testId).select("subject topic difficulty").lean();
      if (test) testContextLabel = `${test.subject} - ${test.topic} (${test.difficulty})`;
    }

    const reply = await chatAssistant({
      history: chatDoc.messages.slice(-10),
      message,
      testContext: testContextLabel,
    });

    chatDoc.messages.push({ role: "user", content: message });
    chatDoc.messages.push({ role: "assistant", content: reply });
    await chatDoc.save();

    res.json({ reply, chatId: chatDoc._id });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { testId } = req.query;
    const chatDoc = await Chat.findOne({ user: req.user._id, testContext: testId || null });
    res.json(chatDoc?.messages || []);
  } catch (err) {
    next(err);
  }
};

export const recommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const recentResults = await (await import("../models/Result.js")).default
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const data = await generateRecommendations({
      weakTopics: user.weakTopics,
      strongTopics: user.strongTopics,
      recentScores: recentResults.map((r) => r.percentage),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};
