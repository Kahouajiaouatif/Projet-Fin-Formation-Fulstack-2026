import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.on("error", (err) => console.error("Erreur Redis:", err));
redisClient.on("connect", () => console.log("Redis connecté"));

await redisClient.connect();

export default redisClient;
