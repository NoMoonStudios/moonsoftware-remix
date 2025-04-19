import type { LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from '~/lib/RateLimiter';
import ErrorCodes from "~/lib/json/errorCodes.json";
import Portfolio from "~/models/Portfolio";
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
  const schema = await Portfolio.findOne({ userid: userInfoCache.userid });
  if (!schema || (!schema.enabled && userId != userInfoCache.userid)) return new Response("Portfolio not found", { status: 404 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {__v, _id,...existingPortfolio} = schema.toObject();
  

  if (existingPortfolio) {
    return Response.json({
      ...existingPortfolio, 
      isVerified: userInfoCache.isVerified, 
      username: userInfoCache.username,
      badges: userInfoCache.badges,
      createdAt: userInfoCache.createdAt,
      ...(existingPortfolio.displayName == '' ? { displayName: userInfoCache.displayName } : {displayName: existingPortfolio.displayName}),
      ...(existingPortfolio.avatar ? { avatar: existingPortfolio.avatar } : {avatar: userInfoCache.avatar}),
    });
  } else {
    return new Response("Portfolio not found", { status: 404 });
  }
}