import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";

import RateLimiter from '~/lib/RateLimiter';
import dbConnect from "~/lib/connectDB";
import User from "~/models/User";
import { compare } from 'bcrypt';

const AuthenticationFunctions = ServerFunctions.Authentication;

export async function loader({ request }: LoaderFunctionArgs) {
    const canAccess = RateLimiter(request, "signin_get", 5 * 1000, 3)
    if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
    return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
    const canAccess = RateLimiter(request, "signin_post", 5 * 1000, 3)
    if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
    if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });

    const body = await request.json()
    let username = body.username
    const password = body.password

    if (!username || !password) return new Response("Missing fields", { status: ErrorCodes.BAD_REQUEST });
    username = username.toLowerCase();

    await dbConnect();
    const user = await User.findOne({ username: username });
    if (!user) return new Response("Invalid credentials", { status: ErrorCodes.UNAUTHORIZED });

    const passwordHash = user.passwordHash
    const compared = await compare(password, passwordHash);
    if (!compared) return new Response("Invalid credentials", { status: ErrorCodes.UNAUTHORIZED });


    const accessToken = AuthenticationFunctions.generateAccessToken({ id: user.userid, username: user.username });
    const refreshToken = AuthenticationFunctions.generateRefreshToken({ id: user.userid });

    const refreshCookie = await AuthenticationFunctions.refreshTokenCookie.serialize(refreshToken);

    return Response.json({accessToken}, {
        headers: {
            "Set-Cookie": refreshCookie
        }
    })
}