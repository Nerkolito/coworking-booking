import { createClient } from "redis";

// Säkerställer att en REDIS_URL finns i miljövariablerna
if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL in environment");
}

// Skapar en ny Redis-klient
const redis = createClient({
  url: process.env.REDIS_URL,
});

// Om något går fel med Redis visas felet i konsolen
redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Försöker ansluta till Redis och loggar resultatet
redis
  .connect()
  .then(() => console.log("✅ Redis connected"))
  .catch((err) => console.error("❌ Redis connection failed:", err));

// Exporterar Redis-klienten så att den kan användas i projektet
export default redis;
