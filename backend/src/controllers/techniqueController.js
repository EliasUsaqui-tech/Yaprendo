import StudyTechnique from "../models/StudyTechnique.js";

// GET /api/techniques?course=xxx&topic=yyy
export const getTechniques = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.topic) filter.topic = req.query.topic;

    const techniques = await StudyTechnique.find(filter)
      .populate("course", "name code")
      .populate("topic", "name");
    res.json(techniques);
  } catch (error) {
    next(error);
  }
};

// GET /api/techniques/:id
export const getTechniqueById = async (req, res, next) => {
  try {
    const tech = await StudyTechnique.findById(req.params.id)
      .populate("course", "name")
      .populate("topic", "name");
    if (!tech) return res.status(404).json({ message: "Técnica no encontrada" });
    res.json(tech);
  } catch (error) {
    next(error);
  }
};

// POST /api/techniques (admin)
export const createTechnique = async (req, res, next) => {
  try {
    const tech = await StudyTechnique.create(req.body);
    res.status(201).json(tech);
  } catch (error) {
    next(error);
  }
};