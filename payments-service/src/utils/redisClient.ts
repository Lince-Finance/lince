
import Redis, { RedisOptions } from 'ioredis';

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
  if (redisInstance) return redisInstance;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('[Redis] Missing REDIS_URL');

  const needsTls = redisUrl.startsWith('redis://');
  const opts: RedisOptions = needsTls ? { tls: {} } : {};

  
  redisInstance = new Redis(redisUrl, opts);

  redisInstance.on('connect', () => {
    console.log(`[Redis] Connected successfully to => ${redisUrl}`);
  });

  redisInstance.on('error', (err) => {
    console.error('[Redis] Connection error =>', err);
  });

  return redisInstance;
}
