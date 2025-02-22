const rateLimitMap = new Map<string, Map<string, number[]>>();

export default function (request: Request, label: string = "global", windowMs = 10 * 1e3, maxRequests = 10) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${label}`;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, new Map());
    }

    const userLimits = rateLimitMap.get(ip)!;
    if (!userLimits.has(label)) {
        userLimits.set(label, []);
    }

    const timestamps = userLimits.get(label)!.filter((t: number) => now - t < windowMs);
    timestamps.push(now);
    userLimits.set(label, timestamps);

    if (timestamps.length > maxRequests) {
        return false;
    }

    return true;
}