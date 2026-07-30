import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL as string;

export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});