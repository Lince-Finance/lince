import { randomBytes } from 'crypto';
import { getRedis } from './redisClient';

export async function createEphemeralToken(payload: string, ttlMs = 10 * 60 * 1000): Promise<string> {
    const redis = getRedis();  
    const token = randomBytes(16).toString('hex');

    await redis.set(token, payload, 'PX', ttlMs, 'NX');
    return token;
}

export async function validateEphemeralToken(token: string): Promise<string | null> {
    const redis = getRedis();
    const value = await redis.get(token);
    return value || null;
}

export async function consumeEphemeralToken(token: string): Promise<string | null> {
    const redis = getRedis();
    const pipeline = redis.multi();
    pipeline.get(token);
    pipeline.del(token);
    const results = await pipeline.exec();
    const payload = results?.[0]?.[1] as string | null;
    return payload || null;
}
