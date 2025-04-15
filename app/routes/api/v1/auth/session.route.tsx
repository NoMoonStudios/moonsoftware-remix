import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import * as ServerFunctions from "~/lib/Utilities/server";
import ErrorCodes from "~/lib/json/errorCodes.json";

export async function loader({ request }: LoaderFunctionArgs) {
    const canAccess = RateLimiter(request, "signup_get", 5 * 1000, 50)
    if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
    const data = await ServerFunctions.GetUserData(request);
    if (data) return new Response(JSON.stringify(data), { status: 200 });
    return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
}