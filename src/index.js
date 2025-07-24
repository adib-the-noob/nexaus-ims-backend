import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { Student } from "./models/studentModel.js";
import { User } from "./models/userModel.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import adminMiddleware from "./middlewares/adminMiddleware.js";
import "./db/connectDB.js";
import sendOtpSms from "./utils/sendOtpSms.js";
import sendResponse from "./utils/sendResponse.js";
import { Teacher } from "./models/teacherModel.js";

const app = express();

app.use(cors());
app.use(express.json());

// ========= Auth API's ===============//
// 🔸 Admin login
app.post("/api/v1/admin/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone, role: "admin" });
  if (!user)
    return res.status(404).json({ success: false, message: "Admin not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ success: false, message: "Wrong password" });
  const token = jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ success: true, message: "Admin logged in successfully", token });
});

// 🔸 Admin creates user
app.post(
  "/api/v1/admin/create-user",
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
app.post("/api/v1/auth/send-otp", async (req, res) => {
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
app.post("/api/v1/auth/set-password", async (req, res) => {
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
app.post("/api/v1/auth/login", async (req, res) => {
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
// ========= Auth API's ===============//

// ===== Student CRUD ===== //
// 🔹 Create Student
app.post("/api/v1/students", authMiddleware, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    sendResponse(res, {
      statusCode: 201,
      message: "Student created successfully",
      data: student,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: err.message,
    });
  }
});

// 🔹 Get All Students
app.get("/api/v1/students", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    sendResponse(res, {
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch students",
    });
  }
});

// 🔹 Get Single Student
app.get("/api/v1/students/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    sendResponse(res, {
      message: "Student fetched successfully",
      data: student,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch student",
    });
  }
});

// 🔹 Update Student
app.put("/api/v1/students/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    sendResponse(res, {
      message: "Student updated successfully",
      data: student,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: err.message,
    });
  }
});

// 🔹 Delete Student
app.delete("/api/v1/students/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Student not found",
      });
    }
    sendResponse(res, {
      message: "Student deleted successfully",
      data: student,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete student",
    });
  }
});
// ===== Student CRUD ===== //

// ===== Teacher CRUD ===== //
// 🔹 Create Teacher
app.post("/api/v1/teachers", authMiddleware, async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    sendResponse(res, {
      statusCode: 201,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: err.message,
    });
  }
});

// 🔹 Get All Teachers
app.get("/api/v1/teachers", authMiddleware, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    sendResponse(res, {
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch teachers",
    });
  }
});

// 🔹 Get Single Teacher
app.get("/api/v1/teachers/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    sendResponse(res, {
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch teacher",
    });
  }
});

// 🔹 Update Teacher
app.put("/api/v1/teachers/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    sendResponse(res, {
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: err.message,
    });
  }
});

// 🔹 Delete Teacher
app.delete("/api/v1/teachers/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Teacher not found",
      });
    }
    sendResponse(res, {
      message: "Teacher deleted successfully",
      data: teacher,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete teacher",
    });
  }
});

// ===== Teacher CRUD ===== //

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
