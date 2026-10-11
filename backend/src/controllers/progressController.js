import Progress from "../models/Progress.js";
import Topic from "../models/Topic.js";

// GET /api/progress/me
export const getMyProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate("course", "name code")
      .populate("topic", "name");
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// GET /api/progress/me/course/:courseId
export const getMyProgressByCourse = async (req, res, next) => {
  try {
    const progress = await Progress.find({
      user: req.user._id,
      course: req.params.courseId,
    }).populate("topic", "name order");

    // Calcular % de avance
    const topics = await Topic.find({ course: req.params.courseId });
    const dominados = progress.filter((p) => p.status === "dominado").length;
    const percentage =
      topics.length > 0 ? Math.round((dominados / topics.length) * 100) : 0;

    res.json({ progress, percentage, totalTopics: topics.length, dominados });
  } catch (error) {
    next(error);
  }
};