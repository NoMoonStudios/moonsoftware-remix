import NodeCache from 'node-cache';
import nblx from "noblox.js";

const cache = new NodeCache({ stdTTL: 60 });
const cacheKey = 'totalMembers';

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
        return cachedResponse;
    }
    let totalMembers = 0;

    for (let index in groupIds) {
        try {
            const response = await nblx.getGroup(groupIds[index]);
            totalMembers += response.memberCount;
        } catch (er) {
            console.error('Failed to fetch group members:', er);
        }
    }

    const response = {
        success: true,
        count: totalMembers
    };

    cache.set(cacheKey, response);
    return response
}