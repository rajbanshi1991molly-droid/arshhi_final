import { Redis } from '@upstash/redis';
import jwt from 'jsonwebtoken';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET); // Throws error if invalid

    const { content } = req.body;
    await redis.set('homepage_content', content);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}
