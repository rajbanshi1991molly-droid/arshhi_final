import { redis, CONTENT_KEY, verifyRequest, readBody } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!verifyRequest(req)) return res.status(401).json({ error: 'Invalid or expired session token' });
    const { content } = readBody(req);
    if (content === undefined || content === null) return res.status(400).json({ error: 'No content provided' });
    await redis.set(CONTENT_KEY, content);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
