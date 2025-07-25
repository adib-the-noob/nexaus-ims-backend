import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  User  from "../models/userModel.js";

export const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone, role: "admin" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { phone } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    const user = new User({ phone });
    await user.save();

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const result = await sendOtpSms(phone, otp);
    if (result.success) {
      res.json({
        success: true,
        message: "OTP sent",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "OTP failed",
        data: result.data,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user || user.otpCode !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isOtpVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !user.isOtpVerified) {
      return res.status(403).json({
        success: false,
        message: "OTP not verified",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.isNeedPassCreate = false;
    await user.save();

    res.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !user.password) {
      return res.status(404).json({
        success: false,
        message: "User not found or password not set",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
