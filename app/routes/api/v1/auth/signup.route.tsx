import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import RateLimiter from '~/lib/RateLimiter';
import dbConnect from "~/lib/connectDB";
import * as SharedFunctions from "~/lib/Utilities/shared";
import User from "~/models/User";
import { hash } from 'bcrypt';

const validAPIUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

interface BodyArgs {
    username: string;
    email: string;
    password: string;
    acceptedTerms: boolean;
    validateToken: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
    let canAccess = RateLimiter(request, "signup_get", 5 * 1000, 3)
    if (!canAccess) return new Response("Too many requests", { status: 429 });
    if (request.method !== "post") return new Response("Method not allowed", { status: 405 });
    const body = await request.body;
    return body
}

async function isTokenValid(token : string, ip : string) : Promise<boolean> {
    const res = await fetch(validAPIUrl, {
        method: "POST",
        body: JSON.stringify({
            secret: process.env.SECRET_KEY as string,
            response: token,
            remoteip: ip
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) return false;
    const output = await res.json()
    return output.success
}

async function generateID() {
    let userid = SharedFunctions.generateInRange(10_00_000, 9_99_99_999)
    let idData = await User.findOne({userid})
    if (idData) return generateID();
    return userid
}

export async function action({ request }: ActionFunctionArgs) {
    let canAccess = RateLimiter(request, "signup_post", 5 * 1000, 3)
    if (!canAccess) return new Response("Too many requests", { status: 429 });

    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = await request.json() as BodyArgs;

    if (!body.validateToken) return Response.json({ error: "Invalid captcha" });

    const ip = request.headers.get('CF-Connecting-IP');
    const isValidToken = await isTokenValid(body.validateToken, ip as string);
    if (!isValidToken) return Response.json({ error: "Invalid token" });
    
    if (!body.username) return Response.json({error: "Username is required"});
    if (!body.email) return Response.json({ error: "Email is required" });
    if (!body.password) return Response.json({ error: "Password is required" });
    if (!body.acceptedTerms) return Response.json({ error: "You must accept the terms of service" });
    if (!SharedFunctions.validateUsername(body.username.toLocaleLowerCase())) return Response.json({ error: "Username can only contain letters, numbers, and underscores" });
    if (!body.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) return Response.json({ error: "Email is invalid" });

    let { username, email, password } = body;
    username = username.toLowerCase();
    if (SharedFunctions.blacklistedUsernames.includes(username.toLowerCase())) return Response.json({ error: "Username is not allowed" });
    if (username.length < 3) return Response.json({ error: "Username must be at least 3 characters long" });
    if (username.length > 16) return Response.json({ error: "Username must be less than 16 characters long" });
    if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters long" });
    if (password.length > 64) return Response.json({ error: "Password must be less than 64 characters long" });

    await dbConnect();
    const user = await User.findOne({ username });
    if (user) return Response.json({ error: "Username is already taken" });
    const emailUser = await User.findOne({ email, isEmailVerified: true });
    if (emailUser) return Response.json({ error: "Email is already taken" });

    const passwordHash = await hash(password, 10)
    const userid = await generateID()

    let info = await User.create({
        displayName: username,
        username,
        userid,
        email,
        passwordHash,
        isEmailVerified: false,
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${SharedFunctions.generateInRange(0, 1e+8)}`,
        createdAt: new Date()
    })

    return Response.json({ success: true })
}