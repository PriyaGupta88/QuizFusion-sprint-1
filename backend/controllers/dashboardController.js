import Result from "../models/Result.js";
import Test from "../models/Test.js";
import User from "../models/User.js";

export const getDashboard = async (req, res, next) => {
  try {
    const [user, recentResults, totalTests, completedTests] = await Promise.all([
      User.findById(req.user._id).select("stats weakTopics strongTopics streak").lean(),
      Result.find({ user: req.user._id })
        .select("test createdAt percentage")
        .populate("test", "subject topic difficulty")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Test.countDocuments({ user: req.user._id }),
      Test.countDocuments({ user: req.user._id, status: "completed" }),
    ]);

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
