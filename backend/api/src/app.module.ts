import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProductsModule } from './products/products.module';
import { WarrantyModule } from './warranty/warranty.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { JsonStorageService } from './storage/json-storage.service';
import { EmailService } from './email/email.service';

const jwtSecret = process.env.JWT_SECRET_KEY || 'ConsolTech-SuperSecret-JWT-Key-2024-MinLength32Chars!';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '8h' },
    }),
    ProductsModule,
    WarrantyModule,
    AuthModule,
    UploadModule,
  ],
  providers: [JsonStorageService, EmailService],
  exports: [JsonStorageService, EmailService, JwtModule],
})
export class AppModule {}
