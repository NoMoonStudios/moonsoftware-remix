import { ActionFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import { GetUserProfileData } from "~/lib/Utilities/server";
import ErrorCodes from "~/lib/json/errorCodes.json";
import Cards from "~/models/Cards";

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "tabs_action", 5 * 1000, 40);
  if (!canAccess)
    return new Response("Too many requests", {
      status: ErrorCodes.TOO_MANY_REQUESTS,
    });

  try {
    const user = await GetUserProfileData(request);
    if (!user)
      return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
    const body = await request.json();
    const name = body.name;
    if (!name)
      return new Response("Missing fields", { status: ErrorCodes.BAD_REQUEST });

    await Cards.updateOne(
      { userid: user.userid },
      { $pull: { tabs: { name: name } } }
    );
    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Failed to Add Tab", {
      status: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
