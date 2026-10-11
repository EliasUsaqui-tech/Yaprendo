import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    cycle: { type: String, default: "1" },
    color: { type: String, default: "#1e40af" }, // para UI
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);