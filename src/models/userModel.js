import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String },
  isNeedPassCreate: { type: Boolean, default: true },
  isOtpVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  otpCode: String,
  otpExpiresAt: Date,
});

export const User = mongoose.model('User', userSchema);
