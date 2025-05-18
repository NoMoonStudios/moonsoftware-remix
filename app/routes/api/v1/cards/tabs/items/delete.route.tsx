import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile } from "~/lib/Utilities/ServerFunctions/Files";
import Cards from "~/models/Cards";
import { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "profile_update", 5 * 1000, 3);
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "profile_update", 5 * 1000, 3);
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });

  const userData = await ServerFunctions.GetUserData(request);
  if (!userData) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });

  const body = await request.json();
  if (!body) return new Response("Missing fields", { status: ErrorCodes.BAD_REQUEST });
  
  const { tab, item } = body;

  const cardDoc = await Cards.findOne({ userid: userData.userid });
  const targetItem = cardDoc?.tabs?.[tab]?.items?.[item];

  if (!targetItem) return new Response("Item not found", { status: ErrorCodes.NOT_FOUND });

  const imageUrl = targetItem.imageUrl;
  if (imageUrl) {
    await DeleteFile(imageUrl); 
  }

  await Cards.updateOne(
    { userid: userData.userid },
    { $unset: { [`tabs.${tab}.items.${item}`]: 1 } }
  );

  await Cards.updateOne(
    { userid: userData.userid },
    { $pull: { [`tabs.${tab}.items`]: null } }
  );

  return new Response("Success", { status: 200 });
}
