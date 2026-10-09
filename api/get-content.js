import { redis, CONTENT_KEY, parseContent } from './_lib.js';

// Public, read-only. Returns { content: <saved site data or null> }.
// The homepage (index.html) and the admin panel both read the "content" field.
// Saving is done by /api/save-content (login required).
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const raw = await redis.get(CONTENT_KEY);
    const content = parseContent(raw);
    return res.status(200).json({ content: content && typeof content === 'object' ? content : null });
  } catch (err) {
    // Redis unreachable: homepage keeps its built-in content; admin shows a load error.
    return res.status(500).json({ error: 'Could not read content', content: null });
  }
}
