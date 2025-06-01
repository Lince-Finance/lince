import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 60_000,   
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

export const userRateLimiter = rateLimit({
  windowMs: 60_000,      
  max: 20,               
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    
    if ((req as any).user?.sub) return (req as any).user.sub;

    
    return req.ip || (req.headers['cf-connecting-ip'] as string | undefined) || '';
  },
});
