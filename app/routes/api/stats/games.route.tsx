import NodeCache from 'node-cache';
import nblx from "noblox.js";
import { json } from "@remix-run/node";

const cache = new NodeCache({ stdTTL: 60 });
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

export async function loader() {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        return Response.json(cachedResponse);
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

    cache.set(cacheKey, response);
    return Response.json(response);
}