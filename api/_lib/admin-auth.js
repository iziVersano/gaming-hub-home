import crypto from 'node:crypto';

// Shared admin auth for the Vercel serverless functions.
// Files under api/_lib/ are not routed as endpoints (leading underscore).
//
// Replaces the JWT the suspended Render/NestJS backend used to issue, so the
// existing admin login screen keeps working. Tokens are standard HS256 JWTs
// signed with ADMIN_JWT_SECRET.
//
// Required env:
//   ADMIN_JWT_SECRET   - long random string; signing key
//   ADMIN_EMAIL        - the admin login email
//   ADMIN_PASSWORD_HASH  scrypt hash, format: scrypt$<saltHex>$<keyHex>
//     ...or ADMIN_PASSWORD for a plaintext comparison (simpler, less safe).
// Optional:
//   ADMIN_API_KEY      - static bearer for non-browser callers (curl, scripts)

const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8h, matching the old backend

const b64url = (buf) => Buffer.from(buf).toString('base64url');

/** Constant-time compare that tolerates length mismatch. */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

/** Issue an HS256 JWT for the given admin email. */
export function issueToken(email, secret) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({ sub: email, role: 'admin', iat: now, exp: now + TOKEN_TTL_SECONDS }),
  );
  const body = `${header}.${payload}`;
  return `${body}.${sign(body, secret)}`;
}

/** Verify an HS256 JWT. Returns the payload, or null if invalid/expired. */
export function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  if (!safeEqual(signature, sign(`${header}.${payload}`, secret))) return null;

  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof claims.exp !== 'number' || claims.exp < Math.floor(Date.now() / 1000)) return null;
  return claims;
}

/** Verify a submitted password against ADMIN_PASSWORD_HASH or ADMIN_PASSWORD. */
export function verifyPassword(password) {
  const { ADMIN_PASSWORD_HASH, ADMIN_PASSWORD } = process.env;

  if (ADMIN_PASSWORD_HASH) {
    const [scheme, saltHex, keyHex] = ADMIN_PASSWORD_HASH.split('$');
    if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
    const expected = Buffer.from(keyHex, 'hex');
    let actual;
    try {
      actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    } catch {
      return false;
    }
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  }

  if (ADMIN_PASSWORD) return safeEqual(password, ADMIN_PASSWORD);
  return false;
}

/**
 * Gate an admin-only request.
 * Accepts either a JWT from the admin login, or the static ADMIN_API_KEY
 * (kept so curl/scripts that already use it keep working).
 * Returns { ok: true } or { ok: false, status, message } for the caller to send.
 */
export function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }
  const presented = auth.slice('Bearer '.length);

  const { ADMIN_API_KEY, ADMIN_JWT_SECRET } = process.env;

  if (ADMIN_API_KEY && safeEqual(presented, ADMIN_API_KEY)) return { ok: true };

  if (!ADMIN_JWT_SECRET) {
    return { ok: false, status: 503, message: 'Admin auth not configured (set ADMIN_JWT_SECRET)' };
  }
  if (verifyToken(presented, ADMIN_JWT_SECRET)) return { ok: true };

  return { ok: false, status: 401, message: 'Unauthorized' };
}
