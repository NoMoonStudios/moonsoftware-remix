import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import JobManager from "../../lib/JobManager";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { _id, updates } = await request.json();
    if (!_id || !updates) return json({ error: "Missing _id or updates" }, { status: 400 });
    const app = await JobManager.updateApplication(_id, updates);
    if (!app) return json({ error: "Application not found" }, { status: 404 });
    return json({ app });
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 500 });
  }
};

export default null;
