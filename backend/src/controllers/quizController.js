import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Progress from "../models/Progress.js";

// GET /api/quizzes?topic=xxx&course=yyy
export const getQuizzes = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.course) filter.course = req.query.course;

    const quizzes = await Quiz.find(filter)
      .populate("topic", "name")
      .populate("course", "name");
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id  (incluye preguntas SIN la respuesta correcta)
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("topic", "name");
    if (!quiz) return res.status(404).json({ message: "Quiz no encontrado" });

    const questions = await Question.find({ quiz: quiz._id })
      .sort("order")
      .select("-correctIndex -explanation"); // ocultar respuestas

    res.json({ ...quiz.toObject(), questions });
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes/:id/attempt
export const submitAttempt = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedIndex }, ...]
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz no encontrado" });

    const questions = await Question.find({ quiz: quiz._id });

    let correctCount = 0;
    const evaluated = questions.map((q) => {
      const ans = answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );
      const selectedIndex = ans ? ans.selectedIndex : -1;
      const correct = selectedIndex === q.correctIndex;
      if (correct) correctCount++;
      return {
        question: q._id,
        selectedIndex,
        correct,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: evaluated.map((e) => ({
        question: e.question,
        selectedIndex: e.selectedIndex,
        correct: e.correct,
      })),
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
    });

    // Actualizar progreso
    const status = score >= 70 ? "dominado" : "en-progreso";
    await Progress.findOneAndUpdate(
      { user: req.user._id, topic: quiz.topic },
      {
        user: req.user._id,
        course: quiz.course,
        topic: quiz.topic,
        $max: { bestScore: score },
        $inc: { attemptsCount: 1 },
        status,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      attemptId: attempt._id,
      score,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      feedback: evaluated.map((e) => ({
        questionId: e.question,
        correct: e.correct,
        correctIndex: e.correctIndex,
        explanation: e.explanation,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/attempts/me
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate("quiz", "title")
      .sort("-completedAt");
    res.json(attempts);
  } catch (error) {
    next(error);
  }
};