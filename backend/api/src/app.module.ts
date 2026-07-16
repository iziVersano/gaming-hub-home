import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProductsModule } from './products/products.module';
import { WarrantyModule } from './warranty/warranty.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { GoodDeedsModule } from './gooddeeds/gooddeeds.module';
import { WishesModule } from './wishes/wishes.module';
import { PlacesModule } from './places/places.module';
import { StorageModule } from './storage/storage.module';

const jwtSecret = process.env.JWT_SECRET_KEY || 'ConsolTech-SuperSecret-JWT-Key-2024-MinLength32Chars!';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '8h' },
    }),
    StorageModule,
    ProductsModule,
    WarrantyModule,
    AuthModule,
    UploadModule,
    GoodDeedsModule,
    WishesModule,
    PlacesModule,
  ],
  exports: [JwtModule],
})
export class AppModule {}
