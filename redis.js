import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
   socket: {
    reconnectStrategy: false
  },
  RESP: 2
});

redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();

export default redisClient;