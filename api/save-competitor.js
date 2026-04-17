import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const firmData = req.body;
    const key = `competitor:${firmData.name.toLowerCase().replace(/\s+/g, '-')}`;

    // Merge with existing data instead of overwriting
    const existing = await redis.get(key) || {};
    const merged = { ...existing, ...firmData };

    await redis.set(key, merged);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving competitor:', error);
    res.status(500).json({ error: 'Failed to save competitor' });
  }
}
