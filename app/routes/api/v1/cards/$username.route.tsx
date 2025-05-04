import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import ErrorCodes from "~/lib/json/errorCodes.json";
import Cards from "~/models/Cards";
import dbConnect from "~/lib/connectDB";
import { GetUserId, GetUserProfileByUsername } from "~/lib/Utilities/server";


export async function loader({ request, params }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "profile_get", 60 * 1000, 40)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  
  
  if (!params.username) return new Response("User not found", { status: 404 });
  const userInfoCache = await GetUserProfileByUsername(params.username);
  if (!userInfoCache) return new Response("User not found", { status: 404 });
  const userId = await GetUserId(request);
  await dbConnect();
  const schema = await Cards.findOne({ userid: userInfoCache.userid });
  if (!schema || (!schema.enabled && userId != userInfoCache.userid)) return new Response("Cards not found", { status: 404 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {__v, _id,...existingCards} = schema.toObject();
  

  if (existingCards) {
    return Response.json({
      ...existingCards, 
      isVerified: userInfoCache.isVerified, 
      username: userInfoCache.username,
      badges: userInfoCache.badges,
      createdAt: userInfoCache.createdAt,
      ...(existingCards.displayName == '' ? { displayName: userInfoCache.displayName } : {displayName: existingCards.displayName}),
      ...(existingCards.avatar ? { avatar: existingCards.avatar } : {avatar: userInfoCache.avatar}),
    });
  } else {
    return new Response("Cards not found", { status: 404 });
  }
}