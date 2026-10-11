import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["basico", "intermedio", "avanzado"],
      default: "basico",
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    estimatedMinutes: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);