import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import * as ServerFunctions from "~/lib/Utilities/server";

import Ranks from "~/models/Ranks";
import User from "~/models/User";

import ErrorCodes from "~/lib/json/errorCodes.json";

const AuthenticationFunctions = ServerFunctions.Authentication;

export async function loader({ request }: LoaderFunctionArgs) {
    const limiter = RateLimiter(request)
    if (!limiter) return new Response(JSON.stringify({ error: "Too many requests, slow down!" }), { status: 429 });
    
    const cookies = request.headers.get("Cookie");

    try {
        const refreshToken = await AuthenticationFunctions.refreshTokenCookie.parse(cookies);
        const userInfo = await AuthenticationFunctions.decodeRefreshToken(refreshToken);
        const userid = Number(userInfo.id);
        const userSchema = await User.findOne({ userid });
        const userData = ServerFunctions.GetUserInfoServer(userSchema);
        const rankNumber = userData.rank ? Number(userData.rank) : -1;
        const rankInfo = await Ranks.findOne({ rankId : rankNumber });
        return Response.json(rankInfo.toObject())
    } catch (er) {
        return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
    }
}