import mongoose from "mongoose";
import crypto from "crypto";

const projectSchema = new mongoose.Schema({
  title: { type: String },
  theme: { type: String },
  images: [String],
  audio: { type: String },
  video: { type: String },
  recipientEmail: { type: String },
  recipientPhone: { type: String },
  scheduledAt: { type: Date },
  status: { type: String, default: "pending" },
  token: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString("hex"),
  },
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
