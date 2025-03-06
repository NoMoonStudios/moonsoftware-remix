import { LoaderFunctionArgs } from "@remix-run/node";
import nblx from "noblox.js";
import redisDB from "~/lib/redisDB";

const cacheKey = 'games';

const groupIds = [
    14051320, // Moon Software
    12374322, // Secure-Contain-Protect
    8933657,  // Blox Fruits Unofficial
    33939812, // Exhuma Studios
    34694589, // Hangout Sanctuary
    35074133, // Moon Software UGC
    14801655, // NoDivison
    4300678,  // Whipped Cafe
    35323819, // Studio Enso
    35323806, // Studio Vivre
    34415548, // Dwh Studios
    32390302, // Skyward Interactive
    34420496, // Group 311
]

export async function loader({ request }: LoaderFunctionArgs) {
    const client = await redisDB();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    const cachedResponse = await client.get(cacheKey);
    if (cachedResponse) {
        return Response.json(JSON.parse(cachedResponse));
    }
    let gameVisits = 0;
    let totalGames = 0;

    for (let index in groupIds) {
        try {
            const response = await nblx.getGroupGames(groupIds[index], "Public");
            totalGames += response.length
            for (let gIndex in response) {
                let gameInfo = response[gIndex]
                gameVisits += gameInfo.placeVisits
            }
        } catch (er) {
            console.error('Failed to fetch group members:', er);
        }
    }

    const response = {
        success: true,
        count: {
            gameVisits,
            totalGames
        }
    };

    await client.set(cacheKey, JSON.stringify(response), { EX: 120 });
    return Response.json(response);
}