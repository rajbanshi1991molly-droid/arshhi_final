import { Redis } from '@upstash/redis';
import jwt from 'jsonwebtoken';

// Vercel's Redis (Upstash) integration injects either UPSTASH_REDIS_REST_* or KV_REST_API_*.
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redis = new Redis({ url, token });

export const CONTENT_KEY = 'homepage_content';
export const PASSWORD_KEY = 'admin_password';

export function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set in Vercel environment variables');
  return s;
}

export function signToken(user) {
  return jwt.sign({ user }, getSecret(), { expiresIn: '1d' });
}

export function verifyRequest(req) {
  const header = req.headers.authorization || '';
  const tok = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!tok) return false;
  try { jwt.verify(tok, getSecret()); return true; } catch { return false; }
}

// Body may arrive parsed (object) or as a raw string.
export function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'string') { try { return JSON.parse(b); } catch { return {}; } }
  return b;
}

// Upstash auto-parses JSON; stored value may be an object or a JSON string.
export function parseContent(raw) {
  if (raw && typeof raw === 'object') return raw;
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return raw; } }
  return null;
}
