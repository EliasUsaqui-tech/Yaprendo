import Mentor from "../models/Mentor.js";

// GET /api/mentors?course=xxx
export const getMentors = async (req, res, next) => {
  try {
    const filter = { available: true };
    if (req.query.course) filter.courses = req.query.course;

    const mentors = await Mentor.find(filter)
      .populate("user", "name email cycle")
      .populate("courses", "name code");
    res.json(mentors);
  } catch (error) {
    next(error);
  }
};

// GET /api/mentors/:id
export const getMentorById = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate("user", "name email cycle")
      .populate("courses", "name");
    if (!mentor) return res.status(404).json({ message: "Mentor no encontrado" });
    res.json(mentor);
  } catch (error) {
    next(error);
  }
};

// POST /api/mentors (solo rol mentor)
export const createMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.create({ ...req.body, user: req.user._id });
    res.status(201).json(mentor);
  } catch (error) {
    next(error);
  }
};