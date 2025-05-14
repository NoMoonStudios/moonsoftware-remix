import RateLimiter from "~/lib/RateLimiter";
import ErrorCodes from "~/lib/json/errorCodes.json";
import * as ServerFunctions from "~/lib/Utilities/server";
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import Cards, { CardsItem } from "~/models/Cards";
import { unstable_createMemoryUploadHandler } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const canAccess = RateLimiter(request, "tabs_action", 5 * 1000, 3);
  if (!canAccess) {
    return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  }
  return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
}

export async function action({ request }: ActionFunctionArgs) {
  const canAccess = RateLimiter(request, "tabs_action", 5 * 1000, 3);
  if (!canAccess) {
    return new Response("Too many requests", { status: ErrorCodes.TOO_MANY_REQUESTS });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: ErrorCodes.METHOD_NOT_ALLOWED });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 5_000_000) {
    
    return new Response("Upload too large", { status: ErrorCodes.BAD_REQUEST });
  }

  const user = await ServerFunctions.GetUserData(request);
  if (!user) {
    return new Response("Unauthorized", { status: ErrorCodes.UNAUTHORIZED });
  }

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
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 12_000_000 }); // 12MB
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    if (!formData) {
      await DeleteUploaded();
      return new Response("Failed to parse form data", { status: ErrorCodes.BAD_REQUEST });
    }

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const imageFile = formData.get("image");
    const tab = formData.get("tab")?.toString().trim();

    if (!title || !description || !imageFile || !tab) {
      await DeleteUploaded();
      console.warn("Missing required fields", { title, description, imageFile, tab });
      return new Response("Missing fields", { status: ErrorCodes.BAD_REQUEST });
    }

    let imageUrl: string;
    try {
      if (typeof imageFile === "object" && imageFile instanceof File) {
        const buffer = new Uint8Array(await imageFile.arrayBuffer());
        imageUrl = await UploadFile((async function* () {
          yield buffer;
        })());
        uploadedFiles.push(imageUrl);
      } else {
        await DeleteUploaded();
        return new Response("Invalid image upload", { status: ErrorCodes.BAD_REQUEST });
      }
    } catch (uploadErr) {
      console.error("Upload failed", uploadErr);
      await DeleteUploaded();
      return new Response("Image upload failed", { status: ErrorCodes.INTERNAL_SERVER_ERROR });
    }

    const card: CardsItem = {
      title,
      description,
      imageUrl
    };

    const key = `tabs.${tab}.items`;
    await Cards.updateOne(
      { userid: user.userid },
      { $push: { [key]: { $each: [card] } } }
    );

    return new Response("Success", { status: ErrorCodes.SUCCESS });
  } catch (err) {
    console.error("Unexpected error in tabs action handler:", err);
    try {
      await DeleteUploaded();
    } catch (deleteErr) {
      console.error("Error deleting uploaded files:", deleteErr);
    }
    return new Response("Internal server error", { status: ErrorCodes.INTERNAL_SERVER_ERROR });
  }
}
