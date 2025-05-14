import { ActionFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import { ClearCardsCache, GetUserCards, GetUserProfileData } from "~/lib/Utilities/server";
import ErrorCodes from "~/lib/json/errorCodes.json";
import Cards from "~/models/Cards";

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_create", 5 * 1000, 3);
  if (!canAccess)
    return new Response("Too many requests", {
      status: ErrorCodes.TOO_MANY_REQUESTS,
    });

  const user = await GetUserProfileData(request);
  if (!user)
    return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  const existing = await GetUserCards(user);
  if (existing)
    return new Response("Cards already exists", {
      status: ErrorCodes.BAD_REQUEST,
    });
  try {
    await Cards.create({
      userid: user.userid,
      tabs: [],
      banner: user.banner,
      displayName: user.displayName,
      avatar: user.avatar,
      enabled: false,
      updated: new Date(),
      layout: "card",
      about: user.bio,
      links: [],
      showTimestamps: false,
    });
    ClearCardsCache(user.userid);
    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Failed to create card", {
      status: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
