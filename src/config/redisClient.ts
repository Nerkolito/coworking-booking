import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL in environment");
}

// Create Redis client
const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redis
  .connect()
  .then(() => console.log("✅ Redis connected"))
  .catch((err) => console.error("❌ Redis connection failed:", err));

export default redis;
