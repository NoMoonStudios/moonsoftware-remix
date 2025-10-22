
import mongoose from "mongoose";
import { Job } from "./models.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// You may need to update the import path for jobs data if it's in a JSON file
import jobs from "./jobs.json" assert { type: "json" };

async function seedJobs() {
  await mongoose.connect(uri, { dbName: "moonsoftware" });
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log("Seeded jobs!");
  process.exit(0);
}

seedJobs();
