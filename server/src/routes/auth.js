import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordController.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validate.js";
import { authLimiter, passwordResetLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  validateResetPassword,
  resetPassword
);

export default router;
