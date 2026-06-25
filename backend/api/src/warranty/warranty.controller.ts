import { Controller, Get, Post, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WarrantyService } from './warranty.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { randomBytes } from 'crypto';

@Controller('api/warranty')
export class WarrantyController {
  constructor(private warrantyService: WarrantyService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('invoice', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (_req, file, cb) => {
          const uuid = randomBytes(8).toString('hex');
          cb(null, `${uuid}_${file.originalname}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  async submitWarranty(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const invoiceUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.warrantyService.submitWarranty({
      customerName: body.customerName,
      email: body.email,
      phone: body.phone,
      product: body.product,
      serialNumber: body.serialNumber,
      purchaseDate: body.purchaseDate,
      storeName: body.storeName,
      invoiceUrl,
      invoiceFileName: file?.originalname,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRecords() {
    return this.warrantyService.getAllRecords();
  }

  @Delete(':identifier')
  @UseGuards(JwtAuthGuard)
  async deleteRecord(@Param('identifier') identifier: string) {
    return this.warrantyService.deleteRecord(identifier);
  }
}
