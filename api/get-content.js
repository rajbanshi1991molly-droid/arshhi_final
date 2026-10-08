import { redis, CONTENT_KEY, parseContent } from './_lib.js';

// Public read endpoint used by index.html, social.js and admin.html.
// Returns { content: {...} } (wrapped), which is what all three expect.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const c = parseContent(await redis.get(CONTENT_KEY));
    return res.status(200).json({ content: c && typeof c === 'object' ? c : {} });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
