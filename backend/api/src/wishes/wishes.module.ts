import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { JsonStorageService } from '../storage/json-storage.service';

@Module({
  controllers: [WishesController],
  providers: [WishesService, JsonStorageService],
})
export class WishesModule {}
