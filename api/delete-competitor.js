import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const key = `competitor:${name.toLowerCase().replace(/\s+/g, '-')}`;
    await redis.del(key);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to delete competitor:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
