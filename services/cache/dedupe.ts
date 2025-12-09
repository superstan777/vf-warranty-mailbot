// src/lib/redis/dedupe.ts
import redis from "./redisClient";

export async function isDuplicate(
  notificationId: string,
  ttlSeconds = 60
): Promise<boolean> {
  const result = await redis.set(notificationId, "1", "EX", ttlSeconds, "NX");
  return result === null;
}
