import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import JobManager from "../../lib/JobManager";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { _id, updates } = await request.json();
    if (!_id || !updates) return json({ error: "Missing _id or updates" }, { status: 400 });
    const job = await JobManager.updateJob(_id, updates);
    if (!job) return json({ error: "Job not found" }, { status: 404 });
    return json({ job });
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 500 });
  }
};

export default null;
