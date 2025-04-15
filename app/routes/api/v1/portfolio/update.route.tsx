import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import Portfolio from "~/models/Portfolio";
import * as ServerFunctions from "~/lib/Utilities/server";

export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
  
  const body = await request.json();
  const userInfo = await ServerFunctions.GetUserProfileData(request);
  const userid = userInfo.userid;
  
  const existingPortfolio = await Portfolio.findOne({ userid: userid });

  if (existingPortfolio) {
    
    existingPortfolio.updated = new Date();
    if (body.layout !== undefined) existingPortfolio.layout = body.layout;
    if (body.bio !== undefined) existingPortfolio.bio = body.bio;
    if (body.banner !== undefined) existingPortfolio.banner = body.banner;
    if (body.avatar !== undefined) existingPortfolio.avatar = body.avatar;
    if (body.links !== undefined) existingPortfolio.links = body.links;
    await existingPortfolio.save();
  } else {
    
    await Portfolio.create({
      userid: userid,
      layout: body.layout || 'card',
      updated: new Date(),
      bio: body.bio || userInfo?.bio || '',
      banner: body.banner || userInfo?.banner || '',
      avatar: body.avatar || userInfo?.avatar || '',
      links: [],
    });
  }
  
  return new Response("Success", { status: 200 });
}