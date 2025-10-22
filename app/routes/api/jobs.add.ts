import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import JobManager from "../../lib/JobManager";

export const action: ActionFunction = async ({ request }) => {
  try {
    const job = await request.json();
    if (!job.title || !job.type || !job.category || !job.location || !job.description) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = await JobManager.addJob(job);
    return json({ job: created });
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 500 });
  }
};

export default null;
