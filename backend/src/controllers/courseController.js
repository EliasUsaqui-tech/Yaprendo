import Course from "../models/Course.js";
import Topic from "../models/Topic.js";

// GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("topics", "name order");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "topics",
      "name description order"
    );
    if (!course) return res.status(404).json({ message: "Curso no encontrado" });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id/topics
export const getCourseTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({ course: req.params.id }).sort("order");
    res.json(topics);
  } catch (error) {
    next(error);
  }
};

// POST /api/courses (admin)
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};