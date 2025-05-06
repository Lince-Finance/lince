import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 12,
  standardHeaders: true,
  legacyHeaders:  false,
  
  skipFailedRequests: false,
});


export const userRateLimiter = rateLimit({
  windowMs: 60_000,      
  max: 20,               
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if ((req as any).user?.sub) return (req as any).user.sub;

    const realIp = (req.headers['cf-connecting-ip'] as string|undefined) || req.ip;
    if (!realIp) return '';

    
    if (realIp.includes(':')) return realIp.split(':').slice(0,4).join(':');
    return realIp;
  },
});

export const csrfRateLimiter = rateLimit({
  windowMs: 60_000,          
  max: 30,                   
  standardHeaders: true,
  legacyHeaders  : false,
});