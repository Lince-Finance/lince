import { v4 as uuidv4 } from 'uuid';
import { getRedis } from './redisClient';

interface MfaSessionData {
    email: string;
    session: string;
}

export async function createMfaEphemeralSession(email: string, session: string, ttlMs: number): Promise<string> {
    const redis = getRedis();
    const token = uuidv4();

    const payload = JSON.stringify({ email, session });
    await redis.set(token, payload, 'PX', ttlMs, 'NX');

    return token;
}

export async function getMfaEphemeralSession(token: string): Promise<MfaSessionData | null> {
    const redis = getRedis();
    const dataStr = await redis.get(token);
    if (!dataStr) return null;
    return JSON.parse(dataStr) as MfaSessionData;
}

export async function consumeMfaEphemeralSession(token: string): Promise<void> {
    const redis = getRedis();
    await redis.del(token);
}
