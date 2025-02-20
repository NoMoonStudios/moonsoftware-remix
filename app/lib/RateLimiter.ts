import { rateLimit } from 'express-rate-limit';

export default function(timeout = 5*60*1e3, maxRequests = 10 ) {
    return rateLimit({
        windowMs: timeout,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
    });
}