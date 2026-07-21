import { issueToken } from '../_lib/admin-auth.js';

// POST /api/auth/bypass  ->  { token, email }
//
// Credential-free admin sign-in. Mints a real HS256 admin JWT (the same kind
// /api/auth/login issues) WITHOUT checking any email/password, so admin-gated
// endpoints such as /api/warranty accept the resulting token.
//
// ⚠️ SECURITY: this is an intentional, product-owner-approved convenience.
// Anyone who can reach this endpoint can obtain full admin access and read or
// delete customer warranty records (which contain personal data). Disable it
// by setting ALLOW_ADMIN_BYPASS=false in the environment.
//
// Required env: ADMIN_JWT_SECRET (signing key). Optional: ADMIN_EMAIL (token
// subject; defaults to a placeholder since the guard only checks the signature).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { ADMIN_JWT_SECRET, ADMIN_EMAIL, ALLOW_ADMIN_BYPASS } = process.env;

  // Enabled by default; set ALLOW_ADMIN_BYPASS=false to turn it off.
  if (String(ALLOW_ADMIN_BYPASS).toLowerCase() === 'false') {
    return res.status(403).json({ success: false, message: 'Bypass login is disabled' });
  }
  if (!ADMIN_JWT_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Admin auth not configured (set ADMIN_JWT_SECRET)',
    });
  }

  const email = (ADMIN_EMAIL && ADMIN_EMAIL.trim()) || 'admin@consoltech.com';
  return res.status(200).json({ token: issueToken(email, ADMIN_JWT_SECRET), email });
}
