import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { User } from "./models/userModel.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import adminMiddleware from "./middlewares/adminMiddleware.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// 🔸 Admin login
app.post("/admin/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone, role: "admin" });
  if (!user)
    return res.status(404).json({ success: false, message: "Admin not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ success: false, message: "Wrong password" });

  const token = jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );
  res.json({ success: true, message: "Admin logged in", token });
});

// 🔸 Admin creates user
app.post(
  "/admin/create-user",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { phone } = req.body;
    try {
      const user = new User({ phone });
      await user.save();
      res.json({ success: true, message: "User created" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// 🔸 Send OTP
app.post("/auth/send-otp", async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins
  await user.save();

  const result = await sendOtpSms(phone, otp);
  if (result.success) {
    res.json({ success: true, message: "OTP sent" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "OTP failed", data: result.data });
  }
});

// 🔸 Verify OTP
app.post("/auth/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });
  if (!user || user.otpCode !== otp || new Date() > user.otpExpiresAt) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  user.isOtpVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ success: true, message: "OTP verified" });
});

// 🔸 Set password
app.post("/auth/set-password", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !user.isOtpVerified)
    return res
      .status(403)
      .json({ success: false, message: "OTP not verified" });

  user.password = await bcrypt.hash(password, 10);
  user.isNeedPassCreate = false;
  await user.save();

  res.json({ success: true, message: "Password set successfully" });
});

// 🔸 User login
app.post("/auth/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !user.password)
    return res
      .status(404)
      .json({ success: false, message: "User not found or password not set" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ success: false, message: "Wrong password" });

  const token = jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );
  res.json({ success: true, message: "Login successful", token });
});

// ===== Student CRUD (Protected) =====
app.post("/students", authMiddleware, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
app.get("/students", authMiddleware, async (req, res) => {
  const students = await Student.find();
  res.json({ success: true, data: students });
});
app.get("/students/:id", authMiddleware, async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student)
    return res
      .status(404)
      .json({ success: false, message: "Student not found" });
  res.json({ success: true, data: student });
});
app.put("/students/:id", authMiddleware, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ success: true, data: student });
});
app.delete("/students/:id", authMiddleware, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Student deleted" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
