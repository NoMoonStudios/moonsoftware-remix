// ~/app/routes/portfolio.ts
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import Portfolio, { PortfolioInfo } from "~/models/Portfolio";
import RateLimiter from '~/lib/RateLimiter';
import { DeleteFile, UploadFile } from "~/lib/Utilities/ServerFunctions/Files";
import { GetUserProfileData,  ClearUserCache, GetUserPortfolio } from "~/lib/Utilities/server";
import LinkData from "~/lib/Modules/LinkData";
import { UserInfo } from "~/types/init";
import User from "~/models/User";

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
  form: {
    [key: string]: unknown;
  },
  existing: PortfolioInfo | null,
  files: Record<string, string | null>
) {
  const newData: { [key: string]: string | null } = {}
  for (const [field, value] of Object.entries(files)) {
    if (!value) continue
    if (existing?.[field as keyof PortfolioInfo]) {
      await DeleteFile(existing[field as keyof PortfolioInfo] as string);
    }
    newData[field] = value;
  }
  
  return {
    ...form,
    ...newData
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function savePortfolioData(user: UserInfo, data: any) {
  await Promise.all([
    Portfolio.updateOne(
      { userid: user.userid },
      { ...data, updated: new Date() }
    ),
    User.updateOne(
      { userid: user.userid },
      { isPortfolioEnabled: data.enabled }
    )
  ]);
  
  await ClearUserCache(user.userid);
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
  const portfolio = await GetUserPortfolio(user);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const formData = await unstable_parseMultipartFormData(
    request,
    async ({ name, data, filename }) => {
      if (name === "avatar" || name === "banner") {
        if (filename) return await UploadFile(data)
        else {
          const chunks = [];  for await (const chunk of data) chunks.push(chunk);
          return Buffer.concat(chunks).toString('utf-8');
        }
      }
      if (filename) return null
      
      const chunks = [];
      for await (const chunk of data) chunks.push(chunk);
      return Buffer.concat(chunks).toString('utf-8');
    }
  );
  const jsonData = formData.get("data")?.toString() || "{}";
  const parsedData = PortfolioSchema.parse(JSON.parse(jsonData));
  const finalData = await processFiles(parsedData, portfolio, {
    avatar: formData.get("avatar") as string,
    banner: formData.get("banner") as string
  });
  await savePortfolioData(user, finalData);
  return new Response("Success", { status: 200 });
}

// Loader for GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await checkRateLimit(request))) {
    return new Response("Too many requests", { status: 429 });
  }
  return new Response("Method not allowed", { status: 405 });
}