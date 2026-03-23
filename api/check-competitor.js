import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }

  try {
    const key = `competitor:${name.toLowerCase().replace(/\s+/g, '-')}`;
    const exists = await redis.exists(key);
    
    res.status(200).json({ exists: exists === 1 });
  } catch (error) {
    console.error('Error checking competitor:', error);
    res.status(500).json({ error: 'Failed to check competitor' });
  }
}
