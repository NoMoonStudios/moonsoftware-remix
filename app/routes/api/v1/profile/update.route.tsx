import { ActionFunctionArgs, LoaderFunctionArgs, unstable_parseMultipartFormData } from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import { UploadHandlerPart } from "@remix-run/node";


export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "profile_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "profile_update", 5 * 1000, 3)
  if (!canAccess) return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
  
  const userSchema = await ServerFunctions.GetUserSchema(request);
  
  const uploadedFiles: string[] = [];
  const DeleteUploaded = async () => {
    for (const url of uploadedFiles) {
      try {
        await DeleteFile(url);
      } catch (err) {
        console.error("Error deleting file:", url, err);
      }
    }
  };
  try {
    if (!userSchema) return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
    
    const formData = await unstable_parseMultipartFormData(
      request,
      async ({ name, data, filename }: UploadHandlerPart): Promise<string | null> => {
        if (name == "avatar" || name == "banner") {
          if (filename) {
            const url = await UploadFile(data);
            uploadedFiles.push(url);
            return url;
          }
          return null
        }
        if (filename) return null
        if (!data) return null
        
        const chunks = [];
        for await (const chunk of data) chunks.push(chunk);
        return Buffer.concat(chunks).toString('utf-8');
    });
    if (!formData) {
      await DeleteUploaded();
      return new Response("Failed to parse form data", { status: 400 });
    }
    
    const updates: Record<string, any> = {};
    
    const displayName = formData.get("displayName");
    if (typeof displayName === "string") {
      updates.displayName = displayName;
    }
    
    const bio = formData.get("bio");
    if (typeof bio === "string") {
      updates.bio = bio;
    }
    
    const pronouns = formData.get("pronouns");
    if (typeof pronouns === "string") {
      updates.pronouns = pronouns;
    }
    
    const avatar = formData.get("avatar");
    if (avatar && typeof avatar === "string") {
      DeleteFile(userSchema.avatar);
      updates.avatar = avatar;
    }
    
    const banner = formData.get("banner");
    if (banner && typeof banner === "string") {
      DeleteFile(userSchema.banner);
      updates.banner = banner;
    }
    
    if (!Object.keys(updates).length) {
      return new Response("No valid fields provided to update", { status: 400 });
    }
    
    userSchema.set(updates);
    await userSchema.save();
    await ServerFunctions.ClearProfileCache(userSchema.userid);

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.log(err);
    try { await DeleteUploaded(); } catch (deleteErr) {
      console.error('Error deleting uploaded files:', deleteErr);
    }
    return new Response("Failed to parse form data", { status: 400 });
  }
}