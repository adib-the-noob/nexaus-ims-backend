import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pds_id: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  photo_url: { type: String, required: true },
  main_designation: { type: String, required: true },
  designation: { type: String, required: true },
  current_institute: { type: String, required: true },
  joining_date: { type: Date, required: true },
  district: { type: String, required: true },
  email: { type: String, default: null },
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
