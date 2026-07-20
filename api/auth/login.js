import { issueToken, verifyPassword } from '../_lib/admin-auth.js';

// POST /api/auth/login  ->  { token, email }
// Replaces the /auth/login route the suspended Render/NestJS backend served.
// Response shape matches LoginResponse in src/lib/api.ts.

/** Vercel parses JSON bodies, but fall back to reading the stream. */
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { ADMIN_JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_JWT_SECRET || !ADMIN_EMAIL || !(ADMIN_PASSWORD_HASH || ADMIN_PASSWORD)) {
    return res.status(503).json({
      success: false,
      message: 'Admin auth not configured (set ADMIN_JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH)',
    });
  }

  try {
    const body = await readJsonBody(req);
    const email = body?.email?.trim?.() || '';
    const password = body?.password || '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Same generic message on both failure modes so the response does not
    // reveal whether the email exists.
    const emailOk = email.toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    if (!emailOk || !verifyPassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({ token: issueToken(email, ADMIN_JWT_SECRET), email });
  } catch (error) {
    console.error('Login handler error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
