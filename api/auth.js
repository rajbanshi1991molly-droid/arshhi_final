import crypto from 'node:crypto';
import { redis, PASSWORD_KEY, signToken, readBody } from './_lib.js';

// Constant-time string comparison.
const same = (a, b) => {
  const x = Buffer.from(String(a ?? ''));
  const y = Buffer.from(String(b ?? ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { action, username, password } = readBody(req);
    if (action !== 'login') return res.status(400).json({ error: 'Unknown action' });

    // Password: Redis key "admin_password" first, then ADMIN_PASSWORD env var.
    const stored = (await redis.get(PASSWORD_KEY)) ?? process.env.ADMIN_PASSWORD;
    // Username: ADMIN_USERNAME env var, default "admin".
    const user = process.env.ADMIN_USERNAME || 'admin';

    if (!stored || !same(username, user) || !same(password, stored)) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return res.status(200).json({ token: signToken(username) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
