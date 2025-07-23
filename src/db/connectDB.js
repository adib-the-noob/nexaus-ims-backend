import mongoose from "mongoose";
import seedAdminUser from "../seed/seedAdmin";

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/user-student-db")
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedAdminUser(); // Seed admin here
  })
  .catch((err) => console.error("❌ Mongo error:", err));
