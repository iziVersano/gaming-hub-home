import { VercelRequest, VercelResponse } from '@vercel/node';
import * as nodemailer from 'nodemailer';
import { put, getDownloadUrl } from '@vercel/blob';

const WARRANTY_BLOB_NAME = 'warranty-records.json';
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@consoltech.co.il';

interface WarrantyRecord {
  id: string;
  customerName: string;
  email: string;
  product: string;
  serialNumber: string;
  invoiceUrl?: string;
  createdAt: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

async function getWarrantyRecords(): Promise<WarrantyRecord[]> {
  try {
    const url = await getDownloadUrl(WARRANTY_BLOB_NAME);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Not found');
    return (await response.json()) as WarrantyRecord[];
  } catch {
    return [];
  }
}

async function saveWarrantyRecord(record: WarrantyRecord) {
  const records = await getWarrantyRecords();
  records.push(record);
  await put(WARRANTY_BLOB_NAME, JSON.stringify(records));
}

async function deleteWarrantyRecord(id: string) {
  let records = await getWarrantyRecords();
  records = records.filter(r => r.id !== id);
  await put(WARRANTY_BLOB_NAME, JSON.stringify(records));
}

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@consoltech.co.il',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function GET(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');

  // TODO: Verify JWT token from Authorization header

  const records = await getWarrantyRecords();
  return res.status(200).json(records);
}

export async function POST(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');
  res.setHeader('Content-Type', 'application/json');

  const { customerName, email, product, serialNumber, invoiceUrl } = req.body;

  if (!customerName || !email || !product || !serialNumber) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['customerName', 'email', 'product', 'serialNumber'],
    });
  }

  const record: WarrantyRecord = {
    id: `war_${Date.now()}`,
    customerName,
    email,
    product,
    serialNumber,
    invoiceUrl,
    createdAt: new Date().toISOString(),
  };

  await saveWarrantyRecord(record);

  const customerEmailHtml = `
    <h2>Warranty Registration Confirmed</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for registering your warranty with Consoltech.</p>
    <ul>
      <li><strong>Product:</strong> ${product}</li>
      <li><strong>Serial Number:</strong> ${serialNumber}</li>
      <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
    </ul>
    <p>For support, please contact: <a href="mailto:${SALES_EMAIL}">${SALES_EMAIL}</a></p>
  `;

  const salesEmailHtml = `
    <h2>New Warranty Registration</h2>
    <p><strong>Customer:</strong> ${customerName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Product:</strong> ${product}</p>
    <p><strong>Serial Number:</strong> ${serialNumber}</p>
    <p><strong>Invoice:</strong> ${invoiceUrl ? `<a href="${invoiceUrl}">View</a>` : 'Not provided'}</p>
    <p><strong>Registration Date:</strong> ${new Date().toISOString()}</p>
  `;

  await sendEmail(email, 'Warranty Registration Confirmed', customerEmailHtml);
  await sendEmail(SALES_EMAIL, `New Warranty Registration - ${customerName}`, salesEmailHtml);

  return res.status(200).json({
    success: true,
    message: 'Warranty registration submitted successfully',
    recordId: record.id,
  });
}

export async function DELETE(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');

  // TODO: Verify JWT token from Authorization header

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Warranty ID is required' });
  }

  const records = await getWarrantyRecords();
  if (!records.find(r => r.id === id)) {
    return res.status(404).json({ error: 'Warranty record not found' });
  }

  await deleteWarrantyRecord(id);
  return res.status(200).json({ success: true });
}
