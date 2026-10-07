import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const content = await redis.get('homepage_content') || "Arshhi – Door to door beauty care";
    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
