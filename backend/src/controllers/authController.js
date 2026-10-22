import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    // 1. Recibimos también 'bio' y 'expertise' del frontend
    const { name, email, password, cycle, role, bio, expertise } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 2. Si es mentor y no envían ciclo, le ponemos uno por defecto (5)
    const userCycle = role === "mentor" ? (cycle || "5") : cycle;

    // 3. Creamos el usuario guardando los campos extra si es mentor
    const user = await User.create({ 
      name, 
      email, 
      password, 
      cycle: userCycle, 
      role: role || "student",
      bio: role === "mentor" ? bio : "",
      expertise: role === "mentor" ? expertise : []
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cycle: user.cycle,
      role: user.role,
      bio: user.bio,              // <-- Devolvemos la bio
      expertise: user.expertise,  // <-- Devolvemos los cursos
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cycle: user.cycle,
      role: user.role,
      bio: user.bio,              // <-- Devolvemos la bio al hacer login
      expertise: user.expertise,  // <-- Devolvemos los cursos al hacer login
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};