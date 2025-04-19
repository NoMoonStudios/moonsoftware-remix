import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile } from "~/lib/Utilities/ServerFunctions/Files";

export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
  
  const userSchema = await ServerFunctions.GetUserSchema(request);
  if (!userSchema) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  try {
    await DeleteFile(userSchema.banner);
    userSchema.set({
      banner : '',
    });

    await userSchema.save();
    await ServerFunctions.ClearUserCache(userSchema.userid);

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.log(err);
    
    return new Response("Failed to Remove Banner", { status: 400 });
  }
}