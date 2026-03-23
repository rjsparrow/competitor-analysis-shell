import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    const keys = await redis.keys('competitor:*');
    const competitors = {};
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        competitors[data.name] = data;
      }
    }
    
    res.status(200).json(competitors);
  } catch (error) {
    console.error('Error loading competitors:', error);
    res.status(500).json({ error: 'Failed to load competitors' });
  }
}
