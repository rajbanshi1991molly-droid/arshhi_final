import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    let content = await redis.get('homepage_content');
    if (typeof content === 'string') {
      try { content = JSON.parse(content); } catch { content = null; }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ content: content || null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
