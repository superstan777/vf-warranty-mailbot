import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6380,
  password: process.env.REDIS_PASSWORD,
  tls: {},
});

export default redis;
