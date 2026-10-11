import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    status: {
      type: String,
      enum: ["no-iniciado", "en-progreso", "dominado"],
      default: "no-iniciado",
    },
    bestScore: { type: Number, default: 0 },
    attemptsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, topic: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);