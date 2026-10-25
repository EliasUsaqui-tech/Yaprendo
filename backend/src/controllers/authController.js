import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, cycle, role, bio, expertise, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const userCycle = role === "mentor" ? (cycle || "5") : cycle;

    const user = await User.create({ 
      name, 
      email, 
      password, 
      cycle: userCycle, 
      role: role || "student",
      bio: role === "mentor" ? bio : "",
      expertise: role === "mentor" ? expertise : [],
      avatar: avatar || "avatar_1" // Guardamos el avatar elegido
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cycle: user.cycle,
      role: user.role,
      bio: user.bio,
      expertise: user.expertise,
      avatar: user.avatar,
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
      bio: user.bio,
      expertise: user.expertise,
      avatar: user.avatar || "avatar_1",
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

// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    // Usamos findByIdAndUpdate con { new: true } para que devuelva el usuario actualizado
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: req.body.name,
          bio: req.body.bio,
          avatar: req.body.avatar, // Aquí forzamos que se cree/actualice el campo
        },
      },
      { new: true, runValidators: true } // new: true devuelve el doc modificado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      cycle: updatedUser.cycle,
      role: updatedUser.role,
      bio: updatedUser.bio,
      expertise: updatedUser.expertise,
      avatar: updatedUser.avatar,
      token: req.headers.authorization.split(" ")[1],
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No existe un usuario con ese correo" });
    }

    // Asignamos la nueva contraseña (el modelo User la encriptará automáticamente por el pre-save)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." });
  } catch (error) {
    next(error);
  }
};