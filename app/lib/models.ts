import pkg from "mongoose";
const { Schema, model, models } = pkg;

const JobSchema = new Schema({
  jobId: { type: String, required: true, unique: true }, // persistent, random unique job ID
  title: { type: String, required: true },
  icon: { type: String, required: false },
  slug: { type: String, required: false },
  type: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

const ApplicationSchema = new Schema({
  jobId: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  name: { type: String, required: true },
  discord: { type: String, required: true },
  server: { type: String, required: true },
  appliedAt: { type: Date, required: true },
  why: { type: String, required: true },
  mcq: [String],
  tf: [String],
  longAnswers: [String],
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export const Job = models.Job || model("Job", JobSchema);
export const Application = models.Application || model("Application", ApplicationSchema);
