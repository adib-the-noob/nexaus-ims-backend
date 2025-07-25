import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String },
  isNeedPassCreate: { type: Boolean, default: true },
  isOtpVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["super_admin", "admin", "user"],
    default: "user",
  },
  otpCode: String,
  otpExpiresAt: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
