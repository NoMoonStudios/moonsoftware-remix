import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";


import JobManager from "../../lib/JobManager";

export async function action({ request }: ActionFunctionArgs) {
  const { _id } = await request.json();
  if (!_id) return json({ error: "Missing job _id" }, { status: 400 });
  const job = await JobManager.toggleJobAvailable(_id);
  if (!job) return json({ error: "Job not found" }, { status: 404 });
  return json({ success: true, available: job.available });
}

export const loader = () => json({ error: "Method not allowed" }, { status: 405 });
