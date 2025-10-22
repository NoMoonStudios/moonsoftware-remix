import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";


import JobManager from "../../lib/JobManager";

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();
  // Validate required fields
  if (!data.jobId || !data.name || !data.discord || !data.server || !data.why) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  // Add timestamp
  data.appliedAt = new Date().toISOString();
  // Save to DB
  await JobManager.addApplication(data);
  return json({ success: true });
};

export const loader = async () => {
  return json({ status: "ok" });
};
