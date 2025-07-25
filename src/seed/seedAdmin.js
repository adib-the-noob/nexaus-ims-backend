import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const seedAdminUser = async () => {
  const adminPhone = process.env.ADMIN_PHONE;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPhone || !adminPass) {
    console.warn(
      "⚠️ ADMIN_PHONE and ADMIN_PASS are not set in .env, skipping admin seeding"
    );
    return;
  }

  const existingAdmin = await User.findOne({
    phone: adminPhone,
    role: "admin",
  });
  if (existingAdmin) {
    console.log("✅ Admin user already exists");
    return;
  }

  const hashedPass = await bcrypt.hash(adminPass, 10);
  const admin = new User({
    phone: adminPhone,
    password: hashedPass,
    isNeedPassCreate: false,
    isOtpVerified: true,
    role: "admin",
  });
  await admin.save();
  console.log(`✅ Default admin created with phone: ${adminPhone}`);
};

export default seedAdminUser;
