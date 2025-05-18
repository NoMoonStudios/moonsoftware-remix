import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler
} from "@remix-run/node";
import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import Cards from "~/models/Cards";

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

  let uploadedImageUrl: string | null = null;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, data, filename }) => {
      if (name === "image" && filename) {
      try {
        const url = await UploadFile(data);
        uploadedImageUrl = url;
        return url;
      } catch (err: any) {
        console.error("Image upload failed:", err);

        // Handle Cloudinary "file too large" error
        const isFileTooLarge =
          typeof err?.message === "string" &&
          /file.*too.*large|limit/i.test(err.message);

        if (isFileTooLarge) {
          throw new Response("Uploaded image is too large", {
            status: ErrorCodes.BAD_REQUEST, // e.g., 413 or define it yourself
          });
        }

        // Fallback to internal server error
        throw new Response("Image upload failed", {
          status: ErrorCodes.INTERNAL_SERVER_ERROR,
        });
      }
    }
    return undefined;
    },
    unstable_createMemoryUploadHandler()
  );

  try {
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    const title = formData.get("title");
    const description = formData.get("description");
    const tab = formData.get("tab");
    const image = formData.get("image");

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof tab !== "string" ||
      typeof image !== "string"
    ) {
      if (uploadedImageUrl) await DeleteFile(uploadedImageUrl);
      return new Response("Missing or invalid fields", { status: ErrorCodes.BAD_REQUEST });
    }

    await Cards.updateOne(
      { userid: userData.userid },
      { $push: { [`tabs.${tab}.items`]: { title, description, imageUrl: uploadedImageUrl || image } } }
    );
    
    return new Response("Item uploaded successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to handle form submission:", error);
    if (uploadedImageUrl) await DeleteFile(uploadedImageUrl);
    if (error instanceof Response) {
      return error;
    }
    return new Response("Internal server error", { status: ErrorCodes.INTERNAL_SERVER_ERROR });
  }
}
