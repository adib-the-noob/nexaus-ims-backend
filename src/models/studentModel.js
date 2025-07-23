import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  institute_given_student_id: { type: String, required: true, unique: true },
  roll: { type: Number, required: true },
  photoUrl: { type: String, required: true },
});

export const Student = mongoose.model("Student", studentSchema);
