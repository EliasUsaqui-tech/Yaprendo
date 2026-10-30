import Course from "../models/Course.js";
import Topic from "../models/Topic.js";

// GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    // Buscamos los cursos y los ordenamos por su 'order' o 'code'
    const courses = await Course.find().populate("topics", "name order").sort({ code: -1 });
    // El sort({ code: -1 }) hará que FUNCAL (F) salga antes que CAL1 (C) y FIS1 (F)
    
    // Una forma más exacta:
    const sortedCourses = courses.sort((a, b) => {
      if (a.code === "FUNCAL") return -1;
      if (b.code === "FUNCAL") return 1;
      return 0;
    });

    res.json(sortedCourses);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/topics/:id
export const getTopicById = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Tema no encontrado" });
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res, next) => {
  try {
    // Agregamos "content" para que la vista del curso pueda mostrar la teoría si la necesita
    const course = await Course.findById(req.params.id).populate(
      "topics",
      "name description content order" 
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
    // Traemos todos los campos, incluido content, para la lista
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