import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpUser && smtpPassword) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
      this.isConfigured = true;
    }
  }

  async sendWarrantyToSales(
    customerName: string,
    customerEmail: string,
    product: string,
    serialNumber: string,
    invoiceFileName?: string,
    phone?: string,
    purchaseDate?: string,
    storeName?: string,
  ): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('Email service not configured. Skipping email send.');
      return false;
    }

    try {
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@consoltech.co.il';
      const fromName = process.env.SMTP_FROM_NAME || 'Consoltech';
      const salesEmail = process.env.SALES_EMAIL || 'sales@consoltech.co.il';

      const subject = `רישום אחריות חדש - ${product} (${serialNumber})`;
      const invoiceLine = invoiceFileName
        ? `<tr><td style='padding: 8px 0; color: #777;'>חשבונית:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${invoiceFileName} (מצורף)</td></tr>`
        : "<tr><td style='padding: 8px 0; color: #777;'>חשבונית:</td><td style='padding: 8px 0; color: #333;'>לא צורפה</td></tr>";
      const phoneLine = phone ? `<tr><td style='padding: 8px 0; color: #777;'>טלפון:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${phone}</td></tr>` : '';
      const dateLine = purchaseDate ? `<tr><td style='padding: 8px 0; color: #777;'>תאריך רכישה:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${purchaseDate}</td></tr>` : '';
      const storeLine = storeName ? `<tr><td style='padding: 8px 0; color: #777;'>שם חנות:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${storeName}</td></tr>` : '';

      const htmlBody = `
<!DOCTYPE html>
<html dir='rtl' lang='he'>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;'>
        <div style='background: linear-gradient(135deg, #c40000, #a80000); padding: 24px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0; font-size: 22px;'>רישום אחריות חדש</h1>
        </div>
        <div style='padding: 24px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr><td style='padding: 8px 0; color: #777;'>שם הלקוח:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${customerName}</td></tr>
                <tr><td style='padding: 8px 0; color: #777;'>אימייל:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'><a href='mailto:${customerEmail}'>${customerEmail}</a></td></tr>
                ${phoneLine}
                <tr><td style='padding: 8px 0; color: #777;'>מוצר:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${product}</td></tr>
                <tr><td style='padding: 8px 0; color: #777;'>מספר סידורי:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>${serialNumber}</td></tr>
                ${dateLine}
                ${storeLine}
                ${invoiceLine}
            </table>
        </div>
    </div>
</body>
</html>`;

      await this.transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: salesEmail,
        replyTo: customerEmail,
        subject,
        html: htmlBody,
      });

      console.log(`✓ Warranty submission email sent to ${salesEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send warranty email:', error);
      return false;
    }
  }
}
