import { Redis } from '@upstash/redis';
import jwt from 'jsonwebtoken';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, username, password, currentPassword, newPassword } = req.body;
  const SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

  // Fallback defaults if variables aren't set yet
  let masterUser = process.env.ADMIN_USERNAME || 'admin';
  let masterPass = String((await redis.get('admin_password')) || process.env.ADMIN_PASSWORD || 'password123');

  if (action === 'login') {
    if (username === masterUser && password === masterPass) {
      const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (action === 'changePassword') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      jwt.verify(token, SECRET);

      if (currentPassword !== masterPass) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
      }

      await redis.set('admin_password', newPassword);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(401).json({ error: 'Session expired' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
