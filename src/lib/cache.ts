import { createClient, RedisClientType } from "redis";
import { Env } from "./types";

export const makeRedisKeyFunc = (prefix: string) => (id: number | string) => `${prefix}:${id}`;

// Using the Redis cache is an optional feature
let cache: RedisClientType | undefined;

// If a REDIS_URL is provided, a Redis client will be created
if (process.env[Env.REDIS_URL]
    && process.env[Env.NODE_ENV] !== "test" // Prevents connecting to Redis during tests
    && process.env[Env.NEXT_PHASE] !== "phase-production-build" // Prevents connecting to Redis during next build
) {
    cache = createClient({
        url: process.env[Env.REDIS_URL],
        socket: {
            reconnectStrategy: 5000, // If disconnected, try to reconnect every 5 seconds
        },
        disableOfflineQueue: true, // If disconnected, commands are NOT queued, and are instead rejected
    });

    cache?.on("connect", () => console.log("Connected to Redis"));
    cache?.on("ready", () => console.log("Redis client is ready to use"));
    cache?.on("end", () => console.log("Redis connection has been closed"));
    cache?.on("reconnecting", () => console.log("Redis client is attempting to reconnect to server"));
    cache?.on("error", err => console.error("Redis error:", err));
}

if (cache && !cache.isOpen) {
    cache.connect();
}

export default cache;
