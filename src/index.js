import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Import database connection
import "./db/connectDB.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import committeeRoutes from "./routes/committeeRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Nexus IMS Backend API", version: "1.0.0" });
});

// Use routes
app.use("/api/v1", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/committees", committeeRoutes);
app.use("/api/v1/institution", institutionRoutes);
app.use("/api/v1/resources", resourceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});