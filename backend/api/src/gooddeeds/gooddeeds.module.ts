import { Module } from '@nestjs/common';
import { GoodDeedsController } from './gooddeeds.controller';
import { GoodDeedsService } from './gooddeeds.service';

@Module({
  controllers: [GoodDeedsController],
  providers: [GoodDeedsService],
})
export class GoodDeedsModule {}
