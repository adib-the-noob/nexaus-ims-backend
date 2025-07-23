import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  section: String,
  institute_given_student_id: { type: String, unique: true },
  roll: Number,
  photoUrl: String,
});

export const Student = mongoose.model("Student", studentSchema);
