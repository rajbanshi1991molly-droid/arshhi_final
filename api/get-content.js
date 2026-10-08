import { redis, CONTENT_KEY, parseContent } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const c = parseContent(await redis.get(CONTENT_KEY));
    return res.status(200).json({ content: c && typeof c === 'object' ? c : {} });
  } catch (err) {
    const pick = (v) => (v || '').replace(/^https?:\/\//, '').split('.')[0] || 'NOT SET';
    return res.status(500).json({
      error: err.message,
      host: err.cause?.hostname || null,
      upstash_url: pick(process.env.UPSTASH_REDIS_REST_URL),
      kv_url: pick(process.env.KV_REST_API_URL)
    });
  }
}
