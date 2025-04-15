import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import ErrorCodes from "~/lib/json/errorCodes.json";
import { GetUserProfileByUsername } from "~/lib/Utilities/server";


export async function loader({ request, params }: LoaderFunctionArgs) {
    const canAccess = RateLimiter(request, "profile_get", 60 * 1000, 40)
    if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
    if (!canAccess) return new Response(JSON.stringify({ error: "Too many requests, slow down!" }), { status: 429 });
    
    if (!params.username) return new Response("User not found", { status: 404 });
    const profileData = await GetUserProfileByUsername(params.username);
    if (!profileData) return new Response("User not found", { status: 404 });
    return Response.json(profileData)
}