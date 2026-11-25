import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    selectedIndex: Number,
    correct: Boolean,
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [answerSchema],
    score: { type: Number, required: true }, // 0-100
    totalQuestions: Number,
    correctAnswers: Number,
    completedAt: { type: Date, default: Date.now },
    // Técnica con la que el estudiante preparó el tema (permite medir rendimiento por técnica)
    technique: {
      type: String,
      enum: ["feynman", "active-recall", "pomodoro", "problem-solving", "ninguna"],
      default: "ninguna",
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);