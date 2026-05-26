"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const nodemailer = require("nodemailer");
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@consoltech.co.il';
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
    },
});
let warrantyRecordsCache = [];
async function getWarrantyRecords() {
    return warrantyRecordsCache;
}
async function saveWarrantyRecord(record) {
    warrantyRecordsCache.push(record);
}
async function deleteWarrantyRecord(id) {
    warrantyRecordsCache = warrantyRecordsCache.filter(r => r.id !== id);
}
async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER || 'noreply@consoltech.co.il',
            to,
            subject,
            html,
        });
    }
    catch (error) {
        console.error('Failed to send email:', error);
    }
}
async function handler(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        if (req.method === 'GET') {
            const records = await getWarrantyRecords();
            return res.status(200).json(records);
        }
        if (req.method === 'POST') {
            const { customerName, email, product, serialNumber, invoiceUrl } = req.body;
            if (!customerName || !email || !product || !serialNumber) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['customerName', 'email', 'product', 'serialNumber'],
                });
            }
            const record = {
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
        if (req.method === 'DELETE') {
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
        res.status(405).json({ error: 'Method not allowed' });
    }
    catch (error) {
        console.error('Warranty handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
