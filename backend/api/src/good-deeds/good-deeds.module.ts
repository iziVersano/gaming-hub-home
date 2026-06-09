import { Module } from '@nestjs/common';
import { GoodDeedsController } from './good-deeds.controller';
import { GoodDeedsService } from './good-deeds.service';

@Module({
  controllers: [GoodDeedsController],
  providers: [GoodDeedsService],
})
export class GoodDeedsModule {}
