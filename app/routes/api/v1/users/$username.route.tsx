import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import redisDB from "~/lib/redisDB";
import User from "~/models/User";
import * as ServerFunctions from "~/lib/Utilities/server";


export async function loader({ request, params }: LoaderFunctionArgs) {
    const limiter = RateLimiter(request)
    if (!limiter) return new Response(JSON.stringify({ error: "Too many requests, slow down!" }), { status: 429 });
    
    const client = await redisDB();
    
    try {
        const userProfileCache = await client.get(`userprofile:${params.username}`)
        if (userProfileCache) {
            return Response.json(JSON.parse(userProfileCache))
        }
    } catch (er) { 
        // Can't connect to redis.
    }
    
    const userSchema = await User.findOne({ username: params.username });
    if (!userSchema) return new Response("User not found", { status: 404 });
    const profileData = ServerFunctions.GetPublicUserProfileServer(userSchema);
    if (client) {
        await client.set(`userprofile:${params.username}`, JSON.stringify(profileData), { EX: 30 })
    }
    return Response.json(profileData)
}