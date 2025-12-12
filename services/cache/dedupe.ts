import redis from "./redisClient";

export async function isDuplicate(
  mailId: string,
  ttlSeconds = 600
): Promise<boolean> {
  const result = await redis.set(mailId, "1", "EX", ttlSeconds, "NX");

  return result === null;
}
