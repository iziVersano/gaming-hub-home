import { Module } from '@nestjs/common';
import { GoodDeedsController } from './gooddeeds.controller';
import { GoodDeedsService } from './gooddeeds.service';
import { JsonStorageService } from '../storage/json-storage.service';

@Module({
  controllers: [GoodDeedsController],
  providers: [GoodDeedsService, JsonStorageService],
})
export class GoodDeedsModule {}
