import { Injectable } from '@nestjs/common';
import { JsonStorageService } from '../storage/json-storage.service';
import { EmailService } from '../email/email.service';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class WarrantyService {
  constructor(private storage: JsonStorageService, private emailService: EmailService) {}

  async submitWarranty(data: {
    customerName: string;
    email: string;
    product: string;
    serialNumber: string;
    invoiceUrl?: string;
    invoiceFileName?: string;
  }) {
    const record = await this.storage.saveWarrantyRecord(data);

    // Send email non-blocking
    try {
      await this.emailService.sendWarrantyToSales(
        data.customerName,
        data.email,
        data.product,
        data.serialNumber,
        data.invoiceFileName,
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

    // Delete associated file if it exists
    if (record.invoiceUrl) {
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
