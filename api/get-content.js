import { redis, CONTENT_KEY, parseContent } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const raw = await redis.get(CONTENT_KEY);
    const content = parseContent(raw) ?? 'Arshhi – Door to door beauty care';
    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
