import { Injectable } from '@nestjs/common';
import { JsonStorageService } from '../storage/json-storage.service';
import { EmailService } from '../email/email.service';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class WarrantyService {
  constructor(private storage: JsonStorageService, private emailService: EmailService) {}

  async submitWarranty(
    data: {
      customerName: string;
      email: string;
      phone?: string;
      product: string;
      serialNumber: string;
      purchaseDate?: string;
      storeName?: string;
    },
    file?: { buffer: Buffer; originalName: string; mimetype: string },
  ) {
    let invoiceUrl: string | undefined;
    let invoicePath: string | undefined;
    if (file) {
      ({ invoiceUrl, invoicePath } = await this.storage.saveInvoiceFile(file.buffer, file.originalName, file.mimetype));
    }

    const record = await this.storage.saveWarrantyRecord({
      ...data,
      invoiceUrl,
      invoicePath,
      invoiceFileName: file?.originalName,
    });

    // Send email non-blocking
    try {
      await this.emailService.sendWarrantyToSales(
        data.customerName,
        data.email,
        data.product,
        data.serialNumber,
        file?.originalName,
        data.phone,
        data.purchaseDate,
        data.storeName,
      );
    } catch (error) {
      console.error('Email send failed (non-blocking):', error);
    }

    return { success: true, message: 'Warranty registration submitted successfully', id: record.id };
  }

  async getAllRecords() {
    return this.storage.getWarrantyRecords();
  }

  async deleteRecord(identifier: string) {
    const records = await this.storage.getWarrantyRecords();
    const record = records.find((r) => r.rowKey === identifier || r.serialNumber === identifier || r.id.toString() === identifier);

    if (!record) {
      return { success: false, message: 'Warranty record not found' };
    }

    // Delete locally stored file if it exists (Supabase-stored invoices are
    // removed by the storage layer inside deleteWarrantyRecord)
    if (record.invoiceUrl && record.invoiceUrl.startsWith('/uploads/')) {
      try {
        const filePath = join(process.cwd(), 'uploads', record.invoiceUrl.split('/').pop() || '');
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Failed to delete invoice file:', error);
      }
    }

    const deleted = await this.storage.deleteWarrantyRecord(identifier);
    return { success: deleted, message: deleted ? 'Warranty record deleted' : 'Failed to delete record' };
  }
}
