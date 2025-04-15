import { ActionFunctionArgs, LoaderFunctionArgs, unstable_parseMultipartFormData } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import { UploadHandlerPart } from "@remix-run/node";


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
  
  try {
    if (!userSchema) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
    const formData = await unstable_parseMultipartFormData(
      request,
      async ({ name, data, filename }: UploadHandlerPart): Promise<string | File> => {
        if (name === "avatar") {
          if (filename) {
            return await UploadFile(data);
          }
        }
        if (filename) return filename;
        const chunks = [];
        for await (const chunk of data) chunks.push(chunk);
        return Buffer.concat(chunks).toString('utf-8');
    });
    if (!formData) return new Response("Failed to parse form data", { status: 400 });
    const displayName = formData.get("displayName");
    const avatar = formData.get("avatar");

    userSchema.displayName = displayName || userSchema.displayName;
    if (avatar) {
      if (userSchema.avatar) await DeleteFile(userSchema.avatar);
      userSchema.avatar = avatar
    }
    await userSchema.save();

    return new Response("Success", { status: 200 });
    
  } catch (err) {
    console.log(err);
    
    return new Response("Failed to parse form data", { status: 400 });
  }
}