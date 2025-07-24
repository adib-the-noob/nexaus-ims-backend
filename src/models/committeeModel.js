import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: { type: String, required: true },
  designation: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: null },
  session: { type: String, default: null },
});

export const Committee = mongoose.model("Committee", committeeSchema);
