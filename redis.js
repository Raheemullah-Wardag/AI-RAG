import { createClient } from 'redis';

const redisClient = createClient({
  host: 'localhost',
  port: 6379
});

redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();

export default redisClient;