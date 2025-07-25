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

// User auth routes (no /admin prefix needed here)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", userLogin);

// Admin routes (no /admin prefix needed here)
router.post("/admin/login", adminLogin);
router.post("/admin/create-user", authMiddleware, adminMiddleware, createUser);

export default router;