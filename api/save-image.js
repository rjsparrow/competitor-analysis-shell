import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { firmName, slot, imageData } = req.body;
    if (!firmName || !slot) return res.status(400).json({ error: 'firmName and slot required' });
    const key = `competitor:${firmName.toLowerCase().replace(/\s+/g, '-')}`;
    const existing = await redis.get(key) || { name: firmName };
    const images = { ...(existing.images || {}) };
    if (imageData) {
      images[slot] = imageData;
    } else {
      delete images[slot];
    }
    await redis.set(key, { ...existing, images });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
}
