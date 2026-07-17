import { put, list } from '@vercel/blob';
import Busboy from 'busboy';

// Warranty registration endpoint (replaces the suspended Render backend).
// Storage: Vercel Blob — one JSON blob per submission under warranty/records/,
// invoice files under warranty/invoices/. Both use random URL suffixes so
// they are not guessable; listing requires the store token.

const MAX_FILE_SIZE = 4 * 1024 * 1024; // Vercel request body limit is 4.5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const REQUIRED_FIELDS = ['customerName', 'email', 'product', 'serialNumber'];

/** Collect the raw request body (Vercel may or may not have buffered it). */
async function getRawBody(req) {
  if (req.body && Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

/** Parse multipart/form-data into { fields, file }. */
function parseMultipart(rawBody, contentType) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let file = null;
    const busboy = Busboy({
      headers: { 'content-type': contentType },
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    });
    busboy.on('field', (name, value) => {
      fields[name] = value;
    });
    busboy.on('file', (name, stream, info) => {
      const chunks = [];
      let truncated = false;
      stream.on('data', (c) => chunks.push(c));
      stream.on('limit', () => {
        truncated = true;
      });
      stream.on('end', () => {
        if (truncated) {
          reject(Object.assign(new Error('File too large'), { statusCode: 413 }));
          return;
        }
        file = {
          fieldName: name,
          fileName: info.filename,
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });
    busboy.on('error', reject);
    busboy.on('finish', () => resolve({ fields, file }));
    busboy.end(rawBody);
  });
}

/** Fire-and-forget email to sales if SMTP is configured (parity with the old backend). */
async function sendWarrantyEmail(record) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return;
  try {
    const { default: nodemailer } = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: (SMTP_PORT || '587') === '465',
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    const row = (label, value) =>
      value
        ? `<tr><td style="padding:8px 0;color:#777;">${label}:</td><td style="padding:8px 0;color:#333;font-weight:bold;">${value}</td></tr>`
        : '';
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Consoltech'} <${process.env.SMTP_FROM_EMAIL || 'noreply@consoltech.co.il'}>`,
      to: process.env.SALES_EMAIL || 'sales@consoltech.co.il',
      replyTo: record.email,
      subject: `רישום אחריות חדש - ${record.product} (${record.serialNumber})`,
      html: `<!DOCTYPE html><html dir="rtl" lang="he"><body style="font-family:Arial,sans-serif;direction:rtl;text-align:right;">
        <h2>רישום אחריות חדש</h2>
        <table style="border-collapse:collapse;">
          ${row('שם הלקוח', record.customerName)}
          ${row('אימייל', record.email)}
          ${row('טלפון', record.phone)}
          ${row('מוצר', record.product)}
          ${row('מספר סידורי', record.serialNumber)}
          ${row('תאריך רכישה', record.purchaseDate)}
          ${row('שם חנות', record.storeName)}
          ${row('חשבונית', record.invoiceUrl ? `<a href="${record.invoiceUrl}">${record.invoiceFileName || 'קובץ'}</a>` : 'לא צורפה')}
        </table></body></html>`,
    });
  } catch (error) {
    console.error('Email send failed (non-blocking):', error);
  }
}

async function handlePost(req, res) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return res.status(400).json({ success: false, message: 'Expected multipart/form-data' });
  }

  const rawBody = await getRawBody(req);
  let parsed;
  try {
    parsed = await parseMultipart(rawBody, contentType);
  } catch (error) {
    const status = error.statusCode || 400;
    return res.status(status).json({ success: false, message: error.message || 'Invalid form data' });
  }
  const { fields, file } = parsed;

  const missing = REQUIRED_FIELDS.filter((f) => !fields[f] || !String(fields[f]).trim());
  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
  }
  if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  if (file && !ALLOWED_TYPES.includes(file.mimeType)) {
    return res.status(400).json({ success: false, message: 'Invalid file type' });
  }

  // Store invoice file
  let invoiceUrl;
  if (file && file.buffer.length) {
    const safeName = (file.fileName || 'invoice').replace(/[^\w.\-]+/g, '_');
    const blob = await put(`warranty/invoices/${safeName}`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.mimeType,
    });
    invoiceUrl = blob.url;
  }

  // Store record as its own blob (no read-modify-write races)
  const rowKey = `warranty-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const record = {
    rowKey,
    customerName: fields.customerName.trim(),
    email: fields.email.trim(),
    phone: fields.phone?.trim() || null,
    product: fields.product.trim(),
    serialNumber: fields.serialNumber.trim(),
    purchaseDate: fields.purchaseDate || null,
    storeName: fields.storeName?.trim() || null,
    invoiceUrl: invoiceUrl || null,
    invoiceFileName: file?.fileName || null,
    createdAt: new Date().toISOString(),
  };
  await put(`warranty/records/${rowKey}.json`, JSON.stringify(record, null, 2), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json',
  });

  await sendWarrantyEmail(record);

  return res.status(201).json({ success: true, message: 'Warranty registration submitted successfully', id: rowKey });
}

async function handleGet(req, res) {
  // Admin listing — requires ADMIN_API_KEY env var to be configured
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(503).json({ success: false, message: 'Admin listing not configured (set ADMIN_API_KEY)' });
  }
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${adminKey}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const records = [];
  let cursor;
  do {
    const page = await list({ prefix: 'warranty/records/', cursor, limit: 1000 });
    const fetched = await Promise.all(
      page.blobs.map((b) => fetch(b.url).then((r) => (r.ok ? r.json() : null)).catch(() => null)),
    );
    records.push(...fetched.filter(Boolean));
    cursor = page.cursor;
  } while (cursor);

  records.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  return res.status(200).json(records);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') return await handlePost(req, res);
    if (req.method === 'GET') return await handleGet(req, res);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Warranty handler error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
