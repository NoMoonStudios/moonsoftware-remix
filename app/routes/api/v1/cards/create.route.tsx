import { ActionFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import { GetUserCards, GetUserProfileData } from "~/lib/Utilities/server";
import ErrorCodes from "~/lib/json/errorCodes.json";
import Cards from "~/models/Cards";


export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_create", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  
  const user = await GetUserProfileData(request);
  if (!user) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  const existing = await GetUserCards(user);
  if (existing) return new Response("Cards already exists", { status: ErrorCodes.BAD_REQUEST });
  try {
     return new Response('Success', { status: 200 });
  } catch (error) {
    return new Response("Failed to create card", { status: ErrorCodes.INTERNAL_SERVER_ERROR });
  }
}