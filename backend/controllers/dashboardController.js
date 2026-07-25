import Result from "../models/Result.js";
import Test from "../models/Test.js";
import User from "../models/User.js";

export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const recentResults = await Result.find({ user: req.user._id })
      .populate("test", "subject topic difficulty")
      .sort({ createdAt: -1 })
      .limit(10);

    const totalTests = await Test.countDocuments({ user: req.user._id });
    const completedTests = await Test.countDocuments({ user: req.user._id, status: "completed" });

    const performanceOverTime = recentResults
      .slice()
      .reverse()
      .map((r) => ({
        date: r.createdAt,
        percentage: r.percentage,
        topic: r.test?.topic,
      }));

    res.json({
      totalTests,
      testsCompleted: completedTests,
      averageScore: user.stats.avgScore,
      highestScore: user.stats.bestScore,
      weakTopics: user.weakTopics,
      strongTopics: user.strongTopics,
      dailyStreak: user.streak,
      recentTests: recentResults,
      performanceOverTime,
    });
  } catch (err) {
    next(err);
  }
};
