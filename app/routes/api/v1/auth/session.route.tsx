import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import * as ServerFunctions from "~/lib/Utilities/server";
import ErrorCodes from "~/lib/json/errorCodes.json";

import User from "~/models/User";

const AuthenticationFunctions = ServerFunctions.Authentication;

export async function loader({ request }: LoaderFunctionArgs) {
    let canAccess = RateLimiter(request, "signup_get", 5 * 1000, 20)
    if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
    const cookies = request.headers.get("Cookie");
    try {
        const refreshToken = await AuthenticationFunctions.refreshTokenCookie.parse(cookies);
        const userInfo = await AuthenticationFunctions.decodeRefreshToken(refreshToken);
        const userid = Number(userInfo.id);
        const userSchema = await User.findOne({ userid });
        const userData = ServerFunctions.GetUserInfoServer(userSchema);
        return Response.json(userData)
    } catch (er) {
        return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
    }
}