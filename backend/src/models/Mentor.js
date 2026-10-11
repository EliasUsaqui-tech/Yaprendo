import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    bio: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactLink: { type: String, default: "" }, // Discord, WhatsApp, etc.
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);