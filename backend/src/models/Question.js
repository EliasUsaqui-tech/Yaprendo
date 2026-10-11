import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    statement: { type: String, required: true },
    options: [{ type: String, required: true }], // 4 opciones
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "" }, // feedback inmediato
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);