import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      phoneNumber: phoneNumber || undefined,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};
