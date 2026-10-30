import Progress from "../models/Progress.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";

// GET /api/progress/me
export const getMyProgress = async (req, res, next) => {
  try {
    // 1. Buscamos todos los registros de progreso de este usuario
    const progressList = await Progress.find({ user: req.user._id })
      .populate("course", "name code")
      .populate("topic", "name");

    // Si no tiene progreso, devolvemos vacío
    if (progressList.length === 0) {
      return res.json({ coursesProgress: [] });
    }

    // 2. Agrupar por curso
    const coursesMap = {};

    for (const prog of progressList) {
      // Si el curso no está en el mapa, lo inicializamos
      if (!coursesMap[prog.course._id]) {
        // Contamos cuántos quizzes tiene el curso en total
        const totalQuizzes = await Quiz.countDocuments({ course: prog.course._id });
        
        coursesMap[prog.course._id] = {
          courseId: prog.course._id,
          courseName: prog.course.name,
          courseCode: prog.course.code,
          totalQuizzes: totalQuizzes,
          dominados: 0,
          enProgreso: 0,
          topics: []
        };
      }

      // Contamos los estados
      if (prog.status === "dominado") {
        coursesMap[prog.course._id].dominados += 1;
      } else if (prog.status === "en-progreso") {
        coursesMap[prog.course._id].enProgreso += 1;
      }

      coursesMap[prog.course._id].topics.push({
        name: prog.topic.name,
        status: prog.status,
        bestScore: prog.bestScore
      });
    }

    // 3. Calcular el porcentaje de avance
    const coursesProgress = Object.values(coursesMap).map(c => ({
      ...c,
      percentage: Math.round((c.dominados / c.totalQuizzes) * 100)
    }));

    res.json({ coursesProgress });
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