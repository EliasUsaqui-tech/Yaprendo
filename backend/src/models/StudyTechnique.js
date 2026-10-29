import mongoose from "mongoose";

const techniqueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    steps: [{ type: String }], // pasos concretos
    type: {
      type: String,
      enum: ["active-recall", "spaced-repetition", "feynman", "problem-solving", "pomodoro", "other"],
      default: "other",
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    estimatedMinutes: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export default mongoose.model("StudyTechnique", techniqueSchema);