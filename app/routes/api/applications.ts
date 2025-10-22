import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import JobManager from "../../lib/JobManager";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  let applications;
  if (jobId) {
    applications = await JobManager.getApplicationsByJob(jobId);
  } else {
    applications = await JobManager.getApplications();
  }
  return json({ applications });
};

export default null;
