import mongoose from "mongoose";

const institutionInfoSchema = new mongoose.Schema({
  nameBn: { type: String, required: false },
  nameEn: { type: String, required: false },
  address: { 
    road: { type: String, required: false },
    wardNo: { type: String, required: false },
    union: { type: String, required: false },
    postOffice: { type: String, required: false },
    upazila: { type: String, required: false },
    division: { type: String, required: false },
   },
  telephone: { type: String, required: false },
  email: { type: String, required: false },
  website: { type: String, required: false },
  totalStudents: { type: Number, required: false },
  totalTeachers: { type: Number, required: false },
  shiftCount: { type: Number, required: false },
  institutionType: { type: String, required: true },
  headTeacherName: { type: String, required: false },
  headTeacherDesignation: { type: String, required: false },
  headTeacherPhoto: { type: String, required: false },
  collaborator: { name: { type: String, required: false }, email: { type: String, required: false } },
  eiin: { type: String, required: false, unique: true, index: true },
  shifts: [
    {
      shiftName: { type: String, required: false },
      startTime: { type: String, required: false },
      endTime: { type: String, required: false },
      totalStudents: { type: Number, required: false },
      totalTeachers: { type: Number, required: false }
    }
  ],
  geographicalInformation: {
    totalBuildings: { type: Number, required: false },
    totalClassrooms: { type: Number, required: false },
    multimediaClassrooms: { type: String, required: false },
    ictLab: { type: Boolean, required: false },
    ictLabCount: { type: Number, required: false },
    scienceLab: { type: Boolean, required: false },
    scienceLabCount: { type: Number, required: false },
}
});

export const InstitutionInfo = mongoose.model("InstitutionInfo", institutionInfoSchema);
