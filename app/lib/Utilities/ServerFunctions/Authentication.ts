import jwt from "jsonwebtoken";
import { createCookie } from "@remix-run/node";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export interface UserAccessParameters {
    id: number;
    username: string;
}

export interface UserRefreshParameters {
    id: number;
}

export const generateAccessToken = (user : UserAccessParameters) => {
    return jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export const generateRefreshToken = (user : UserRefreshParameters) => {
    return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export const decodeRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as UserRefreshParameters;
}

export const refreshTokenCookie = createCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production"
});