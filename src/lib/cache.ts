import { createClient, RedisClientType } from 'redis';

// Using the redis cache is an optional feature
let cache: RedisClientType | undefined;

// If a REDIS_URL is provided, a redis client will be created
if (process.env.REDIS_URL && process.env.NODE_ENV !== 'test') {
    cache = createClient({
        url: process.env.REDIS_URL,
        socket: {
            reconnectStrategy: 5000 // If disconnected, try to reconnect every 5 seconds
        },
        disableOfflineQueue: true // If disconnected, commands are NOT queued, and are instead rejected
    });

    cache?.on('connect', () => console.log('Connected to Redis'));
    cache?.on('ready', () => console.log('Redis client is ready to use'));
    cache?.on('end', () => console.log('Redis connection has been closed'));
    cache?.on('reconnecting', () => console.log('Redis client is attempting to reconnect to server'));
    cache?.on('error', err => console.error('Redis error:', err));
}

if (cache && !cache.isOpen) {
    cache.connect();
}

export default cache;
