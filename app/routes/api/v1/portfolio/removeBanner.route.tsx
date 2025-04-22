import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile } from "~/lib/Utilities/ServerFunctions/Files";
import Portfolio from "~/models/Portfolio";

export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "portfolio_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
  const userData = await ServerFunctions.GetUserData(request);
  if (!userData) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  
  const portfolioSchema = await ServerFunctions.GetUserPortfolio(userData);
  if (!portfolioSchema) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  try {
    await DeleteFile(portfolioSchema.banner);
    await Portfolio.updateOne({ userid: portfolioSchema.userid }, { banner: "" });
    await ServerFunctions.ClearPortfolioCache(portfolioSchema.userid);

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.log(err);
    
    return new Response("Failed to Remove Banner", { status: 400 });
  }
}