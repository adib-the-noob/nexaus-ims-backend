import express from "express";
import {
  adminLogin,
  createUser,
  sendOtp,
  setPassword,
  userLogin,
  verifyOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/admin/login", adminLogin);
router.post("/admin/create-user", authMiddleware, adminMiddleware, createUser);

// User auth routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", userLogin);

export default router;
