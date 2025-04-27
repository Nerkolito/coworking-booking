import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("❌ Redis Client Error", err));

redis.connect(); // Important to connect!

export default redis;
