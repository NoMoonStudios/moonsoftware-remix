// Centralized Job and Application management for Moon Software
// This will be the single source of truth for jobs and applications (in-memory for now)

export type JobType = "Paid" | "Volunteer" | "Hybrid";
export type JobStatus = "Available" | "Unavailable";

export interface Job {
  _id?: string; // MongoDB _id
  jobId: string; // persistent unique job ID
  title: string;
  icon?: string;
  slug?: string;
  type: JobType;
  category: string;
  location: string;
  description: string;
  available: boolean;
}

export interface Application {
  _id?: string;
  id?: string;
  jobId: string;
  category: string;
  type: JobType;
  title: string;
  name: string;
  discord: string;
  server: string;
  appliedAt: string;
  why: string;
  status: string;
  mcq?: string[];
  tf?: string[];
  longAnswers?: string[];
}

import dbConnect from "./mongodb";
import { Job, Application } from "./models";
import { generateJobId } from "./generateJobId";

class JobManager {
  // --- Job Methods ---
  static async getJobs() {
    await dbConnect();
    return Job.find().lean();
  }
  static async getJobById(id: string) {
    await dbConnect();
    return Job.findById(id).lean();
  }
  static async addJob(job: Partial<Job>) {
    await dbConnect();
    // Ensure jobId is present (for all jobs, including default and new)
    let jobId = job.jobId;
    if (!jobId) {
      jobId = generateJobId();
    }
    // Remove _id if present (avoid duplicate key error)
    const { _id, ...jobData } = job;
    return Job.create({ ...jobData, jobId });
  }
  static async updateJob(id: string, updates: Partial<Job>) {
    await dbConnect();
    // Only update the fields provided
    return Job.findByIdAndUpdate(id, updates, { new: true }).lean();
  }
  static async toggleJobAvailable(id: string) {
    await dbConnect();
    const job = await Job.findById(id);
    if (!job) return null;
    job.available = !job.available;
    // Runtime fix: ensure jobId is always present
    if (!job.jobId) {
      job.jobId = generateJobId();
    }
    await job.save();
    return job;
  }
  static async removeJob(id: string) {
    await dbConnect();
    return Job.findByIdAndDelete(id);
  }

  // --- Application Methods ---
  static async getApplications() {
    await dbConnect();
    return Application.find().lean();
  }
  static async getApplicationsByJob(jobId: string) {
    await dbConnect();
    return Application.find({ jobId }).lean();
  }
  static async addApplication(app: Partial<Application>) {
    await dbConnect();
    return Application.create(app);
  }
  static async updateApplication(id: string, updates: Partial<Application>) {
    await dbConnect();
    return Application.findByIdAndUpdate(id, updates, { new: true }).lean();
  }
  static async removeApplication(id: string) {
    await dbConnect();
    return Application.findByIdAndDelete(id);
  }
}

export default JobManager;
