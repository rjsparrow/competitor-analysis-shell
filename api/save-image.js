import { put, del } from '@vercel/blob';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { firmName, slot, imageData } = req.body;
    if (!firmName || !slot) return res.status(400).json({ error: 'firmName and slot required' });

    const key = `competitor:${firmName.toLowerCase().replace(/\s+/g, '-')}`;
    const existing = await redis.get(key) || { name: firmName };
    const images = { ...(existing.images || {}) };

    if (imageData) {
      // Delete old blob if there's an existing URL (not base64 legacy data)
      if (images[slot] && images[slot].startsWith('https://')) {
        await del(images[slot]).catch(() => {});
      }

      // Convert base64 to buffer and upload to Blob
      const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const filename = `${firmName.toLowerCase().replace(/\s+/g, '-')}-${slot}-${Date.now()}.jpg`;

      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });

      images[slot] = blob.url;
    } else {
      // Deleting an image
      if (images[slot] && images[slot].startsWith('https://')) {
        await del(images[slot]).catch(() => {});
      }
      delete images[slot];
    }

    await redis.set(key, {
