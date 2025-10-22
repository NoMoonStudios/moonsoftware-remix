import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import mongoose from "mongoose";

// Minimal Job schema for direct DB access
const JobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema, "jobs");

export const loader: LoaderFunction = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string, {
        dbName: "test", // Use your actual DB name here
      });
    }
    const jobs = await Job.find({}).lean();
    return json({ jobs });
  } catch (err: any) {
    console.error("Failed to fetch jobs:", err);
    return json(
      { error: "Failed to fetch jobs", details: err.message || err },
      { status: 500 }
    );
  }
};

export default null;