import mongoose from "mongoose";
import seedAdminUser from "../seed/seedAdmin.js";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedAdminUser();
  })
  .catch((err) => console.error("❌ Mongo error:", err));
