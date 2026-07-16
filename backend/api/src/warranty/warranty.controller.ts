import { Controller, Get, Post, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { WarrantyService } from './warranty.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/warranty')
export class WarrantyController {
  constructor(private warrantyService: WarrantyService) {}

  @Post()
  @UseInterceptors(
    // Buffer in memory so the storage layer decides where the file lives
    // (Supabase Storage in production, local uploads/ in JSON dev mode).
    FileInterceptor('invoice', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async submitWarranty(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    return this.warrantyService.submitWarranty(
      {
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        product: body.product,
        serialNumber: body.serialNumber,
        purchaseDate: body.purchaseDate,
        storeName: body.storeName,
      },
      file ? { buffer: file.buffer, originalName: file.originalname, mimetype: file.mimetype } : undefined,
    );
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
