
export * as Authentication from "./ServerFunctions/Authentication";
import { UserInfo } from "~/types/init";
import dbConnect from "../connectDB";
import redisDB from "../redisDB";
import { Authentication } from './server';
import User from "~/models/User";
export async function GetUserByUsername(username: string){
    await dbConnect();
    const client = await redisDB();
    let userInfoCache: UserInfo | undefined  = undefined
    try {
    const cache = await client.get(`userprofile:${username}`)
    if (cache) {
        userInfoCache = JSON.parse(cache)
    }
    } catch (er) { 
        // Can't connect to redis.
    }
    if (userInfoCache) return userInfoCache
    const schema = (await User.findOne({ username: username }))
    if (!schema) return
    const data = schema.toObject();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {passwordHash, __v, _id, ...userData} = data;
    if (client) {
        await client.set(`userprofile:${username}`, JSON.stringify(userData), { EX: 60 });
    }
    return userData
}

export async function GetUserProfileByUsername(username: string) {
    const userData = await GetUserByUsername(username)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {sessions, email, discord, isEmailVerified, ...publicUserData} = userData;
    return publicUserData
}

export async function GetUserId(request: Request) {
    const cookies = request.headers.get("Cookie");
    
    if (!cookies) return
    const refreshToken = await Authentication.refreshTokenCookie.parse(cookies);
    const userInfo = await Authentication.decodeRefreshToken(refreshToken);
    return userInfo.id.toString();
}

async function GetUserSchemaWithUserId(userid: string): Promise<UserInfo | null> {
    return await User.findOne({ userid })
} 

export async function GetUserSchema(request: Request): Promise<UserInfo | null> {
    const userid = await GetUserId(request);
    if (!userid) return null
    return await GetUserSchemaWithUserId(userid)
}

export async function GetUserPrivateData(request: Request) {
    const userid = await GetUserId(request);
    if (!userid) return
    await dbConnect();
    const client = await redisDB();
    try {
        const userInfoCache = await client.get(`private_userdata:${userid}`)
        if (userInfoCache) {
            return JSON.parse(userInfoCache)
        }
    } catch (er) { 
        // Can't connect to redis.
     }

    try {
        const schema = await GetUserSchemaWithUserId(userid)
        if (!schema) return
        const data = (schema).toObject();
        
        if (client) {
            await client.set(`private_userdata:${userid}`, JSON.stringify(data), { EX: 60 })
        }
        return data
    } catch (er) {
        return
    }
}

export async function ClearUserCache(userid: string) {
    const client = await redisDB();
    if (client) {
        await client.del(`private_userdata:${userid}`); 
        await dbConnect();
        const data = await GetUserSchemaWithUserId(userid)
        if (!data) return
        await client.del(`userprofile:${data.username}`); 
    }
}

export async function GetUserData(request: Request) {
    const data = await GetUserPrivateData(request);
    if (!data) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {passwordHash, __v, _id, ...userData} = data
    
    return userData
}

export async function GetUserProfileData(request: Request) {
    const data = await GetUserData(request)
    if (!data) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {sessions, email, discord, isEmailVerified, ...publicUserData} = data
    return publicUserData
}