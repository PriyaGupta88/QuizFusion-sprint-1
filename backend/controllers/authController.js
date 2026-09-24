import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    let user;
    try {
      user = await User.create({ name, email, password });
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ message: "Email already registered" });
      throw err;
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // simple daily streak tracking
    const today = new Date().toDateString();
    const last = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      user.streak = last === yesterday ? user.streak + 1 : 1;
      user.lastActiveDate = new Date();
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      streak: user.streak,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};
