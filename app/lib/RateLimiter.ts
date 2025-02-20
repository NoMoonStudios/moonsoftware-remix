const rateLimitMap = new Map();

export default function (request : Request, windowMs = 10 * 1e3, maxRequests = 10) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter((t: number) => now - t < windowMs);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
        return false
    }

    return true
}