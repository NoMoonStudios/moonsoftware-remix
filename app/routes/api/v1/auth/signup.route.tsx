import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import RateLimiter from '~/lib/RateLimiter';
import dbConnect from "~/lib/connectDB";
import { blacklistedUsernames, generateInRange } from "~/lib/functions";
import User from "~/models/User";
import crypto from "crypto";
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
    let userid = generateInRange(10_00_000, 9_99_99_999)
    let idData = await User.findOne({userid})
    if (idData) return generateID();
    return userid
}

export async function action({ request }: ActionFunctionArgs) {
    let canAccess = RateLimiter(request, "signup_post", 5 * 1000, 3)
    if (!canAccess) return new Response("Too many requests", { status: 429 });

    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = await request.json() as BodyArgs;

    if (!body.validateToken) return { error: "Invalid token" };

    const ip = request.headers.get('CF-Connecting-IP');
    const isValidToken = await isTokenValid(body.validateToken, ip as string);
    if (!isValidToken) return { error: "Invalid token" };
    
    if (!body.username) return {error: "Username is required"};
    if (!body.email) return { error: "Email is required" };
    if (!body.password) return { error: "Password is required" };
    if (!body.acceptedTerms) return { error: "You must accept the terms of service" };

    const { username, email, password } = body;
    if (blacklistedUsernames.includes(username.toLowerCase())) return { error: "Username is not allowed" };
    if (username.length < 3) return { error: "Username must be at least 3 characters long" };
    if (username.length > 16) return { error: "Username must be less than 16 characters long" };
    if (password.length < 8) return { error: "Password must be at least 8 characters long" };
    if (password.length > 64) return { error: "Password must be less than 64 characters long" };

    await dbConnect();
    const user = await User.findOne({ username });
    if (user) return { error: "Username is already taken" };
    const emailUser = await User.findOne({ email });
    if (emailUser) return { error: "Email is already taken" };

    const passwordHash = await hash(password, 10)
    const userid = await generateID()

    let info = await User.create({
        displayName: username,
        username,
        userid,
        email,
        passwordHash,
        isEmailVerified: false,
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${generateInRange(0, 1e+8)}`,
        createdAt: new Date()
    })

    return { success: true }
}