// ~/app/routes/portfolio.ts
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import Portfolio, { PortfolioInfo } from "~/models/Portfolio";
import RateLimiter from '~/lib/RateLimiter';
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import { GetUserProfileData, ClearUserCache } from "~/lib/Utilities/server";
import LinkData from "~/lib/Modules/LinkData";

// Platform configuration and helpers

const PLATFORM_CONFIG = LinkData
const PLATFORMS = Object.keys(PLATFORM_CONFIG)
const URL_PREFIXES = Object.fromEntries(
  PLATFORMS.map((p) => [p, PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG].url])
);
// Base schema without any refinements
const BaseLinkSchema = z.object({
  url: z.string().url(),
  iconColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  text: z.string().optional(),
  iconUrl: z.string().url().optional()
});

// Custom platform schema
const CustomLinkSchema = BaseLinkSchema.extend({
  platform: z.literal("custom"),
  iconUrl: z.string().url().refine(url => url.startsWith("http"), {
    message: "iconUrl requires valid URL"
  }).optional()
})

// Standard platform schema
const StandardLinkSchema = BaseLinkSchema.extend({
  platform: z.enum(PLATFORMS.filter(p => p !== "custom") as [string, ...string[]]),
  url: z.string().url(),
  iconUrl: z.never().optional().refine(val => !val, {
    message: "iconUrl only allowed for custom platform"
  })
})
// Combined discriminated union
const PortfolioLinkSchema = z.discriminatedUnion("platform", 
  [CustomLinkSchema, StandardLinkSchema]
).refine(({ platform, url }) => 
  platform !== "custom" && url.startsWith(URL_PREFIXES[platform]),
  {
    message: "url must start with platform prefix"
  }
);


const PortfolioSchema = z.object({
  displayName: z.string().optional(),
  about: z.string().optional(),
  enabled: z.boolean().optional(),
  showTimestamps: z.boolean().optional(),
  links: z.array(PortfolioLinkSchema).optional()
});

// Rate limit checker
async function checkRateLimit(request: Request) {
  return RateLimiter(request, "portfolio_update", 5000, 3);
}

// Process file uploads and cleanup
async function processFiles(
  existing: typeof Portfolio,
  files: Record<string, string | null>
) {
  for (const [field, value] of Object.entries(files)) {
    if (value) {
      if (existing?.[field as keyof typeof existing]) {
        await DeleteFile(existing[field as keyof typeof existing] as string);
      }
    }
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function savePortfolioData(userId: string, data: any) {
  await Portfolio.updateOne(
    { userid: userId },
    { 
      $set: {
        ...data,
        updated: new Date(),
        userid: userId
      }
    },
    { upsert: true }
  );
  await ClearUserCache(userId);
}

// Main action handler
export async function action({ request }: ActionFunctionArgs) {
  if (!(await checkRateLimit(request))) {
    return new Response("Too many requests", { status: 429 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const user = await GetUserProfileData(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      async ({ name, data, filename }) => {
        if (name === "avatar" || name === "banner") {
          return filename ? UploadFile(data) : null;
        }
        if (filename) return null
        
        const chunks = [];
        for await (const chunk of data) chunks.push(chunk);
        return Buffer.concat(chunks).toString('utf-8');
      }
    );

    const jsonData = formData.get("data")?.toString() || "{}";
    const parsedData = PortfolioSchema.parse(JSON.parse(jsonData));
    await processFiles(user.userid, {
      avatar: formData.get("avatar") as string,
      banner: formData.get("banner") as string
    });

    await savePortfolioData(user.userid, parsedData);

    return new Response("Success", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.errors), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.error("Update failed:", error);
    return new Response("Invalid request", { status: 400 });
  }
}

// Loader for GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await checkRateLimit(request))) {
    return new Response("Too many requests", { status: 429 });
  }
  return new Response("Method not allowed", { status: 405 });
}