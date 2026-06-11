import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { JsonStorageService } from '../storage/json-storage.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, JsonStorageService],
})
export class PlacesModule {}
