import User from "../models/User.js"; // <-- Importamos User correctamente

// GET /api/mentors
export const getMentors = async (req, res, next) => {
  try {
    // Buscamos en la colección de usuarios a todos los que sean "mentor"
    const mentors = await User.find({ role: "mentor" })
      .select("name cycle bio expertise email") // Traemos solo los datos necesarios
      .sort("-createdAt"); // Los más recientes primero

    res.json(mentors);
  } catch (error) {
    next(error);
  }
};

// GET /api/mentors/:id
export const getMentorById = async (req, res, next) => {
  try {
    // Ahora buscamos al mentor directamente en la colección de usuarios
    const mentor = await User.findOne({ _id: req.params.id, role: "mentor" });
    if (!mentor) return res.status(404).json({ message: "Mentor no encontrado" });
    res.json(mentor);
  } catch (error) {
    next(error);
  }
};

// POST /api/mentors (Por si acaso lo usas en el futuro)
export const createMentor = async (req, res, next) => {
  try {
    // Como ahora todo vive en User, aquí podrías actualizar a un usuario a rol mentor
    // o simplemente crear el usuario con rol mentor.
    const newMentor = await User.create({ ...req.body, role: "mentor" });
    res.status(201).json(newMentor);
  } catch (error) {
    next(error);
  }
};