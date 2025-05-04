
export * as Authentication from "./ServerFunctions/Authentication";
import { UserInfo } from "~/types/init";
import dbConnect from "../connectDB";
import redisDB from "../redisDB";
import { Authentication } from './server';
import User from "~/models/User";
import Card, { CardsInfo } from "~/models/Cards";

let client: Awaited<ReturnType<typeof redisDB>>;
(async () => {
    await dbConnect();
    client = await redisDB();
})();

export async function GetUserCards(user: UserInfo): Promise<CardInfo | null> {
    const userId = user.userid;
    
    if (client) {
      const cached = await client.get(`cards:${userId}`);
      if (cached) return JSON.parse(cached);
    }
    
    const Cards = await Card.findOne({
      $or: [
        { _id: user.portfolioid, userid: userId }, // Uses compound index
        { userid: userId } 
      ]
    }).lean();
  
    if (Cards) {
      if (client) await client.set(`cards:${userId}`, JSON.stringify(Cards), { EX: 60 });
    }
    
    return Cards;
  }

async function getAdditionalUserData(user: UserInfo) {
    const Cards = await GetUserCards(user);
    
    return { ...user, isPortfolioEnabled: (Cards?.enabled || false) };
}
export async function GetUserByUsername(username: string){
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
    const data = await getAdditionalUserData(schema.toObject());
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {passwordHash, __v, _id, ...userData} = data;
    if (client) {
        await client.set(`userprofile:${username}`, JSON.stringify(userData), { EX: 60 });
    }
    return userData
}

export async function GetUserProfileByUsername(username: string) {
    const userData = await GetUserByUsername(username)
    if (!userData) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {sessions, email, discord, isEmailVerified, ...publicUserData} = userData;
    return publicUserData
}

export async function GetUserId(request: Request) {
    const cookies = request.headers.get("Cookie");
    
    if (!cookies) return
    
    try {
      const refreshToken = await Authentication.refreshTokenCookie.parse(cookies);
      const userInfo = await Authentication.decodeRefreshToken(refreshToken);
      return userInfo.id.toString();
    } catch (error) {
      return
    }
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
    if (!userid) return null;
  
    const [userCache, portfolioCache] = await Promise.all([
      client ? client.get(`private_userdata:${userid}`) : null,
      client ? client.get(`cards:${userid}`) : null
    ]);
  
    if (userCache && portfolioCache) {
      return {
        ...JSON.parse(userCache),
        isPortfolioEnabled: JSON.parse(portfolioCache)?.enabled || false
      };
    }
  
    const [user, Cards] = await Promise.all([
      User.findOne({ userid }).lean(),
      GetUserCards({ userid } as UserInfo)
    ]);
  
    if (!user) return null;
    if (client) await Promise.all([
      client.set(`private_userdata:${userid}`, JSON.stringify(user), { EX: 60 }),
      client.set(`cards:${userid}`, JSON.stringify(Cards), { EX: 60 })
    ]);
  
    return {
      ...user,
      isPortfolioEnabled: Cards?.enabled || false
    };
  }

export async function ClearUserCache(userid: string) {
    ClearProfileCache(userid);
    ClearCardsCache(userid);
}

export async function ClearProfileCache(userid: string) {
    if (client) {
        await client.del(`private_userdata:${userid}`); 
        await dbConnect();
        const data = await GetUserSchemaWithUserId(userid)
        if (!data) return
        await client.del(`userprofile:${data.username}`); 
    }
}

export async function ClearCardsCache(userid: string) {
    if (client) {
        await client.del(`cards:${userid}`); 
    }
}

export async function GetUserData(request: Request) {
    const data = await GetUserPrivateData(request);
    if (!data) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, __v, _id, sessions, ...userData } = data
    
    return userData
}

export async function GetUserProfileData(request: Request) {
    const data = await GetUserData(request)
    if (!data) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {sessions, email, discord, isEmailVerified, ...publicUserData} = data
    return publicUserData
}

export function GetUserInfoServer(userSchema: any) {
    throw new Error("Function not implemented.");
}
