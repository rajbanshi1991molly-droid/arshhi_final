import crypto from 'node:crypto';
import { redis, PASSWORD_KEY, signToken, readBody } from './_lib.js';

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

    let stored = null;
    try { stored = await redis.get(PASSWORD_KEY); } catch { /* Redis down: use env password */ }
    if (stored === null || stored === undefined) stored = process.env.ADMIN_PASSWORD;
    const user = process.env.ADMIN_USERNAME || 'admin';

    if (!stored || !same(username, user) || !same(password, stored)) {
      return res.status(401).json({
        error: `Wrong username or password [passwordSet=${!!stored} userOk=${same(username, user)} passOk=${stored ? same(password, stored) : false} jwtSet=${!!process.env.JWT_SECRET}]`
      });
    }
    return res.status(200).json({ token: signToken(username) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
