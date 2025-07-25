import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    file_url: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    type: { type: String, enum: ["download", "notice"], required: true },
    institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "InstitutionInfo", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export const Resource = mongoose.model("Resource", resourceSchema);