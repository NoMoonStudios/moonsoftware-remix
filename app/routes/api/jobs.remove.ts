import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import JobManager from "../../lib/JobManager";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { _id } = await request.json();
    if (!_id) return json({ error: "Missing _id" }, { status: 400 });
    const job = await JobManager.removeJob(_id);
    if (!job) return json({ error: "Job not found" }, { status: 404 });
    return json({ success: true });
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 500 });
  }
};

export default null;
